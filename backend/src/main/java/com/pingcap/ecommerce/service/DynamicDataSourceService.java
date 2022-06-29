package com.pingcap.ecommerce.service;

import com.mysql.cj.jdbc.MysqlDataSource;
import com.pingcap.ecommerce.config.DynamicDataSource;
import com.pingcap.ecommerce.config.Env;
import com.pingcap.ecommerce.dao.snowflake.SnowflakeSchemaMapper;
import com.pingcap.ecommerce.dao.tidb.TableStatsMapper;
import com.pingcap.ecommerce.dto.SnowflakeDataSourceConfig;
import com.pingcap.ecommerce.dto.TiDBDataSourceConfig;
import com.pingcap.ecommerce.exception.DataSourceNotFoundException;
import com.pingcap.ecommerce.exception.FailedToConnectException;
import com.pingcap.ecommerce.vo.TableInfo;
import com.zaxxer.hikari.HikariDataSource;
import lombok.extern.slf4j.Slf4j;
import net.snowflake.client.jdbc.SnowflakeBasicDataSource;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.init.ScriptUtils;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.*;
import java.util.*;

@Slf4j
@Service
public class DynamicDataSourceService {

    private static final String TIDB_DATA_SOURCE_KEY = "TIDB";

    // Because of TiDB's compatibility with MySQL protocol, we can use the MySQL driver directly.
    private static final String TIDB_DRIVER_NAME = "com.mysql.cj.jdbc.Driver";

    private static final String SNOWFLAKE_DATA_SOURCE_KEY = "SNOWFLAKE";

    private static final String SNOWFLAKE_DRIVER_NAME = "com.snowflake.client.jdbc.SnowflakeDriver";

    private static final String TIDB_INIT_SCHEMA_SQL_FILE = "tidb-init-schema.sql";

    private static final String[] TIDB_REQUIRED_TABLES = new String[]{
        "users", "orders", "items", "expresses", "hot_items", "user_labels", "order_stats_history", "job_instances", "table_stats_history"
    };

    private static final String SNOWFLAKE_INIT_SCHEMA_SQL_FILE = "snowflake-init-schema.sql";

    private static final String[] SNOWFLAKE_REQUIRED_TABLES = new String[]{
        "hot_items", "user_labels"
    };

    private TiDBDataSourceConfig tidbDataSourceConfig;

    private boolean tidbSchemaCreated = false;

    private SnowflakeDataSourceConfig snowflakeDataSourceConfig;

    private boolean snowflakeSchemaCreated = false;

    private final Env env;

    private final DynamicDataSource tidbDatasource;

    private final DynamicDataSource snowflakeDatasource;

    private final TableStatsMapper tableStatsMapper;

    private final SnowflakeSchemaMapper snowflakeSchemaMapper;

    public DynamicDataSourceService(
        Env env,
        @Qualifier("TiDBDynamicDataSource") DynamicDataSource tidbDatasource,
        @Qualifier("SnowflakeDynamicDataSource") DynamicDataSource snowflakeDatasource,
        TableStatsMapper tableStatsMapper,
        SnowflakeSchemaMapper snowflakeSchemaMapper
    ) {
        this.env = env;
        this.tidbDatasource = tidbDatasource;
        this.snowflakeDatasource = snowflakeDatasource;
        this.tableStatsMapper = tableStatsMapper;
        this.snowflakeSchemaMapper = snowflakeSchemaMapper;
    }

    /**
     * TiDB Part.
     */
    public boolean isTiDBConfigured() {
        return tidbDatasource.configured();
    }
    
    public boolean isTiDBSchemaCreated() {
        return tidbSchemaCreated;
    }

    public boolean isTiDBReady() {
        return isTiDBConfigured() && isTiDBSchemaCreated();
    }

    public void configTiDBDataSource(TiDBDataSourceConfig cfg) throws SQLException {
        String flags = "rewriteBatchedStatements=true&allowLoadLocalInfile=true&zeroDateTimeBehavior=convertToNull&serverTimezone=UTC";
        String jdbcURL = String.format("jdbc:mysql://%s:%s?%s", cfg.getHost(), cfg.getPort(), flags);
        String jdbcURLWithDBName = String.format("jdbc:mysql://%s:%s/%s?%s", cfg.getHost(), cfg.getPort(), cfg.getDatabase(), flags);
        MysqlDataSource ds = buildDataSource(MysqlDataSource.class, TIDB_DRIVER_NAME, jdbcURL, cfg.getUser(), cfg.getPassword());

        if (testTiDBDataSource(ds, cfg.getDatabase())) {
            cfg.setUrl(jdbcURLWithDBName);
            HikariDataSource dbPool = buildDataSource(HikariDataSource.class, TIDB_DRIVER_NAME, jdbcURLWithDBName, cfg.getUser(), cfg.getPassword());
            tidbDatasource.changeDataSource(TIDB_DATA_SOURCE_KEY, dbPool);
            this.tidbDataSourceConfig = cfg;
            this.env.setTiDBConfig(cfg);
            this.env.saveToFile();
            log.info("Config a new TiDB datasource successfully.");

            try (Connection conn = tidbDatasource.getConnection()) {
                this.tidbSchemaCreated = checkTiDBSchema(conn);
            }
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

    private boolean testTiDBDataSource(MysqlDataSource ds, String dbName) {
        int retry = 1;
        int maxRetry = 3;
        while (retry <= maxRetry) {
            try (
                Connection conn = ds.getConnection();
            ) {
                // SHOW DATABASES;
                Statement showDBStmt = conn.createStatement();
                ResultSet resultSet = showDBStmt.executeQuery("SHOW DATABASES;");
                Set<String> dbNames = new HashSet<>();
                while (resultSet.next()) {
                    dbNames.add(resultSet.getString(1));
                }
                showDBStmt.close();
                log.debug("[test tidb datasource]: SHOW DATABASES, got: ", dbNames.toArray());

                // CREATE DATABASE IF NOT EXISTS <DATABASE>;
                if (!dbNames.contains(dbName)) {
                    // Create if not existed the specified database.
                    Statement createDBStmt = conn.createStatement();
                    createDBStmt.execute(String.format("CREATE DATABASE IF NOT EXISTS %s;", dbName));
                    createDBStmt.close();
                    log.debug("[test tidb datasource]: Didn't exist database named {}, create it: ", dbName);
                } else {
                    log.debug("[test tidb datasource]: Database named {} has existed.", dbName);
                }

                // USE <DATABASE>;
                Statement useDBStmt = conn.createStatement();
                useDBStmt.execute(String.format("USE %s;", dbName));
                useDBStmt.close();
                log.debug("[test tidb datasource]: Switch to the database named {}.", dbName);

                // SELECT 1;
                Statement testStmt = conn.createStatement();
                testStmt.executeQuery("SELECT 1;");
                log.debug("[test tidb datasource]: Test query execute successfully.");
                return testStmt.getResultSet().next();
            } catch (SQLException e) {
                if (retry == maxRetry) {
                    String msg = String.format("Failed to connect TiDB database, please check the connection config again: %s.",  e.getLocalizedMessage());
                    throw new FailedToConnectException(msg, e);
                } else {
                    log.error("Failed to connect TiDB database, retry {}/{}: {}", retry, maxRetry, e.getMessage());
                    retry++;
                }
            }
        }
        return false;
    }

    private boolean checkTiDBSchema(Connection conn) throws SQLException {
        if (!isTiDBConfigured()) {
            return false;
        }

        // SHOW TABLES;
        Statement showTableStmt = conn.createStatement();
        ResultSet resultSet = showTableStmt.executeQuery("SHOW TABLES;");
        Set<String> tableNames = new HashSet<>();
        while (resultSet.next()) {
            tableNames.add(resultSet.getString(1));
        }
        showTableStmt.close();

        for (String tableName : TIDB_REQUIRED_TABLES) {
            if (!tableNames.contains(tableName)) {
                return false;
            }
        }

        return true;
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
        checkTiDBSchema(conn);
    }

    public List<TableInfo> getTiDBSchemaTables() {
        if (!tidbDatasource.configured()) {
            throw new DataSourceNotFoundException("TiDB datasource not found, please config it first.");
        }

        String schemaName = tidbDataSourceConfig.getDatabase();
        List<TableInfo> tableInfos = new ArrayList<>();

        try {
            tableInfos = tableStatsMapper.getTableInfos(schemaName, null);
        } catch (Exception e) {
            log.warn("Failed to get tidb tables information from SCHEMA_INFORMATION table: {}.", e.getMessage());
        }

        return tableInfos;
    }

    /**
     * Snowflake Part.
     */

    public boolean isSnowflakeConfigured() {
        return snowflakeDatasource.configured();
    }

    public boolean isSnowflakeSchemaCreated() {
        return snowflakeSchemaCreated;
    }

    public boolean isSnowflakeReady() {
        return isSnowflakeConfigured() && isSnowflakeSchemaCreated();
    }

    public void configSnowflakeDataSource(SnowflakeDataSourceConfig cfg) throws SQLException {
        String jdbcURL = String.format("jdbc:snowflake://%s:443?role=%s", cfg.getHost(), cfg.getRole());
        String jdbcURLWithSchemaName = String.format("jdbc:snowflake://%s:443?db=%s&warehouse=%s&schema=%s&role=%s",
                cfg.getHost(), cfg.getDb(), cfg.getWh(), cfg.getSchema(), cfg.getRole());
        SnowflakeBasicDataSource ds = buildDataSource(SnowflakeBasicDataSource.class, SNOWFLAKE_DRIVER_NAME, jdbcURL, cfg.getUser(), cfg.getPassword());

        if (testSnowflakeDataSource(ds, cfg.getDb(), cfg.getSchema())) {
            cfg.setUrl(jdbcURLWithSchemaName);
            HikariDataSource dbPool = buildDataSource(HikariDataSource.class, SNOWFLAKE_DRIVER_NAME, jdbcURLWithSchemaName, cfg.getUser(), cfg.getPassword());
            snowflakeDatasource.changeDataSource(SNOWFLAKE_DATA_SOURCE_KEY, dbPool);
            this.snowflakeDataSourceConfig = cfg;
            this.env.setSnowflakeConfig(cfg);
            this.env.saveToFile();
            log.info("Config a new Snowflake datasource successfully.");

            try (Connection conn = snowflakeDatasource.getConnection()) {
                this.snowflakeSchemaCreated = checkSnowflakeSchema(conn);
            }
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

    private boolean testSnowflakeDataSource(SnowflakeBasicDataSource ds, String dbName, String schemaName) {
        int retry = 1;
        int maxRetry = 3;
        while (retry <= maxRetry) {
            try (
                Connection conn = ds.getConnection();
            ) {
                Statement stmt = conn.createStatement();
                stmt.execute("ALTER SESSION SET JDBC_QUERY_RESULT_FORMAT='JSON'");
                stmt.close();

                // SHOW DATABASES;
                Statement showDBStmt = conn.createStatement();
                ResultSet resultSet = showDBStmt.executeQuery("SHOW DATABASES;");
                Set<String> dbNames = new HashSet<>();
                while (resultSet.next()) {
                    dbNames.add(resultSet.getString("name"));
                }
                showDBStmt.close();

                // CREATE DATABASE IF NOT EXISTS <DATABASE>;
                if (!dbNames.contains(dbName)) {
                    Statement createDBStmt = conn.createStatement();
                    createDBStmt.execute(String.format("CREATE DATABASE IF NOT EXISTS %s;", dbName));
                    createDBStmt.close();
                }

                // USE DATABASE <DATABASE>;
                Statement useDBStmt = conn.createStatement();
                useDBStmt.execute(String.format("USE DATABASE %s;", dbName));
                useDBStmt.close();

                // SHOW SCHEMAS;
                Statement showSchemaStmt = conn.createStatement();
                ResultSet schemaResultSet = showSchemaStmt.executeQuery("SHOW SCHEMAS;");
                Set<String> schemaNames = new HashSet<>();
                while (schemaResultSet.next()) {
                    schemaNames.add(schemaResultSet.getString("name"));
                }
                showSchemaStmt.close();

                // CREATE SCHEMA IF NOT EXISTS <SCHEMA>;
                if (!schemaNames.contains(schemaName)) {
                    Statement createDBStmt = conn.createStatement();
                    createDBStmt.execute(String.format("CREATE SCHEMA IF NOT EXISTS %s;", schemaName));
                    createDBStmt.close();
                }

                // USE SCHEMA <SCHEMA>;
                Statement useSchemaStmt = conn.createStatement();
                useSchemaStmt.execute(String.format("USE SCHEMA %s;", schemaName));
                useSchemaStmt.close();

                // SELECT 1;
                Statement testStmt = conn.createStatement();
                testStmt.executeQuery("SELECT 1;");

                return testStmt.getResultSet().next();
            } catch (SQLException e) {
                if (retry == maxRetry) {
                    String msg = String.format("Failed to connect Snowflake database, please check the connection config again: %s.",  e.getLocalizedMessage());
                    throw new FailedToConnectException(msg, e);
                } else {
                    log.error("Failed to connect Snowflake database, retry {}/{}: {} {}", retry, maxRetry, e.getSQLState(), e.getMessage());
                    retry++;
                }
            }
        }
        return false;
    }

    private boolean checkSnowflakeSchema(Connection conn) throws SQLException {
        if (!isSnowflakeConfigured()) {
            return false;
        }

        Statement stmt = conn.createStatement();
        stmt.execute("ALTER SESSION SET JDBC_QUERY_RESULT_FORMAT='JSON'");
        stmt.close();

        // SHOW TABLES;
        Statement showTableStmt = conn.createStatement();
        ResultSet resultSet = showTableStmt.executeQuery("SHOW TABLES;");
        Set<String> tableNames = new HashSet<>();
        while (resultSet.next()) {
            tableNames.add(resultSet.getString("name"));
        }
        showTableStmt.close();

        for (String tableName : SNOWFLAKE_REQUIRED_TABLES) {
            if (!tableNames.contains(tableName)) {
                return false;
            }
        }

        return true;
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
        checkSnowflakeSchema(conn);
    }

    public List<TableInfo> getSnowflakeSchemaTables() {
        return snowflakeSchemaMapper.getTableInfos();
    }

    /**
     * Common Part.
     */
    private <D extends DataSource> D buildDataSource(Class<D> driverClass, String driverName, String jdbcURL, String user, String pwd) {
        return DataSourceBuilder
            .create()
            .type(driverClass)
            .driverClassName(driverName)
            .url(jdbcURL)
            .username(user)
            .password(pwd)
            .build();
    }

}
