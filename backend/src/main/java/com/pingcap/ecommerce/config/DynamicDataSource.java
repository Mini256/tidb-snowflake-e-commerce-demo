package com.pingcap.ecommerce.config;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;

import javax.sql.DataSource;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

public class DynamicDataSource extends AbstractRoutingDataSource {

    public static final String DEFAULT_KEY = "PLACEHOLDER";

    private String currentKey = DEFAULT_KEY;

    public static DynamicDataSource build() {
        DynamicDataSource dataSource = new DynamicDataSource();
        Map<Object, Object> targetDataSources = new HashMap<>();
        targetDataSources.put(DEFAULT_KEY, initPlaceHolderDatasource());
        dataSource.setTargetDataSources(targetDataSources);
        dataSource.afterPropertiesSet();
        return dataSource;
    }

    // We use H2 as our placeholder database, it is not responsible for executing queries, only for placeholders.
    private static DataSource initPlaceHolderDatasource() {
        return DataSourceBuilder
            .create()
            .type(HikariDataSource.class)
            .driverClassName("org.h2.Driver")
            .url("jdbc:h2:mem:testdb")
            .username("sa")
            .password("password")
            .build();
    }

    @Override
    protected Object determineCurrentLookupKey() {
        return currentKey;
    }

    public boolean configured() {
        return !Objects.equals(currentKey, DEFAULT_KEY);
    }

    public void changeDataSource(String key, DataSource dataSource) {
        Map<Object, Object> map = Collections.singletonMap(key, dataSource);
        this.currentKey = key;
        this.setTargetDataSources(map);
        this.setDefaultTargetDataSource(dataSource);
        this.afterPropertiesSet();
    }

    public DataSource getDataSource() {
        return this.getDataSource();
    }

}
