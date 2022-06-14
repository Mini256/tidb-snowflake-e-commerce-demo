package com.pingcap.ecommerce.cli.command;

import com.beust.jcommander.Parameters;
import com.beust.jcommander.internal.DefaultConsole;
import com.pingcap.ecommerce.cli.connector.Connector;
import net.snowflake.client.jdbc.SnowflakeBasicDataSource;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.jdbc.datasource.DataSourceUtils;

import java.io.Console;
import java.io.File;
import java.io.OutputStream;
import java.io.StringWriter;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Scanner;

import static java.lang.System.exit;
import static java.lang.System.out;

@Parameters(
    commandNames = { "check-env" },
    commandDescription = "Check that the necessary environment variables are all provided."
)
public class CheckEnvCommend {

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

    public void checkEnv() {
        File file = new File(".env");
        if (file.exists()) {
            out.println("Found .env file, skipping environment check.");
            return;
        }

        Map<String, String> env = System.getenv();
        Console console = System.console();
        List<String> envVars = new ArrayList<>();

        out.print("\n");
        out.println("1. Configure TiDB");

        int retry = 1;
        while (true) {
            String tidbHost = inputEnvVariable(env, console, envVars, TIDB_HOST, true, false);
            String tidbPort = inputEnvVariable(env, console, envVars, TIDB_PORT, true, false);
            String tidbDatabase = inputEnvVariable(env, console, envVars, TIDB_DATABASE, true, false);
            String tidbUsername = inputEnvVariable(env, console, envVars, TIDB_USERNAME, true, false);
            String tidbPassword = inputEnvVariable(env, console, envVars, TIDB_PASSWORD, false, true);
            String tidbJdbcUrl = String.format("jdbc:mysql://%s:%s/%s?rewriteBatchedStatements=true&allowLoadLocalInfile=true&zeroDateTimeBehavior=convertToNull",
                    tidbHost, tidbPort, tidbDatabase);
            envVars.add(String.format("%s=%s", TIDB_URL, tidbJdbcUrl));

            DataSourceProperties properties = new DataSourceProperties();
            properties.setDriverClassName("com.mysql.cj.jdbc.Driver");
            properties.setUrl(tidbJdbcUrl);
            properties.setUsername(tidbUsername);
            properties.setPassword(tidbPassword);

            if (Connector.tryToConnect(properties) || retry >= 3) {
                out.println("Successfully connected to TiDB!");
                break;
            } else {
                out.println("Failed to connect to TiDB, please check if your configuration is correct.");
                retry++;
            }
        }

        out.print("\n");
        out.println("2. Configure Snowflake");

        retry = 1;
        while (true) {
            String snowflakeHost = inputEnvVariable(env, console, envVars, SNOWSQL_HOST, true, false);
            String snowflakeAccount = inputEnvVariable(env, console, envVars, SNOWSQL_ACCOUNT, true, false);
            String snowflakeWarehouse = inputEnvVariable(env, console, envVars, SNOWSQL_WAREHOUSE, true, false);
            String snowflakeDatabase = inputEnvVariable(env, console, envVars, SNOWSQL_DATABASE, true, false);
            String snowflakeSchema = inputEnvVariable(env, console, envVars, SNOWSQL_SCHEMA, true, false);
            String snowflakeUser = inputEnvVariable(env, console, envVars, SNOWSQL_USER, true, false);
            String snowflakeRole = inputEnvVariable(env, console, envVars, SNOWSQL_ROLE, true, false);
            String snowflakePwd = inputEnvVariable(env, console, envVars, SNOWSQL_PWD, false, true);
            String snowflakeUrl = String.format("jdbc:snowflake://%s:443?user=%s&warehouse=%s&db=%s&schema=%s&role=%s",
                    snowflakeHost, snowflakeUser, snowflakeWarehouse, snowflakeDatabase, snowflakeSchema, snowflakeRole);
            envVars.add(String.format("%s=%s", SNOWSQL_URL, snowflakeUrl));

            DataSourceProperties properties = new DataSourceProperties();
            properties.setDriverClassName("com.snowflake.client.jdbc.SnowflakeDriver");
            properties.setUrl(snowflakeUrl);
            properties.setUsername(snowflakeUser);
            properties.setPassword(snowflakePwd);

            if (Connector.tryToConnect(properties) || retry >= 3) {
                out.println("Successfully connected to Snowflake!");
                break;
            } else {
                out.println("Failed to connect to Snowflake, please check if your configuration is correct.");
                retry++;
            }
        }


        try {
            Files.write(Path.of(file.getPath()), envVars, StandardCharsets.UTF_8);
            out.println("Successfully write configuration to .env file.");
        } catch (Exception e) {
            out.println("Failed to write .env file.");
            exit(1);
        }
    }

    private String inputEnvVariable(
        Map<String, String> env, Console console, List<String> envVars, String envName, boolean required, boolean secret
    ) {
        do {
            String existedValue = env.get(envName);
            String newValue;
            if (existedValue != null) {
                if (secret) {
                    newValue = new String(
                        console.readPassword(
                            String.format("%s: (%s) ", envName, existedValue.isEmpty() ? "no password" : "has password")
                        )
                    );
                } else {
                    newValue = console.readLine(String.format("%s: (%s) ", envName, existedValue));
                }
            } else {
                if (secret) {
                    newValue = new String(console.readPassword(String.format("%s: ", envName)));
                } else {
                    newValue = console.readLine(String.format("%s: ", envName));
                }
            }

            boolean hasExistedValue = existedValue != null && !existedValue.isEmpty();
            if (required && !hasExistedValue && newValue.isEmpty()) {
                out.printf("Environment variable %s is required, please input it.\n", envName);
                continue;
            }

            String value = existedValue;
            if (!newValue.isEmpty() || value == null) {
                value = newValue;
            }

            envVars.add(String.format("%s=%s", envName, value));
            return value;
        } while (true);
    }

}
