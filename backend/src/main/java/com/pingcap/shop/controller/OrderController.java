package com.pingcap.shop.controller;

import com.pingcap.shop.service.OrderService;
import com.pingcap.shop.vo.OrderVO;
import com.pingcap.shop.vo.ResultVO;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@AllArgsConstructor
public class OrderController {

  private final OrderService orderService;

  @GetMapping()
  public ResultVO<OrderVO> getOrders(@RequestParam(required = false) String username, Pageable pageable) {
    return orderService.getOrders(username, pageable);
  }

}
