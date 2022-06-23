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

import java.util.*;

import static net.andreinc.mockneat.unit.objects.From.from;

@Slf4j
@Service
@AllArgsConstructor
public class OrderService {

    private final OrderMapper orderMapper;

    private final OrderSeriesMapper orderSeriesMapper;

    public PageResultVO<OrderVO> getOrders(String userId, Pageable pageable) {
        List<OrderVO> orders = orderMapper.getOrders(userId, pageable);
        long rowCount = 10000; // orderMapper.getOrdersCount(username);
        return PageResultVO.of(orders, rowCount, pageable.getPageNumber(), pageable.getPageSize());
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
