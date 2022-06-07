package com.pingcap.ecommerce;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;

import java.util.Properties;

@SpringBootApplication
public class ECommerceDemoApplication {

  public static void main(String[] args) {
    Properties webServerProperties = new Properties();
    webServerProperties.put("cron-jobs.enabled", "true");

    new SpringApplicationBuilder(ECommerceDemoApplication.class)
            .properties(webServerProperties)
            .run(args);
  }

}
