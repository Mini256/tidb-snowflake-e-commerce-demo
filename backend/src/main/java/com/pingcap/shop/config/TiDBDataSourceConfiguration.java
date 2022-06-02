package com.pingcap.shop.config;

import com.zaxxer.hikari.HikariDataSource;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;

import javax.sql.DataSource;

@Configuration
@MapperScan(basePackages = "com.pingcap.shop.dao.tidb", sqlSessionFactoryRef = "PrimarySessionFactory")
public class TiDBDataSourceConfiguration {

    @Bean(name = "PrimaryDataSourceProperties")
    @Primary
    @ConfigurationProperties("spring.datasource.tidb")
    public DataSourceProperties dataSourceProperties() {
        return new DataSourceProperties();
    }

    @Bean(name = "PrimaryDataSource")
    @Primary
    public DataSource PrimaryDataSource(@Qualifier("PrimaryDataSourceProperties") DataSourceProperties properties) {
        return properties.initializeDataSourceBuilder().type(HikariDataSource.class).build();
    }

    @Bean(name = "PrimarySessionFactory")
    @Primary
    public SqlSessionFactory PrimarySessionFactory(@Qualifier("PrimaryDataSource") DataSource dataSource) throws Exception {
        SqlSessionFactoryBean bean = new SqlSessionFactoryBean();
        bean.setDataSource(dataSource);
        bean.setMapperLocations(new PathMatchingResourcePatternResolver().getResources("classpath*:**/mappers/tidb/*.xml"));
        return bean.getObject();
    }

    @Bean(name = "PrimaryTransactionManager")
    @Primary
    public DataSourceTransactionManager PrimaryTransactionManager(@Qualifier("PrimaryDataSource") DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }

    @Bean(name = "PrimarySessionTemplate")
    @Primary
    public SqlSessionTemplate PrimarySessionTemplate(@Qualifier("PrimarySessionFactory") SqlSessionFactory sqlSessionFactory) throws Exception {
        return new SqlSessionTemplate(sqlSessionFactory);
    }

}
