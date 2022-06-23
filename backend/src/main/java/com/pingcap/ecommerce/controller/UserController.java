package com.pingcap.ecommerce.controller;

import com.pingcap.ecommerce.service.OrderService;
import com.pingcap.ecommerce.service.UserService;
import com.pingcap.ecommerce.vo.OrderVO;
import com.pingcap.ecommerce.vo.PageResultVO;
import com.pingcap.ecommerce.vo.UserVO;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@AllArgsConstructor
public class UserController {

  private final UserService userService;

  private final OrderService orderService;

  @GetMapping()
  public PageResultVO<UserVO> getUsers(Pageable pageable) {
    return userService.getUsersWithLabel(pageable);
  }

  @GetMapping("/autocomplete")
  public List<UserVO> searchUsersForAutoComplete(@RequestParam(required = false) String keyword) {
    return userService.searchUsersForAutoComplete(keyword);
  }

  @GetMapping("/{userId}/orders")
  public List<OrderVO> getOrdersByUserId(@PathVariable String userId) {
    return orderService.getOrdersByUserId(userId);
  }

}
