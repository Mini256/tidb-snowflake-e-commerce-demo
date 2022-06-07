package com.pingcap.ecommerce.config;

import com.pingcap.ecommerce.job.CalcTodayOrdersJob;
import com.pingcap.ecommerce.job.CalcUsersAndItemsLabelJob;
import com.pingcap.ecommerce.service.DataService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
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

    @Bean
    @ConditionalOnProperty(value = "cron-jobs.enabled", havingValue = "true")
    public CalcTodayOrdersJob calcTodayOrdersJob() {
        return new CalcTodayOrdersJob(dataService);
    }

    @Bean
    @ConditionalOnProperty(value = "cron-jobs.enabled", havingValue = "true")
    public CalcUsersAndItemsLabelJob calcUsersAndItemsLabelJob() {
        return new CalcUsersAndItemsLabelJob(dataService);
    }

}
