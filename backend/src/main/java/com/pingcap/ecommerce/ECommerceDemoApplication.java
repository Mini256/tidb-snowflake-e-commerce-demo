package com.pingcap.ecommerce;

import com.pingcap.ecommerce.config.Env;
import com.pingcap.ecommerce.dto.SnowflakeDataSourceConfig;
import com.pingcap.ecommerce.dto.TiDBDataSourceConfig;
import com.pingcap.ecommerce.service.DynamicDataSourceService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Properties;

@Slf4j
@SpringBootApplication
public class ECommerceDemoApplication implements CommandLineRunner {

  private final Env env;

  private final DynamicDataSourceService dynamicDataSourceService;

  public ECommerceDemoApplication(Env env, DynamicDataSourceService dynamicDataSourceService) {
    this.env = env;
    this.dynamicDataSourceService = dynamicDataSourceService;
  }

  public static void main(String[] args) {
    new SpringApplicationBuilder(ECommerceDemoApplication.class).run(args);
  }

  @Override
  public void run(String... args) {
    env.loadFromSystemEnvironment();
    TiDBDataSourceConfig tiDBConfig = env.getTiDBConfig();

    if (tiDBConfig.getHost() != null && !tiDBConfig.getHost().isEmpty()) {
      try {
        dynamicDataSourceService.configTiDBDataSource(tiDBConfig);
      } catch (Exception e) {
        log.error("Failed to connect the configured TiDB data source: {}", e.getMessage());
      }
    }

    SnowflakeDataSourceConfig snowflakeConfig = env.getSnowflakeConfig();
    if (snowflakeConfig.getHost() != null && !snowflakeConfig.getHost().isEmpty()) {
      try {
        dynamicDataSourceService.configSnowflakeDataSource(snowflakeConfig);
      } catch (Exception e) {
        log.error("Failed to connect the configured Snowflake data source: {}", e.getMessage());
      }
    }
  }

}
