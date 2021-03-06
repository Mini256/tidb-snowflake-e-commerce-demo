package com.pingcap.ecommerce.config;

import com.pingcap.ecommerce.model.JobInstance;
import com.pingcap.ecommerce.model.JobStatus;
import com.pingcap.ecommerce.service.DataService;
import com.pingcap.ecommerce.service.DynamicDataSourceService;
import com.pingcap.ecommerce.service.OrderService;
import com.pingcap.ecommerce.service.TableStatsService;
import com.pingcap.ecommerce.util.job.JobManager;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.util.StopWatch;

import java.math.BigInteger;

@Slf4j
@EnableScheduling
@Configuration
@AllArgsConstructor
public class ScheduleConfiguration {

    private final DataService dataService;

    private final OrderService orderService;

    private final DynamicDataSourceService dataSourceService;

    private final TableStatsService tableStatsService;

    private JobManager jobManager;

    /**
     * Calculated today orders every 10 minutes.
     */
    @Scheduled(cron = "0 */2 * * * *")
    public void calcTodayOrdersJob() {
        if (!dataSourceService.isTiDBReady()) {
            return;
        }

        log.info("Calculating today orders stats.");
        StopWatch sw = new StopWatch("calc-today-orders");

        sw.start("Calculate today orders stats.");
        orderService.calcTodayOrderStats();
        sw.stop();

        sw.start("Calculate today orders stats group by type.");
        orderService.calcTodayOrderStatsGroupByType();
        sw.stop();

        log.info("Finished calculating today stats, cost: {} s.", sw.getTotalTimeSeconds());
    }

    /**
     * Calc table stats history every minute.
     */
    @Scheduled(cron = "0 * * * * *")
    public void calcTableStatsHistory() {
        if (!dataSourceService.isTiDBReady()) {
            return;
        }
        tableStatsService.recordTableStats();
    }

    /**
     * Calculated every day at 2 am (at UTC+0 timezone)
     *
     * Steps:
     *
     * 1. ETL items and orders data from TiDB to Snowflake;
     *
     * 2. Calc user labels according the order data on Snowflake;
     * 3. Pull down the user labels data from Snowflake to TiDB;
     *
     * 4. Calc the label of the top 10 items according the items and orders data during 1 week on Snowflake;
     * 5. Pull down the item labels data from Snowflake to TiDB;
     *
     * 6. Provide data for item recommend service.
     *
     */
    @Scheduled(cron = "${ecommerce.calcLabelsCron}")
    public void calcUsersAndItemsLabelJob() {
        if (!dataSourceService.isTiDBReady() || !dataSourceService.isSnowflakeReady()) {
            return;
        }

        log.info("Calculating user labels and item labels.");
        StopWatch stopWatch = new StopWatch("calc-users-and-items-label");

        stopWatch.start("Calculate high and low label items.");
        dataService.calcLowLabelItems();
        dataService.calcHighLabelItems();
        dataService.pullBackHotItemsToTiDB();
        stopWatch.stop();

        stopWatch.start("Calculate user labels.");
        dataService.calcUserLabels();

        // Write back user labels from Snowflake to TiDB.
        JobInstance jobInstance = jobManager.findOrCreateJobInstance("write-back-user-labels", BigInteger.ZERO);
        if (JobStatus.RUNNING.equals(jobInstance.getStatus())) {
            log.warn("Skipping the write back job, because the last job instance is still running.");
        } else {
            jobInstance.setMaxProcess(dataService.countUserLabels());
            jobManager.startJob(jobInstance, dataService::pullBackUserLabelsToTiDB);
        }

        stopWatch.stop();

        log.info(stopWatch.prettyPrint());
    }

}
