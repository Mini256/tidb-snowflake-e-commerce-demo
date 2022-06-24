package com.pingcap.ecommerce.service;

import com.pingcap.ecommerce.dao.tidb.OrderMapper;
import com.pingcap.ecommerce.dao.tidb.OrderSeriesMapper;
import com.pingcap.ecommerce.dto.TiDBDataSourceConfig;
import com.pingcap.ecommerce.model.OrderSeries;
import com.pingcap.ecommerce.vo.OrderTotalVO;
import com.pingcap.ecommerce.vo.OrderVO;
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
public class OrderService {

    private static final String ORDERS_TABLE_NAME = "orders";

    private final OrderMapper orderMapper;

    private final OrderSeriesMapper orderSeriesMapper;

    private final TableStatsService tableStatsService;

    private final DynamicDataSourceService dataSourceService;

    public PageResultVO<OrderVO> getOrders(String userId, Pageable pageable) {
        List<OrderVO> orders = orderMapper.getOrders(userId, pageable);
        long rowCount = getRowsCount(userId);
        return PageResultVO.of(orders, rowCount, pageable.getPageNumber(), pageable.getPageSize());
    }

    public Long getRowsCount(String userId) {
        if (userId == null || userId.isEmpty()) {
            TiDBDataSourceConfig dataSourceConfig = dataSourceService.getTidbDataSourceConfig();
            StatsMeta statsMeta = tableStatsService.getTableStatsMeta(dataSourceConfig.getDatabase(), ORDERS_TABLE_NAME);
            if (statsMeta != null) {
                return statsMeta.getRowCount();
            }
        }
        return orderMapper.getOrdersCount(userId);
    }

    public List<OrderVO> getOrdersByUserId(String userId) {
        return orderMapper.getOrdersByUserId(userId);
    }

    public OrderTotalVO getLatestOrderTotalAndAmount() {
        OrderTotalVO orderTotalVO = new OrderTotalVO();
        OrderSeries orderSeries = orderSeriesMapper.selectLatestAllTypeAmountAndTotal();
        if (orderSeries != null) {
            orderTotalVO.setUpdateTime(orderSeries.getTs());
            orderTotalVO.setTotalAmount(orderSeries.getAmount());
            orderTotalVO.setTotalCount(orderSeries.getTotal());
        }
        return orderTotalVO;
    }

    public List<OrderSeries> getLatestOrderTotalAndAmountHistory(Long startTimestamp) {
       return orderSeriesMapper.selectLatestAllTypeAmountAndTotalHistory(startTimestamp);
    }

    public List<OrderSeries> getLatestGroupTypeAmountAndTotal() {
        return orderSeriesMapper.selectLatestGroupTypeAmountAndTotal();
    }
}
