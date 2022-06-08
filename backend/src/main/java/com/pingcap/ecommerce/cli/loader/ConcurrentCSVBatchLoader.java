package com.pingcap.ecommerce.cli.loader;

import lombok.AllArgsConstructor;
import me.tongfei.progressbar.ProgressBar;
import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.stereotype.Component;

import java.sql.Connection;
import java.sql.Statement;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Deprecated
@Component
@AllArgsConstructor
public class ConcurrentCSVBatchLoader implements ConcurrentBatchLoader {

  private final SqlSessionFactory sqlSessionFactory;

  public void batchInsert(String name, String tableName, String[] headers, int n, ValuesGenerator generator) {
    try (ProgressBar pb = new ProgressBar(String.format("Importing %s Data", name), n)) {
      int nCores = Runtime.getRuntime().availableProcessors();
      int nWorkers = Math.min(Math.max(4, nCores), 12);

      ExecutorService threadPool = Executors.newFixedThreadPool(nWorkers);

      int chunks = n / 5_0000;
      long nJobsPerChunk = n / chunks;
      CountDownLatch countDownLatch = new CountDownLatch(chunks);

      for (int chunkId = 1; chunkId <= chunks; chunkId++) {
        int c = chunkId;
        threadPool.execute(
            () -> {
              String filepath = String.format("%s-chunk-%d.csv", tableName, c);
              try (BatchLoader loader = new CSVBatchLoader(filepath, headers)) {
                int i = 0;
                while (i < nJobsPerChunk) {
                  List<Object> values = generator.generate(c, chunks, i);

                  if (values == null) {
                    continue;
                  }

                  loader.insertValues(values);

                  i++;
                  if (i % 1000 == 0) {
                    pb.stepBy(1000);
                  }
                }

                loader.flush();

                // Load data from csv file to TiDB.
                try (Connection conn = sqlSessionFactory.openSession().getConnection()) {
                  // If the primary key use the auto random feature, we need to enable
                  // this flag to allow insert explicit value to TiDB.
                  Statement stmt = conn.createStatement();
                  stmt.execute("set @@allow_auto_random_explicit_insert = true;");
                  stmt.execute("set @@tidb_dml_batch_size = 20000;");
                  String columns = String.join(", ", headers);
                  stmt.execute(String.format(
                      "LOAD DATA LOCAL INFILE '%s' INTO TABLE %s FIELDS TERMINATED BY ',' ENCLOSED BY '\\\"' LINES TERMINATED BY '\\r\\n' IGNORE 1 LINES (%s);",
                      filepath, tableName, columns
                  ));
                }

                countDownLatch.countDown();
              } catch (Exception e) {
                throw new RuntimeException(e);
              }
            });
      }

      countDownLatch.await();
      threadPool.shutdownNow();

      // Merge chunk files.
//      String finalFilepath = String.format("%s.csv", tableName);
//      File finalFile = new File(finalFilepath);
//      try(var fileOutputStream = FileUtils.openOutputStream(finalFile)) {
//        for (int workerId = 1; workerId <= nWorkers; workerId++) {
//          String filepath = String.format("%s-chunk-%d.csv", tableName, workerId);
//          try (var fileInputStream = FileUtils.openInputStream(new File(filepath))) {
//            IOUtils.copy(fileInputStream, fileOutputStream);
//          }
//        }
//      }

      pb.stepTo(n);
//      log.info("Generating {} {} data successfully.", n, name.toLowerCase());
//
//
//      log.info("Loading data file {}.", finalFilepath);
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }
}
