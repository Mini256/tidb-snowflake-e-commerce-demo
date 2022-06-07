package com.pingcap.ecommerce.job;

import com.pingcap.ecommerce.service.DataService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.util.StopWatch;

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
@Slf4j
public class CalcUsersAndItemsLabelJob {

    private final DataService dataService;

    public CalcUsersAndItemsLabelJob(DataService dataService) {
        this.dataService = dataService;
    }

    @Scheduled(cron = "0 0 2 * * *")
    public void calcUsersAndItemsLabel() {
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
