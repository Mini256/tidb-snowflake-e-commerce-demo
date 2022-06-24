package com.pingcap.ecommerce.service;

import com.pingcap.ecommerce.dao.tidb.JobMapper;
import com.pingcap.ecommerce.model.JobInstance;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class JobService {

    private final JobMapper jobMapper;

    public JobInstance getLastJobInstance(String jobName) {
        return jobMapper.getLastJobInstance(jobName);
    }

    public JobInstance getJobInstanceByID(Long jobID) {
        return jobMapper.getLastJobInstanceByID(jobID);
    }

    public List<String> getJobNameList() {
        return jobMapper.getJobNameList();
    }

    public List<JobInstance> getJobInstanceList(String jobName, Pageable pageable) {
        return jobMapper.getJobInstancePage(jobName, pageable);
    }

}
