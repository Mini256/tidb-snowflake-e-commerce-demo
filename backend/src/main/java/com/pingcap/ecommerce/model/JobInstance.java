package com.pingcap.ecommerce.model;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigInteger;
import java.util.Date;

@Data
@AllArgsConstructor
public class JobInstance {

    private Long id;

    private String jobName;

    private JobStatus status;

    private BigInteger currentProcess = BigInteger.ZERO;

    private BigInteger maxProcess;

    private Double cost;

    private Date startTime;

    private Date updateTime;

    private Date completeTime;

    public JobInstance(String jobName, BigInteger maxProcess) {
        this.jobName = jobName;
        this.maxProcess = maxProcess;
    }

    public boolean isCreated() {
        return JobStatus.CREATED.equals(status);
    }

    public boolean isRunning() {
        return JobStatus.RUNNING.equals(status);
    }

    public boolean isCompleted() {
        return JobStatus.FINISHED.equals(status) || JobStatus.FAIL.equals(status);
    }

}
