package com.pingcap.ecommerce.util.loader;

import com.pingcap.ecommerce.model.JobInstance;
import com.pingcap.ecommerce.util.job.JobManager;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.stereotype.Component;

import java.sql.Connection;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Slf4j
@Component
@AllArgsConstructor
public class ConcurrentPreparedBatchLoader implements ConcurrentBatchLoader {

  private final SqlSessionFactory sqlSessionFactory;

  private final JobManager jobManager;

  public void batchInsert(String name, String tableName, String[] headers, int n, JobInstance jobInstance, ValuesGenerator generator) {
    String insertSQL = getInsertSQL(tableName, headers);

    try {
      int nCores = Runtime.getRuntime().availableProcessors();
      int nWorkers = Math.min(Math.max(4, nCores), 16);
      long nJobsPerWorker = n / nWorkers;

      CountDownLatch countDownLatch = new CountDownLatch(nWorkers);
      ExecutorService threadPool = Executors.newFixedThreadPool(nWorkers);

      for (int workerId = 1; workerId <= nWorkers; workerId++) {
        int w = workerId;
        threadPool.execute(
            () -> {
              try (
                  Connection conn = sqlSessionFactory.openSession().getConnection();
                  BatchLoader loader = new PreparedBatchLoader(conn, insertSQL)
              ) {
                // If the primary key use the auto random feature, we need to enable
                // this flag to allow insert explicit value to TiDB.
                conn.createStatement().execute("set @@allow_auto_random_explicit_insert = true;");

                int i = 0;
                while (i < nJobsPerWorker) {
                  List<Object> values = generator.generate(w, nWorkers, i);

                  if (values == null) {
                    continue;
                  }

                  loader.insertValues(values);
                  if (i % 2000 == 0) {
                    jobManager.updateJobInstanceProcess(jobInstance.getId(), 2000);
                  }
                  i++;
                }

                loader.flush();
                countDownLatch.countDown();
              } catch (Exception e) {
                throw new RuntimeException(e);
              }
            });
      }

      countDownLatch.await();
      threadPool.shutdownNow();

      log.info("Generating {} {} data successfully.", n, name.toLowerCase());
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }

  public String getInsertSQL(String tableName, String[] headers) {
    String columns = String.join(", ", headers);
    String values = String.join(", ", Arrays.stream(headers).map(header -> "?").toArray(String[]::new));
    return String.format("INSERT IGNORE INTO %s (%s) VALUES (%s);", tableName, columns, values);
  }

}
