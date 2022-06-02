package com.pingcap.shop.service;

import com.pingcap.shop.dao.tidb.OrderMapper;
import com.pingcap.shop.dao.tidb.OrderSeriesMapper;
import com.pingcap.shop.model.Item;
import com.pingcap.shop.model.Order;
import com.pingcap.shop.model.OrderSeries;
import com.pingcap.shop.util.ConcurrentCSVBatchLoader;
import com.pingcap.shop.vo.OrderTotalVO;
import com.pingcap.shop.vo.OrderTypeTotalVO;
import com.pingcap.shop.vo.OrderVO;
import com.pingcap.shop.vo.ResultVO;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.ConcurrentSkipListSet;

import static net.andreinc.mockneat.unit.objects.From.from;
import static net.andreinc.mockneat.unit.types.Ints.ints;
import static net.andreinc.mockneat.unit.time.LocalDates.localDates;
import static net.andreinc.mockneat.unit.types.Longs.longs;

@Slf4j
@Service
@AllArgsConstructor
public class OrderService {

    private final OrderMapper orderMapper;

    private final OrderSeriesMapper orderSeriesMapper;

    private final ConcurrentCSVBatchLoader batchLoader;

    public List<Order> importSampleOrderData(int n, Set<String> userIdSet, List<Item> itemList) {
        Set<Long> orderIdSet = new ConcurrentSkipListSet<>();
        List<Order> orderList = Collections.synchronizedList(new ArrayList<>());
        ArrayList<String> userIdList = new ArrayList<>(userIdSet);
        LocalDate tenYearsAge = LocalDate.now().minusYears(10);
        LocalDate now = LocalDate.now();

        String sql = "INSERT INTO orders (id, user_id, amount, item_id, item_name, item_count, create_time) VALUES (?, ?, ?, ?, ?, ?, ?);";
        String[] headers = new String[]{
            "id", "user_id", "amount", "item_id", "item_name", "item_count", "create_time"
        };
        batchLoader.batchInsert("Order", "orders", headers, n, (w, nWorkers, i) -> {
            Long orderId = longs().lowerBound(1000).get();
            String userId = from(userIdList).get();
            Item item = from(itemList).get();
            Long itemId = item.getId();
            String itemName = item.getItemName();
            Integer itemCount = ints().range(1, 50).get();
            BigDecimal amount = item.getItemPrice().multiply(BigDecimal.valueOf(itemCount));
            Date createTime = localDates().between(tenYearsAge, now).mapToDate().get();

            if (orderIdSet.contains(orderId)) {
                return null;
            } else {
                orderIdSet.add(orderId);
                orderList.add(new Order(orderId, userId, createTime));
            }

            List<Object> fields = new ArrayList<>();
            fields.add(orderId);
            fields.add(userId);
            fields.add(amount);
            fields.add(itemId);
            fields.add(itemName);
            fields.add(itemCount);
            fields.add(createTime);

            return fields;
        });

        return orderList;
    }

    public ResultVO<OrderVO> getOrders(String username, Pageable pageable) {
        List<OrderVO> orders = orderMapper.getOrders(username, pageable);
        long rowCount = 1000; // orderMapper.getOrdersCount(username);
        return new ResultVO<>(orders, rowCount, pageable.getPageNumber(), pageable.getPageSize());
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

    public List<OrderSeries> getLatestGroupTypeAmountAndTotal() {
        return orderSeriesMapper.selectLatestGroupTypeAmountAndTotal();
    }
}
