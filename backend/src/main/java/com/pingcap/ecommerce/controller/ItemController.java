package com.pingcap.ecommerce.controller;

import com.pingcap.ecommerce.model.Item;
import com.pingcap.ecommerce.service.ItemService;
import com.pingcap.ecommerce.vo.PageResultVO;
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
  public PageResultVO<Item> getItems(@RequestParam(required = false) String type, Pageable pageable) {
    return itemService.getItems(type, pageable);
  }

}
