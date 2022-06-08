package com.pingcap.ecommerce.job;

import com.pingcap.ecommerce.service.DataService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.util.StopWatch;

@Slf4j
public class CalcTodayOrdersJob {

    private final DataService dataService;

    public CalcTodayOrdersJob(DataService dataService) {
        this.dataService = dataService;
    }

    /**
     * Calculated today orders every 30 seconds.
     */
    @Scheduled(cron = "*/30 * * * * *")
    public void calcTodayOrders() {
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
}
