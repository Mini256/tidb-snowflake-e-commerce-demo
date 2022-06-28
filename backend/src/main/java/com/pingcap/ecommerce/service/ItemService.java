package com.pingcap.ecommerce.service;

import com.pingcap.ecommerce.dao.tidb.ItemMapper;
import com.pingcap.ecommerce.model.Item;
import com.pingcap.ecommerce.vo.PageResultVO;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.util.*;

@Slf4j
@Service
@AllArgsConstructor
public class ItemService {

    private static final String ITEMS_TABLE_NAME = "items";

    private final ItemMapper itemMapper;

    private final TableStatsService tableStatsService;

    public PageResultVO<Item> getItems(String type, Pageable pageable) {
        List<Item> items = itemMapper.getItems(type, pageable);
        BigInteger rowCount = getRowsCount(type);
        return PageResultVO.of(items, rowCount, pageable.getPageNumber(), pageable.getPageSize());
    }

    public BigInteger getRowsCount(String type) {
        if (type == null || type.isEmpty()) {
            BigInteger rowTotal = tableStatsService.getTableInfoRows(ITEMS_TABLE_NAME);
            if (rowTotal != null) {
                return rowTotal;
            }
        }
        return itemMapper.getItemsCount(type);
    }

}
