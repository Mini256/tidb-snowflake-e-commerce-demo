package com.pingcap.ecommerce.controller;

import com.pingcap.ecommerce.model.OrderStats;
import com.pingcap.ecommerce.service.OrderService;
import com.pingcap.ecommerce.vo.MessageVO;
import com.pingcap.ecommerce.vo.OrderVO;
import com.pingcap.ecommerce.vo.PageResultVO;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.ZonedDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@AllArgsConstructor
public class OrderController {

  private final OrderService orderService;

  @GetMapping()
  public PageResultVO<OrderVO> getOrders(
    @RequestParam(required = false) String userId, Pageable pageable
  ) {
    return orderService.getOrders(userId, pageable);
  }

  @PostMapping("/stats/today")
  public MessageVO<?> calcTodayOrderStats() {
    return MessageVO.stopWatchWrapper(() -> {
      orderService.calcTodayOrderStats();
      orderService.calcTodayOrderStatsGroupByType();
    });
  }

  @GetMapping("/stats/today")
  public OrderStats getTodayOrderStats() {
    return orderService.getTodayOrderStats();
  }

  @GetMapping("/stats/today/group-by-type")
  public List<OrderStats> getTodayOrderStatsGroupByType() {
    return orderService.getTodayOrderStatsGroupByType();
  }

  @GetMapping("/stats/today/trends")
  public List<OrderStats> getTodayOrderStatsTrends(
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) ZonedDateTime lastDateTime
  ) {
    return orderService.getTodayOrderStatsTrends(lastDateTime);
  }

}
