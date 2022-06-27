package com.pingcap.ecommerce.service;

import com.pingcap.ecommerce.dao.tidb.ItemMapper;
import com.pingcap.ecommerce.dto.TiDBDataSourceConfig;
import com.pingcap.ecommerce.model.Item;
import com.pingcap.ecommerce.vo.PageResultVO;
import com.pingcap.ecommerce.vo.StatsMeta;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
@AllArgsConstructor
public class ItemService {

    private static final String ITEMS_TABLE_NAME = "items";

    private final ItemMapper itemMapper;

    private final TableStatsService tableStatsService;

    private final DynamicDataSourceService dataSourceService;

    public PageResultVO<Item> getItems(String type, Pageable pageable) {
        List<Item> items = itemMapper.getItems(type, pageable);
        long rowCount = getRowsCount(type);
        return PageResultVO.of(items, rowCount, pageable.getPageNumber(), pageable.getPageSize());
    }

    public Long getRowsCount(String type) {
        if (type == null || type.isEmpty()) {
            TiDBDataSourceConfig dataSourceConfig = dataSourceService.getTidbDataSourceConfig();
            StatsMeta statsMeta = tableStatsService.getTableStatsMeta(dataSourceConfig.getDatabase(), ITEMS_TABLE_NAME);
            if (statsMeta != null) {
                return statsMeta.getRowCount();
            }
        }
        return itemMapper.getItemsCount(type);
    }

}
