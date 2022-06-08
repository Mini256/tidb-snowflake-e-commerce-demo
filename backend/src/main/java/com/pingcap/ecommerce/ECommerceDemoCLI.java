package com.pingcap.ecommerce;

import com.beust.jcommander.JCommander;
import com.pingcap.ecommerce.cli.command.CheckEnvCommend;
import com.pingcap.ecommerce.cli.command.ImportDataCommand;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

@SpringBootApplication
public class ECommerceDemoCLI {
  public static void main(String[] args) {
    ImportDataCommand importDataCommand = new ImportDataCommand();
    CheckEnvCommend checkEnvCommend = new CheckEnvCommend();

    JCommander jc = JCommander.newBuilder()
      .addCommand(checkEnvCommend)
      .addCommand(importDataCommand)
      .build();
    jc.parse(args);
    String parsedCmdStr = jc.getParsedCommand();

    if (parsedCmdStr == null) {
      System.out.println("Please provide a sub-command.\n");
      jc.usage();
      System.exit(1);
    }

    switch (parsedCmdStr) {
      case "import-data" -> {
        ConfigurableApplicationContext ctx = getSpringIoCContext(args);
        importDataCommand.importData(ctx);
      }
      case "check-env" -> checkEnvCommend.checkEnv();
      default -> System.err.println("Invalid command: " + parsedCmdStr);
    }

  }

  private static ConfigurableApplicationContext getSpringIoCContext(String[] args) {
    SpringApplication app = new SpringApplication(ECommerceDemoCLI.class);
    app.setWebApplicationType(WebApplicationType.NONE);
    return app.run(args);
  }

}
