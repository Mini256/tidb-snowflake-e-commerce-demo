package com.pingcap.ecommerce.controller;

import com.pingcap.ecommerce.model.HotItem;
import com.pingcap.ecommerce.service.DataService;
import com.pingcap.ecommerce.vo.PageResultVO;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/data")
@AllArgsConstructor
public class DataController {

    private final DataService dataService;

    /**
     * Data service manual trigger.
     */

    @PostMapping("/user-labels/calc")
    public void calcUserLabels() {
        dataService.calcUserLabels();
    }

    @PostMapping("/user-labels/pull-back")
    public void pullBackUserLabels() {
        dataService.pullBackUserLabelsToTiDB();
    }

    @PostMapping("/hot-items/high-label/calc")
    public void calcHighLabelItems() {
        dataService.calcHighLabelItems();
    }

    @PostMapping("/hot-items/low-label/calc")
    public void calcLowLabelItems() {
        dataService.calcLowLabelItems();
    }

    @PostMapping("/hot-items/pull-back")
    public void pullBackHotItems() {
        dataService.pullBackHotItemsToTiDB();
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
    public PageResultVO<HotItem> getRecommended(@RequestParam(required = false) String userId, Pageable pageable) {
        return dataService.getRecommendedHotItems(userId, pageable);
    }

}
