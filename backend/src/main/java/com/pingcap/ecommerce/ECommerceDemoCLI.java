package com.pingcap.ecommerce;

import com.beust.jcommander.JCommander;
import com.pingcap.ecommerce.cli.command.CheckEnvCommend;
import com.pingcap.ecommerce.cli.command.ImportDataCommand;
import com.pingcap.ecommerce.cli.command.IncrementalDataCommand;
import com.pingcap.ecommerce.cli.loader.ConcurrentCSVBatchLoader;
import com.pingcap.ecommerce.dao.tidb.ExpressMapper;
import com.pingcap.ecommerce.dao.tidb.ItemMapper;
import com.pingcap.ecommerce.dao.tidb.OrderMapper;
import com.pingcap.ecommerce.dao.tidb.UserMapper;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

@SpringBootApplication
public class ECommerceDemoCLI {

  public static void main(String[] args) {
    ImportDataCommand importDataCommand = new ImportDataCommand();
    IncrementalDataCommand incrementalDataCommand = new IncrementalDataCommand();
    CheckEnvCommend checkEnvCommend = new CheckEnvCommend();

    JCommander jc = JCommander.newBuilder()
            .addCommand(checkEnvCommend)
            .addCommand(importDataCommand)
            .addCommand(incrementalDataCommand)
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
      case "incremental-data" -> {
        ConfigurableApplicationContext ctx = getSpringIoCContext(args);
        incrementalDataCommand.incrementalData(ctx);
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
