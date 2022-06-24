package com.pingcap.ecommerce.util.job;

import com.pingcap.ecommerce.model.JobInstance;

@FunctionalInterface
public interface Task {

    void execute(JobInstance jobInstance);

}
