package com.pingcap.ecommerce.controller;

import com.pingcap.ecommerce.model.HotItem;
import com.pingcap.ecommerce.model.JobInstance;
import com.pingcap.ecommerce.service.DataService;
import com.pingcap.ecommerce.util.job.JobManager;
import com.pingcap.ecommerce.vo.MessageVO;
import com.pingcap.ecommerce.vo.PageResultVO;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.math.BigInteger;
import java.util.List;

import static com.pingcap.ecommerce.vo.MessageVO.SUCCESS;

@RestController
@RequestMapping("/api/data")
@AllArgsConstructor
public class DataController {

    private final DataService dataService;

    private final JobManager jobManager;

    /**
     * Data service manual trigger.
     */

    @PostMapping("/user-labels/calc")
    public MessageVO<?> calcUserLabels() {
        return MessageVO.stopWatchWrapper(dataService::calcUserLabels);
    }

    @PostMapping("/user-labels/pull-back")
    public MessageVO<?> pullBackUserLabels(@RequestParam(required = false) boolean recreate) {
        BigInteger maxProcess = dataService.countUserLabels();
        JobInstance jobInstance = jobManager.findOrCreateJobInstance("write-back-user-labels", maxProcess, recreate);
        if (jobInstance.isRunning()) {
            return MessageVO.of(HttpStatus.CONFLICT.value(), "The last job instance is still running.", jobInstance);
        } else if (jobInstance.isCompleted()) {
            return MessageVO.of(HttpStatus.CONFLICT.value(), "The last job instance is completed.", jobInstance);
        } else {
            jobManager.startJobAsync(jobInstance, dataService::pullBackUserLabelsToTiDB);
            return MessageVO.of(SUCCESS, "Start a new instance successfully.", jobInstance);
        }
    }

    @PostMapping("/hot-items/high-label/calc")
    public MessageVO<?> calcHighLabelItems() {
        return MessageVO.stopWatchWrapper(dataService::calcHighLabelItems);
    }

    @PostMapping("/hot-items/low-label/calc")
    public MessageVO<?> calcLowLabelItems() {
        return MessageVO.stopWatchWrapper(dataService::calcLowLabelItems);
    }

    @PostMapping("/hot-items/pull-back")
    public MessageVO<?> pullBackHotItems() {
        return MessageVO.stopWatchWrapper(dataService::pullBackHotItemsToTiDB);
    }

    /**
     * Data query service.
     */

    @GetMapping("/hot-items/high-label")
    public List<HotItem> getHighLabelItems() {
        return dataService.getHighLabelItems();
    }

    @GetMapping("/hot-items/low-label")
    public List<HotItem> getLowLabelItems() {
        return dataService.getLowLabelItems();
    }

    @GetMapping("/hot-items/recommended")
    public PageResultVO<HotItem> getRecommendedHotItem(@RequestParam(required = false) String userId, Pageable pageable) {
        return dataService.getRecommendedHotItems(userId, pageable);
    }

}
