package com.pingcap.ecommerce.cli.connector;

import com.zaxxer.hikari.HikariDataSource;
import org.apache.ibatis.datasource.unpooled.UnpooledDataSource;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.jdbc.datasource.SingleConnectionDataSource;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class Connector {

    public static boolean tryToConnect(DataSourceProperties properties) {
        DataSource ds = properties.initializeDataSourceBuilder().type(SingleConnectionDataSource.class).build();

        try (
            Connection conn = ds.getConnection();
            Statement stmt = conn.createStatement();
            ResultSet resultSet = stmt.executeQuery("SELECT 1;");
        ) {
            if (resultSet.next()) {
                return true;
            }
        } catch (SQLException e) {
            System.out.printf(
                "Failed to connect current database, please check the connection config again: %s.\n",
                e.getLocalizedMessage()
            );
        }
        return false;
    }

}
