package com.pingcap.ecommerce.cli.command;

import com.beust.jcommander.Parameters;

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
        Scanner sc = new Scanner(System.in);
        List<String> envVars = new ArrayList<>();

        out.print("\n");
        out.println("1. Configure TiDB");

        String tidbHost = inputEnvVariable(env, sc, envVars, TIDB_HOST, true, false);
        String tidbPort = inputEnvVariable(env, sc, envVars, TIDB_PORT, true, false);
        String tidbDatabase = inputEnvVariable(env, sc, envVars, TIDB_DATABASE, true, false);
        String tidbUsername = inputEnvVariable(env, sc, envVars, TIDB_USERNAME, true, false);
        String tidbPassword = inputEnvVariable(env, sc, envVars, TIDB_PASSWORD, false, true);
        String tidbJdbcUrl = String.format("jdbc:mysql://%s:%s/%s?rewriteBatchedStatements=true&allowLoadLocalInfile=true&zeroDateTimeBehavior=convertToNull",
                tidbHost, tidbPort, tidbDatabase);
        envVars.add(String.format("%s=%s", TIDB_URL, tidbJdbcUrl));

        out.print("\n");
        out.println("2. Configure Snowflake");

        String snowflakeHost = inputEnvVariable(env, sc, envVars, SNOWSQL_HOST, true, false);
        String snowflakeAccount = inputEnvVariable(env, sc, envVars, SNOWSQL_ACCOUNT, true, false);
        String snowflakeWarehouse = inputEnvVariable(env, sc, envVars, SNOWSQL_WAREHOUSE, true, false);
        String snowflakeDatabase = inputEnvVariable(env, sc, envVars, SNOWSQL_DATABASE, true, false);
        String snowflakeSchema = inputEnvVariable(env, sc, envVars, SNOWSQL_SCHEMA, true, false);
        String snowflakeUser = inputEnvVariable(env, sc, envVars, SNOWSQL_USER, true, false);
        String snowflakeRole = inputEnvVariable(env, sc, envVars, SNOWSQL_ROLE, true, false);
        String snowflakePwd = inputEnvVariable(env, sc, envVars, SNOWSQL_PWD, false, true);
        String snowflakeUrl = String.format("jdbc:snowflake://%s:443?user=%s&warehouse=%s&db=%s&schema=%s&role=%s",
                snowflakeHost, snowflakeUser, snowflakeWarehouse, snowflakeDatabase, snowflakeSchema, snowflakeRole);
        envVars.add(String.format("%s=%s", SNOWSQL_URL, snowflakeUrl));

        try {
            Files.write(Path.of(file.getPath()), envVars, StandardCharsets.UTF_8);
        } catch (Exception e) {
            out.println("Failed to write .env file.");
            exit(1);
        }
    }

    private String inputEnvVariable(
        Map<String, String> env, Scanner sc, List<String> envVars, String envName, boolean required, boolean secret
    ) {
        do {
            String existedValue = env.get(envName);
            if (existedValue != null) {
                if (secret) {
                    out.printf("%s: (%s)", envName, existedValue.isEmpty() ? "no password" : "has password");
                } else {
                    out.printf("%s: (%s)", envName, existedValue);
                }
            } else {
                out.printf("%s: ", envName);
            }
            String newValue = sc.nextLine();

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
