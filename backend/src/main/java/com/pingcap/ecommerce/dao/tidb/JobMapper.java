package com.pingcap.ecommerce.dao.tidb;

import com.pingcap.ecommerce.model.JobInstance;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.List;

@Mapper
@Component
public interface JobMapper {

    List<String> getJobNameList();

    List<JobInstance> getJobInstancePage(String jobName, Pageable pageable);

    JobInstance getLastJobInstance(String jobName);

    JobInstance getLastJobInstanceByID(Long jobInstanceID);

    Long createJobInstance(JobInstance jobInstance);

    Long getLastInsertID();

    void updateJobInstance(JobInstance jobInstance);

    void finishJobInstance(JobInstance jobInstance);

    void terminateJobInstance(JobInstance jobInstance);

}
