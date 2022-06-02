package com.pingcap.shop.controller;

import com.pingcap.shop.service.OrderService;
import com.pingcap.shop.service.UserService;
import com.pingcap.shop.vo.OrderVO;
import com.pingcap.shop.vo.ResultVO;
import com.pingcap.shop.vo.UserVO;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@AllArgsConstructor
public class UserController {

  private final UserService userService;

  private final OrderService orderService;

  @GetMapping()
  public ResultVO<UserVO> getUsers(Pageable pageable) {
    return userService.getUsersWithLabel(pageable);
  }

  @GetMapping("/autocomplete")
  public List<UserVO> searchUsersForAutoComplete(String keyword) {
    return userService.searchUsersForAutoComplete(keyword);
  }

  @GetMapping("/{userId}/orders")
  public List<OrderVO> getOrdersByUserId(@PathVariable String userId) {
    return orderService.getOrdersByUserId(userId);
  }

}
