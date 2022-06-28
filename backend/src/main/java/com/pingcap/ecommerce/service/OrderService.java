package com.pingcap.ecommerce.service;

import com.pingcap.ecommerce.dao.tidb.OrderMapper;
import com.pingcap.ecommerce.dao.tidb.OrderSeriesMapper;
import com.pingcap.ecommerce.model.OrderSeries;
import com.pingcap.ecommerce.vo.OrderTotalVO;
import com.pingcap.ecommerce.vo.OrderVO;
import com.pingcap.ecommerce.vo.PageResultVO;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.time.ZonedDateTime;
import java.util.*;

@Slf4j
@Service
@AllArgsConstructor
public class OrderService {

    private static final String ORDERS_TABLE_NAME = "orders";

    private final OrderMapper orderMapper;

    private final OrderSeriesMapper orderSeriesMapper;

    private final TableStatsService tableStatsService;

    public PageResultVO<OrderVO> getOrders(String userId, Pageable pageable) {
        List<OrderVO> orders = orderMapper.getOrders(userId, pageable);
        BigInteger rowCount = getRowCount(userId);
        return PageResultVO.of(orders, rowCount, pageable.getPageNumber(), pageable.getPageSize());
    }

    public BigInteger getRowCount(String userId) {
        if (userId == null || userId.isEmpty()) {
            BigInteger rowTotal = tableStatsService.getTableInfoRows(ORDERS_TABLE_NAME);
            if (rowTotal != null) {
                return rowTotal;
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

    public List<OrderSeries> getLatestOrderTotalAndAmountHistory(ZonedDateTime lastDateTime) {
       return orderSeriesMapper.selectLatestAllTypeAmountAndTotalHistory(lastDateTime);
    }

    public List<OrderSeries> getLatestGroupTypeAmountAndTotal() {
        return orderSeriesMapper.selectLatestGroupTypeAmountAndTotal();
    }
}
