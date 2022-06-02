package com.pingcap.shop.controller;

import com.pingcap.shop.model.Item;
import com.pingcap.shop.service.ItemService;
import com.pingcap.shop.service.OrderService;
import com.pingcap.shop.vo.OrderVO;
import com.pingcap.shop.vo.ResultVO;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/items")
@AllArgsConstructor
public class ItemController {

  private final ItemService itemService;

  @GetMapping()
  public ResultVO<Item> getItems(@RequestParam(required = false) String type, Pageable pageable) {
    return itemService.getItems(type, pageable);
  }

}
