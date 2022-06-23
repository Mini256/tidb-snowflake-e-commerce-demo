package com.pingcap.ecommerce.config;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;

import javax.sql.DataSource;

@Configuration
@MapperScan(basePackages = "com.pingcap.ecommerce.dao.tidb", sqlSessionFactoryRef = "PrimarySessionFactory")
public class TiDBDataSourceConfiguration {

    @Bean(name = "TiDBDynamicDataSource")
    public DynamicDataSource tidbDataSource() {
        return DynamicDataSource.build();
    }

    @Bean(name = "PrimarySessionFactory")
    @Primary
    public SqlSessionFactory PrimarySessionFactory(@Qualifier("TiDBDynamicDataSource") DataSource dataSource) throws Exception {
        SqlSessionFactoryBean bean = new SqlSessionFactoryBean();
        bean.setDataSource(dataSource);
        bean.setMapperLocations(new PathMatchingResourcePatternResolver().getResources("classpath*:**/mappers/tidb/*.xml"));
        return bean.getObject();
    }

    @Bean(name = "PrimaryTransactionManager")
    @Primary
    public DataSourceTransactionManager PrimaryTransactionManager(@Qualifier("TiDBDynamicDataSource") DataSource dataSource) {
        return new DataSourceTransactionManager(dataSource);
    }

    @Bean(name = "PrimarySessionTemplate")
    @Primary
    public SqlSessionTemplate PrimarySessionTemplate(@Qualifier("PrimarySessionFactory") SqlSessionFactory sqlSessionFactory) throws Exception {
        return new SqlSessionTemplate(sqlSessionFactory);
    }

}
