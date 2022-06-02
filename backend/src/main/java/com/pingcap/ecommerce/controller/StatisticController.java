package com.pingcap.ecommerce.controller;

import com.pingcap.ecommerce.model.OrderSeries;
import com.pingcap.ecommerce.service.OrderService;
import com.pingcap.ecommerce.vo.OrderTotalVO;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/statistic")
@AllArgsConstructor
public class StatisticController {

    private final OrderService orderService;

    @GetMapping("/orders/total-and-amount")
    public OrderTotalVO getTodayOrderTotalAndAmount() {
        return orderService.getLatestOrderTotalAndAmount();
    }

    @GetMapping("/orders/total-and-amount/group-by-type")
    public List<OrderSeries> getTodayOrderGroupTypeTotalAndAmount() {
        return orderService.getLatestGroupTypeAmountAndTotal();
    }
}
