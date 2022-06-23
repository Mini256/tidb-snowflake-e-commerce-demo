package com.pingcap.ecommerce.config;

import com.pingcap.ecommerce.service.DataService;
import com.pingcap.ecommerce.service.DynamicDataSourceService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.util.StopWatch;

@Slf4j
@EnableScheduling
@Configuration
@AllArgsConstructor
public class ScheduleConfiguration {

    private final DataService dataService;

    private final DynamicDataSourceService dynamicDataSourceService;

    /**
     * Calculated today orders every 30 seconds.
     */
    @Scheduled(cron = "*/30 * * * * *")
    public void calcTodayOrdersJob() {
        if (!dynamicDataSourceService.isTiDBConfigured()) {
            return;
        }

        log.info("Calculating today orders.");
        StopWatch stopWatch = new StopWatch("calc-today-orders");

        stopWatch.start("Calculate today orders and amount.");
        dataService.calcTodayOrderTotalAndAmount();
        stopWatch.stop();

        stopWatch.start("Calculate today orders and amount group by type.");
        dataService.calcTodayOrderTotalAndAmountGroupByType();
        stopWatch.stop();

        log.info("Finished calculating today orders and amount, cost: {} s.", stopWatch.getTotalTimeSeconds());
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
    @Scheduled(cron = "0 0 2 * * *")
    public void calcUsersAndItemsLabelJob() {
        if (!dynamicDataSourceService.isTiDBConfigured() || !dynamicDataSourceService.isSnowflakeConfigured()) {
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
        dataService.pullBackUserLabelsToTiDB();
        stopWatch.stop();

        log.info(stopWatch.prettyPrint());
    }

}
