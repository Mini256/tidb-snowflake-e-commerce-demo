package com.pingcap.ecommerce.controller;

import com.pingcap.ecommerce.model.JobInstance;
import com.pingcap.ecommerce.service.JobService;
import com.pingcap.ecommerce.vo.MessageVO;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@AllArgsConstructor
public class JobController {

    private final JobService jobService;

    @GetMapping
    public MessageVO<?> getJobNames() {
        List<String> jobNameList = jobService.getJobNameList();
        return MessageVO.success(jobNameList);
    }

    @GetMapping("/name/{jobName}/instances/last")
    public MessageVO<?> getLastJobInstance(@PathVariable(name = "jobName") String jobName) {
        JobInstance jobInstance = jobService.getLastJobInstance(jobName);
        return MessageVO.success(jobInstance);
    }

    @GetMapping("/name/{jobName}/instances/{jobID}")
    public MessageVO<?> getLastJobInstance(@PathVariable(name = "jobName") String jobName, @PathVariable(name = "jobID") Long jobID) {
        JobInstance jobInstance = jobService.getJobInstanceByID(jobID);
        return MessageVO.success(jobInstance);
    }

    @GetMapping("/{jobName}/instances")
    public MessageVO<?> getJobInstanceList(
        @PathVariable(name = "jobName") @RequestParam(required = false) String jobName, Pageable pageable
    ) {
        List<JobInstance> jobInstanceList = jobService.getJobInstanceList(jobName, pageable);
        return MessageVO.success(jobInstanceList);
    }

}
