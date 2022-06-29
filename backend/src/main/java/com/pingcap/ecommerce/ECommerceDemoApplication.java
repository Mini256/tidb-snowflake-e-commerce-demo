package com.pingcap.ecommerce;

import com.pingcap.ecommerce.config.Env;
import com.pingcap.ecommerce.dto.SnowflakeDataSourceConfig;
import com.pingcap.ecommerce.dto.TiDBDataSourceConfig;
import com.pingcap.ecommerce.model.JobInstance;
import com.pingcap.ecommerce.service.DynamicDataSourceService;
import com.pingcap.ecommerce.service.JobService;
import com.pingcap.ecommerce.util.job.JobManager;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;

import javax.annotation.PreDestroy;

import static com.pingcap.ecommerce.service.DataMockService.IMPORT_DATA_JOB_NAMES;
import static com.pingcap.ecommerce.service.DataMockService.IMPORT_INCREMENTAL_DATA_JOB_NAME;

@Slf4j
@SpringBootApplication
public class ECommerceDemoApplication implements CommandLineRunner {

  private final Env env;

  private final DynamicDataSourceService dataSourceService;

  private final JobService jobService;

  private final JobManager jobManager;

  public ECommerceDemoApplication(
      Env env, DynamicDataSourceService dynamicDataSourceService,
      JobService jobService, JobManager jobManager
  ) {
    this.env = env;
    this.dataSourceService = dynamicDataSourceService;
    this.jobService = jobService;
    this.jobManager = jobManager;
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
        dataSourceService.configTiDBDataSource(tiDBConfig);
      } catch (Exception e) {
        log.error("Failed to connect the configured TiDB data source: {}", e.getMessage());
        e.printStackTrace();
      }
    }

    SnowflakeDataSourceConfig snowflakeConfig = env.getSnowflakeConfig();
    if (snowflakeConfig.getHost() != null && !snowflakeConfig.getHost().isEmpty()) {
      try {
        dataSourceService.configSnowflakeDataSource(snowflakeConfig);
      } catch (Exception e) {
        log.error("Failed to connect the configured Snowflake data source: {}", e.getMessage());
        e.printStackTrace();
      }
    }
  }

  @PreDestroy
  public void destroy() {
    if (!dataSourceService.isTiDBConfigured() || !dataSourceService.isTiDBSchemaCreated()) {
      return;
    }

    log.info("Close the running data import job instances.");
    for (String jobName : IMPORT_DATA_JOB_NAMES) {
      JobInstance jobInstance = jobService.getLastJobInstance(jobName);
      if (jobInstance.isCompleted()) {
        continue;
      }

      if (jobInstance.getJobName().equals(IMPORT_INCREMENTAL_DATA_JOB_NAME)) {
        jobManager.finishJobInstance(jobInstance);
      } else {
        jobManager.terminateJobInstance(jobInstance);
      }
    }
  }

}
