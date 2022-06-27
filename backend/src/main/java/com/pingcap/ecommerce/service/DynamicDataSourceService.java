package com.pingcap.ecommerce.service;

import com.pingcap.ecommerce.config.DynamicDataSource;
import com.pingcap.ecommerce.config.Env;
import com.pingcap.ecommerce.dao.snowflake.SnowflakeSchemaMapper;
import com.pingcap.ecommerce.dao.tidb.SchemaMapper;
import com.pingcap.ecommerce.dto.SnowflakeDataSourceConfig;
import com.pingcap.ecommerce.dto.TiDBDataSourceConfig;
import com.pingcap.ecommerce.exception.DataSourceNotFoundException;
import com.pingcap.ecommerce.exception.FailedToConnectException;
import com.pingcap.ecommerce.vo.TableInfo;
import com.zaxxer.hikari.HikariDataSource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.init.ScriptUtils;
import org.springframework.stereotype.Service;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class DynamicDataSourceService {

    private static final String TIDB_DATA_SOURCE_KEY = "TIDB";

    // Because of TiDB's compatibility with MySQL protocol, we can use the MySQL driver directly.
    private static final String TIDB_DRIVER_NAME = "com.mysql.cj.jdbc.Driver";

    private static final String SNOWFLAKE_DATA_SOURCE_KEY = "SNOWFLAKE";

    private static final String SNOWFLAKE_DRIVER_NAME = "com.snowflake.client.jdbc.SnowflakeDriver";

    private static final String TIDB_INIT_SCHEMA_SQL_FILE = "tidb-init-schema.sql";

    private static final String SNOWFLAKE_INIT_SCHEMA_SQL_FILE = "snowflake-init-schema.sql";

    private TiDBDataSourceConfig tidbDataSourceConfig;

    private SnowflakeDataSourceConfig snowflakeDataSourceConfig;

    private final Env env;

    private final DynamicDataSource tidbDatasource;

    private final DynamicDataSource snowflakeDatasource;

    private final SchemaMapper schemaMapper;

    private final SnowflakeSchemaMapper snowflakeSchemaMapper;

    public DynamicDataSourceService(
        Env env,
        @Qualifier("TiDBDynamicDataSource") DynamicDataSource tidbDatasource,
        @Qualifier("SnowflakeDynamicDataSource") DynamicDataSource snowflakeDatasource,
        SchemaMapper schemaMapper,
        SnowflakeSchemaMapper snowflakeSchemaMapper
    ) {
        this.env = env;
        this.tidbDatasource = tidbDatasource;
        this.snowflakeDatasource = snowflakeDatasource;
        this.schemaMapper = schemaMapper;
        this.snowflakeSchemaMapper = snowflakeSchemaMapper;
    }

    /**
     * TiDB Part.
     */
    public boolean isTiDBConfigured() {
        return tidbDatasource.configured();
    }

    public void configTiDBDataSource(TiDBDataSourceConfig cfg) {
        String flags = "rewriteBatchedStatements=true&allowLoadLocalInfile=true&zeroDateTimeBehavior=convertToNull&serverTimezone=UTC";
        String jdbcURL = String.format("jdbc:mysql://%s:%s/%s?%s", cfg.getHost(), cfg.getPort(), cfg.getDatabase(), flags);
        HikariDataSource ds = buildDataSource(TIDB_DRIVER_NAME, jdbcURL, cfg.getUser(), cfg.getPassword());
        cfg.setUrl(jdbcURL);

        if (testDataSource(ds)) {
            tidbDatasource.changeDataSource(TIDB_DATA_SOURCE_KEY, ds);
            this.tidbDataSourceConfig = cfg;
            this.env.setTiDBConfig(cfg);
            this.env.saveToFile();
        }
    }

    public TiDBDataSourceConfig getTidbDataSourceConfig() {
        if (tidbDatasource.configured()) {
            TiDBDataSourceConfig cfg = new TiDBDataSourceConfig();
            BeanUtils.copyProperties(tidbDataSourceConfig, cfg, "password");
            return cfg;
        } else {
            throw new DataSourceNotFoundException();
        }
    }

    public void initTiDBSchema() throws SQLException {
        if (!tidbDatasource.configured()) {
            throw new DataSourceNotFoundException("TiDB datasource not found, please config it first.");
        }

        log.info("Loading DDL from file {}.", TIDB_INIT_SCHEMA_SQL_FILE);
        ClassPathResource sqlFileResource = new ClassPathResource(TIDB_INIT_SCHEMA_SQL_FILE);
        Connection conn = tidbDatasource.getConnection();
        log.info("Executing DDL in the file {}.", TIDB_INIT_SCHEMA_SQL_FILE);
        ScriptUtils.executeSqlScript(conn, sqlFileResource);
        log.info("Finished execute DDL in the file {}.", TIDB_INIT_SCHEMA_SQL_FILE);
    }

    public List<TableInfo> getTiDBSchemaTables() {
        if (!tidbDatasource.configured()) {
            throw new DataSourceNotFoundException("TiDB datasource not found, please config it first.");
        }

        String schemaName = tidbDataSourceConfig.getDatabase();
        List<TableInfo> tableInfos = new ArrayList<>();

        try {
            tableInfos = schemaMapper.getTableInfos(schemaName);
        } catch (Exception e) {
            log.warn("Failed to get tidb tables information from SCHEMA_INFORMATION table, fallback to use `SHOW TABLES`: {}.", e.getMessage());
        }

        if (tableInfos.isEmpty()) {
            List<String> tableNames = schemaMapper.getTableNames();
            for (String tableName : tableNames) {
                tableInfos.add(new TableInfo("def", schemaName, tableName, "BASE TABLE"));
            }
        }

        return tableInfos;
    }

    /**
     * Snowflake Part.
     */

    public boolean isSnowflakeConfigured() {
        return snowflakeDatasource.configured();
    }

    public void configSnowflakeDataSource(SnowflakeDataSourceConfig cfg) {
        String jdbcURL = String.format("jdbc:snowflake://%s:443?db=%s&warehouse=%s&schema=%s&role=%s",
                cfg.getHost(), cfg.getDb(), cfg.getWh(), cfg.getSchema(), cfg.getRole());
        HikariDataSource ds = buildDataSource(SNOWFLAKE_DRIVER_NAME, jdbcURL, cfg.getUser(), cfg.getPassword());
        cfg.setUrl(jdbcURL);

        if (testDataSource(ds)) {
            snowflakeDatasource.changeDataSource(SNOWFLAKE_DATA_SOURCE_KEY, ds);
            this.snowflakeDataSourceConfig = cfg;
            this.env.setSnowflakeConfig(cfg);
            this.env.saveToFile();
        }
    }

    public SnowflakeDataSourceConfig getSnowflakeDataSourceConfig() {
        if (snowflakeDatasource.configured()) {
            SnowflakeDataSourceConfig cfg = new SnowflakeDataSourceConfig();
            BeanUtils.copyProperties(snowflakeDataSourceConfig, cfg, "password");
            return cfg;
        } else {
            throw new DataSourceNotFoundException();
        }
    }

    public void initSnowflakeSchema() throws SQLException {
        if (!snowflakeDatasource.configured()) {
            throw new DataSourceNotFoundException("Snowflake datasource not found, please config it first.");
        }

        log.info("Loading DDL from file {}.", SNOWFLAKE_INIT_SCHEMA_SQL_FILE);
        ClassPathResource sqlFileResource = new ClassPathResource(SNOWFLAKE_INIT_SCHEMA_SQL_FILE);
        Connection conn = snowflakeDatasource.getConnection();
        log.info("Executing DDL in the file {}.", SNOWFLAKE_INIT_SCHEMA_SQL_FILE);
        ScriptUtils.executeSqlScript(conn, sqlFileResource);
        log.info("Finished execute DDL in the file {}.", SNOWFLAKE_INIT_SCHEMA_SQL_FILE);
    }

    public List<TableInfo> getSnowflakeSchemaTables() {
        return snowflakeSchemaMapper.getTableInfos();
    }

    /**
     * Common Part.
     */
    private HikariDataSource buildDataSource(String driverName, String jdbcURL, String user, String pwd) {
        return DataSourceBuilder
            .create()
            .type(HikariDataSource.class)
            .driverClassName(driverName)
            .url(jdbcURL)
            .username(user)
            .password(pwd)
            .build();
    }

    private boolean testDataSource(HikariDataSource ds) {
        int retry = 1;
        int maxRetry = 3;
        while (retry <= maxRetry) {
            try (
                Connection conn = ds.getConnection();
                Statement stmt = conn.createStatement();
            ) {
                if (SNOWFLAKE_DRIVER_NAME.equals(ds.getDriverClassName())) {
                    stmt.execute("ALTER SESSION SET JDBC_QUERY_RESULT_FORMAT='JSON'");
                }

                ResultSet resultSet = stmt.executeQuery("SELECT 1;");
                return resultSet.next();
            } catch (SQLException e) {
                if (retry == maxRetry) {
                    String msg = String.format("Failed to connect current database, please check the connection config again: %s.",  e.getLocalizedMessage());
                    throw new FailedToConnectException(msg, e);
                } else {
                  log.error("Failed to connect current database, retry {}/{}: {}", retry, maxRetry, e.getMessage());
                  retry++;
                }
            }
        }
        return false;
    }

}
