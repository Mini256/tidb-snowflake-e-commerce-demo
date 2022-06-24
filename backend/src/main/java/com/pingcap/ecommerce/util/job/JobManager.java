package com.pingcap.ecommerce.util.job;

import com.pingcap.ecommerce.dao.tidb.JobMapper;
import com.pingcap.ecommerce.model.JobInstance;
import com.pingcap.ecommerce.model.JobStatus;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StopWatch;

import java.math.BigInteger;

@Slf4j
@Component
public class JobManager {

    ThreadPoolTaskExecutor taskExecutor = new ThreadPoolTaskExecutor();

    private final JobMapper jobMapper;

    public JobManager(JobMapper jobMapper) {
        this.jobMapper = jobMapper;
        taskExecutor.setCorePoolSize(2);
        taskExecutor.setMaxPoolSize(10);
        taskExecutor.setQueueCapacity(100);
        taskExecutor.setThreadNamePrefix("async-thread-");
        taskExecutor.initialize();
    }

    public JobInstance findOrCreateJobInstance(String jobName, BigInteger maxProcess) {
        return findOrCreateJobInstance(jobName, maxProcess, false);
    }

    public JobInstance findOrCreateJobInstance(String jobName, BigInteger maxProcess, boolean recreate) {
        JobInstance lastJobInstance = jobMapper.getLastJobInstance(jobName);
        if (lastJobInstance != null && !lastJobInstance.isCompleted()) {
            if (recreate) {
                jobMapper.terminateJobInstance(lastJobInstance);
            } else {
                return lastJobInstance;
            }
        }

        jobMapper.createJobInstance(new JobInstance(jobName, maxProcess));
        Long lastInsertID = jobMapper.getLastInsertID();
        return jobMapper.getLastJobInstanceByID(lastInsertID);
    }

    public JobInstance getJobInstanceByID(Long jobInstanceID) {
        return jobMapper.getLastJobInstanceByID(jobInstanceID);
    }

    @Transactional
    public JobInstance updateJobInstanceProcess(Long instanceID, int processSteps) {
        JobInstance instance = getJobInstanceByID(instanceID);
        instance.setCurrentProcess(instance.getCurrentProcess().add(BigInteger.valueOf(processSteps)));
        jobMapper.updateJobInstance(instance);
        return instance;
    }

    public void startJobAsync(JobInstance instance, Task task) {
        log.info("Starting job  {}-{} in async mode.", instance.getJobName(), instance.getId());
        instance.setStatus(JobStatus.RUNNING);
        jobMapper.updateJobInstance(instance);
        taskExecutor.submit(() -> {
            executeJob(instance, task);
        });
    }

    public void startJob(JobInstance instance, Task task) {
        log.info("Starting job  {}-{} in sync mode.", instance.getJobName(), instance.getId());
        instance.setStatus(JobStatus.RUNNING);
        jobMapper.updateJobInstance(instance);
        executeJob(instance, task);
    }

    private void executeJob(JobInstance instance, Task task) {
        try {
            StopWatch sw = new StopWatch();
            sw.start();
            task.execute(instance);
            sw.stop();

            JobInstance currentInstance = getJobInstanceByID(instance.getId());
            jobMapper.finishJobInstance(currentInstance);

            log.info("Finished job {}-{}, cost {}s.", instance.getJobName(), instance.getId(), sw.getTotalTimeSeconds());
        } catch (RuntimeException e) {
            jobMapper.terminateJobInstance(instance);
        }
    }

}
