package com.pingcap.ecommerce.controller;

import com.pingcap.ecommerce.service.OrderService;
import com.pingcap.ecommerce.vo.OrderVO;
import com.pingcap.ecommerce.vo.ResultVO;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@AllArgsConstructor
public class OrderController {

  private final OrderService orderService;
  @GetMapping()
  public ResultVO<OrderVO> getOrders(@RequestParam(required = false) String userId, Pageable pageable) {
    return orderService.getOrders(userId, pageable);
  }

}
