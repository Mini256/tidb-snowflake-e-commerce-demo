package com.pingcap.shop.util;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import me.tongfei.progressbar.ProgressBar;
import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.stereotype.Component;

import java.sql.Connection;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Slf4j
@Component
@AllArgsConstructor
public class ConcurrentPreparedBatchLoader {

  private final SqlSessionFactory sqlSessionFactory;

  public void batchInsert(String name, String hint, int n, ValuesGenerator generator) {
    try (ProgressBar pb = new ProgressBar(String.format("Importing %s Data", name), n)) {
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
                  BatchLoader loader = new PreparedBatchInsertLoader(conn, hint)
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

                  i++;
                  if (i % 1000 == 0) {
                    pb.stepBy(1000);
                  }
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
      pb.stepTo(n);

      log.info("Generating {} {} data successfully.", n, name.toLowerCase());
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }

}
