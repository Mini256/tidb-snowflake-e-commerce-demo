package com.pingcap.ecommerce.config;

import com.pingcap.ecommerce.dto.SnowflakeDataSourceConfig;
import com.pingcap.ecommerce.dto.TiDBDataSourceConfig;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;

@Slf4j
@Component
public class Env {

    private static final String TIDB_URL = "TIDB_URL";
    private static final String TIDB_HOST = "TIDB_HOST";
    private static final String TIDB_PORT = "TIDB_PORT";
    private static final String TIDB_DATABASE = "TIDB_DATABASE";
    private static final String TIDB_USERNAME = "TIDB_USERNAME";
    private static final String TIDB_PASSWORD = "TIDB_PASSWORD";

    private static final String SNOWSQL_URL = "SNOWSQL_URL";
    private static final String SNOWSQL_HOST = "SNOWSQL_HOST";
    private static final String SNOWSQL_ACCOUNT = "SNOWSQL_ACCOUNT";
    private static final String SNOWSQL_WAREHOUSE = "SNOWSQL_WAREHOUSE";
    private static final String SNOWSQL_DATABASE = "SNOWSQL_DATABASE";
    private static final String SNOWSQL_PWD = "SNOWSQL_PWD";
    private static final String SNOWSQL_ROLE = "SNOWSQL_ROLE";
    private static final String SNOWSQL_SCHEMA = "SNOWSQL_SCHEMA";
    private static final String SNOWSQL_USER = "SNOWSQL_USER";

    private static final String ENV_FILEPATH = ".env";

    private static final List<String> keys = List.of(
        TIDB_URL, TIDB_HOST, TIDB_PORT, TIDB_DATABASE, TIDB_USERNAME, TIDB_PASSWORD,
        SNOWSQL_URL, SNOWSQL_HOST, SNOWSQL_ACCOUNT, SNOWSQL_WAREHOUSE, SNOWSQL_DATABASE,
        SNOWSQL_PWD, SNOWSQL_ROLE, SNOWSQL_SCHEMA, SNOWSQL_USER
    );

    private Map<String, String> envVars = new HashMap<>();

    public void loadFromSystemEnvironment() {
        Map<String, String> sysEnv = System.getenv();
        Map<String, String> envVars = new HashMap<>();
        for (String key : keys) {
            envVars.put(key, sysEnv.get(key));
        }
        this.envVars = envVars;
    }

    public TiDBDataSourceConfig getTiDBConfig() {
        TiDBDataSourceConfig cfg = new TiDBDataSourceConfig();
        cfg.setHost(envVars.get(TIDB_HOST));
        cfg.setPort(Integer.parseInt(envVars.get(TIDB_PORT)));
        cfg.setDatabase(envVars.get(TIDB_DATABASE));
        cfg.setUser(envVars.get(TIDB_USERNAME));
        cfg.setPassword(envVars.get(TIDB_PASSWORD));
        return cfg;
    }

    public void setTiDBConfig(TiDBDataSourceConfig cfg) {
        this.envVars.put(TIDB_URL, cfg.getUrl());
        this.envVars.put(TIDB_HOST, cfg.getHost());
        this.envVars.put(TIDB_PORT, cfg.getPort().toString());
        this.envVars.put(TIDB_DATABASE, cfg.getDatabase());
        this.envVars.put(TIDB_USERNAME, cfg.getUser());
        this.envVars.put(TIDB_PASSWORD, cfg.getPassword());
    }

    public SnowflakeDataSourceConfig getSnowflakeConfig() {
        SnowflakeDataSourceConfig cfg = new SnowflakeDataSourceConfig();
        cfg.setHost(envVars.get(SNOWSQL_HOST));
        cfg.setAccount(envVars.get(SNOWSQL_ACCOUNT));
        cfg.setUser(envVars.get(SNOWSQL_USER));
        cfg.setRole(envVars.get(SNOWSQL_ROLE));
        cfg.setPassword(envVars.get(SNOWSQL_PWD));
        cfg.setDb(envVars.get(SNOWSQL_DATABASE));
        cfg.setWh(envVars.get(SNOWSQL_WAREHOUSE));
        cfg.setSchema(envVars.get(SNOWSQL_SCHEMA));
        return cfg;
    }

    public void setSnowflakeConfig(SnowflakeDataSourceConfig cfg) {
        this.envVars.put(SNOWSQL_URL, cfg.getUrl());
        this.envVars.put(SNOWSQL_HOST, cfg.getHost());
        this.envVars.put(SNOWSQL_ACCOUNT, cfg.getAccount());
        this.envVars.put(SNOWSQL_USER, cfg.getUser());
        this.envVars.put(SNOWSQL_ROLE, cfg.getRole());
        this.envVars.put(SNOWSQL_PWD, cfg.getPassword());
        this.envVars.put(SNOWSQL_DATABASE, cfg.getDb());
        this.envVars.put(SNOWSQL_WAREHOUSE, cfg.getWh());
        this.envVars.put(SNOWSQL_SCHEMA, cfg.getSchema());
    }

    public void saveToFile() {
        try {
            List<String> pairs = new ArrayList<>();
            for (String key : keys) {
                pairs.add(String.format("%s=%s", key, envVars.get(key)));
            }
            Files.write(Path.of(ENV_FILEPATH), pairs, StandardCharsets.UTF_8);
        } catch (Exception e) {
            log.error("Failed to save env to .env file: {}", e.getMessage());
        }
    }

}
