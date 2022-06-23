package com.pingcap.ecommerce.config;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;

import javax.sql.DataSource;

@Configuration
@MapperScan(basePackages = "com.pingcap.ecommerce.dao.snowflake", sqlSessionFactoryRef = "SecondarySessionFactory")
public class SnowflakeDataSourceConfiguration {

    @Bean(name = "SnowflakeDynamicDataSource")
    public DynamicDataSource tidbDataSource() {
        return DynamicDataSource.build();
    }

    @Bean(name = "SecondarySessionFactory")
    public SqlSessionFactory SecondarySessionFactory(@Qualifier("SnowflakeDynamicDataSource") DataSource dataSource) throws Exception {
        SqlSessionFactoryBean bean = new SqlSessionFactoryBean();
        bean.setDataSource(dataSource);
        bean.setMapperLocations(new PathMatchingResourcePatternResolver().getResources("classpath*:**/mappers/snowflake/*.xml"));
        return bean.getObject();
    }

    @Bean(name = "SecondaryTransactionManager")
    public DataSourceTransactionManager SecondaryTransactionManager(@Qualifier("SnowflakeDynamicDataSource") DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }

    @Bean(name = "SecondarySessionTemplate")
    public SqlSessionTemplate SecondarySessionTemplate(@Qualifier("SecondarySessionFactory") SqlSessionFactory sqlSessionFactory) throws Exception {
        return new SqlSessionTemplate(sqlSessionFactory);
    }

}
