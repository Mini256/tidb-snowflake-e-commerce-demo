package com.pingcap.ecommerce.service;

import com.pingcap.ecommerce.dao.tidb.ItemMapper;
import com.pingcap.ecommerce.model.Item;
import com.pingcap.ecommerce.vo.PageResultVO;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;

import static net.andreinc.mockneat.unit.objects.From.from;

@Slf4j
@Service
@AllArgsConstructor
public class ItemService {

    private final ItemMapper itemMapper;

    public PageResultVO<Item> getItems(String type, Pageable pageable) {
        List<Item> items = itemMapper.getItems(type, pageable);
        long rowCount = 1000; // itemMapper.getItemCount(type);
        return PageResultVO.of(items, rowCount, pageable.getPageNumber(), pageable.getPageSize());
    }

}
