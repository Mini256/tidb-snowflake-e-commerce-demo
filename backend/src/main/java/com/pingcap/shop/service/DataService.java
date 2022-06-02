package com.pingcap.shop.service;

import com.pingcap.shop.dao.snowflake.SnowflakeHotItemMapper;
import com.pingcap.shop.dao.snowflake.SnowflakeUserLabelMapper;
import com.pingcap.shop.dao.tidb.HotItemMapper;
import com.pingcap.shop.dao.tidb.OrderMapper;
import com.pingcap.shop.dao.tidb.OrderSeriesMapper;
import com.pingcap.shop.dao.tidb.UserLabelMapper;
import com.pingcap.shop.model.HotItem;
import com.pingcap.shop.model.OrderSeries;
import com.pingcap.shop.model.UserLabel;
import com.pingcap.shop.vo.OrderTotalVO;
import com.pingcap.shop.vo.OrderTypeTotalVO;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Slf4j
@Service
@AllArgsConstructor
public class DataService {

    private final SnowflakeUserLabelMapper snowflakeUserLabelMapper;

    private final SnowflakeHotItemMapper snowflakeHotItemMapper;

    private final UserLabelMapper userLabelMapper;

    private final HotItemMapper hotItemMapper;

    private final OrderMapper orderMapper;

    private final OrderSeriesMapper orderSeriesMapper;

    public void calcTodayOrderTotalAndAmount() {
        Date now = new Date();
        OrderTotalVO orderTotalAndAmount = orderMapper.getOrderTotalAndAmount();
        OrderSeries orderSeries = new OrderSeries();
        orderSeries.setType("ALL");
        orderSeries.setTs(now);
        orderSeries.setAmount(orderTotalAndAmount.getTotalAmount());
        orderSeries.setTotal(orderTotalAndAmount.getTotalCount());
        orderSeriesMapper.insertOrderSeries(orderSeries);
    }

    public void calcTodayOrderTotalAndAmountGroupByType() {
        Date now = new Date();
        List<OrderTypeTotalVO> orderTotalAndAmountByType = orderMapper.getOrderTotalAndAmountByType();
        List<OrderSeries> seriesList = new ArrayList<>();

        for (OrderTypeTotalVO vo : orderTotalAndAmountByType) {
            OrderSeries series = new OrderSeries();
            series.setTs(now);
            series.setType(vo.getItemType());
            series.setTotal(vo.getTotalCount());
            series.setAmount(vo.getTotalAmount());
            seriesList.add(series);
        }

        if (seriesList.size() > 0) {
            orderSeriesMapper.insertOrderSeriesList(seriesList);
        }
    }

    /**
     * User labels.
    */

    public void calcUserLabels() {
        snowflakeUserLabelMapper.calcUserLabels();
    }

    public void pullBackUserLabelsToTiDB() {
        List<UserLabel> userLabels;
        long pageNum = 1;
        long pageSize = 1000;

        log.info("Pulling back user labels from Snowflake to TiDB.");

        do {
            long offset = (pageNum - 1) * pageSize;
            userLabels = snowflakeUserLabelMapper.getUserLabels(pageSize, offset);
            bulkInsertOverwriteUserLabels(userLabels);
            pageNum++;
        } while (userLabels.size() > 0);

        log.info("Successfully pull back user labels from Snowflake to TiDB!");
    }

    @Transactional
    public void bulkInsertOverwriteUserLabels(List<UserLabel> userLabels) {
        if (userLabels.isEmpty()) return;
        List<String> userIds = userLabels.stream().map(UserLabel::getUserId).toList();
        userLabelMapper.bulkDeleteUserLabels(userIds);
        userLabelMapper.batchInsertUserLabels(userLabels);
    }

    /**
     * Items.
     */

    @Transactional
    public void calcHighLabelItems() {
        snowflakeHotItemMapper.deleteHighLabelItems();
        snowflakeHotItemMapper.calcHighLabelItems();
    }

    @Transactional
    public void calcLowLabelItems() {
        snowflakeHotItemMapper.deleteLowLabelItems();
        snowflakeHotItemMapper.calcLowLabelItems();
    }

    public void pullBackHotItemsToTiDB() {
        List<HotItem> hotItems;
        long pageNum = 1;
        long pageSize = 1000;

        log.info("Pulling back hot items from Snowflake to TiDB.");

        do {
            long offset = (pageNum - 1) * pageSize;
            hotItems = snowflakeHotItemMapper.getHotItems(pageSize, offset);
            bulkInsertOverwriteHotItems(hotItems);
            pageNum++;
        } while (hotItems.size() > 0);

        log.info("Successfully pull back hot items from Snowflake to TiDB!");
    }

    @Transactional
    public void bulkInsertOverwriteHotItems(List<HotItem> hotItems) {
        if (hotItems.isEmpty()) return;
        List<Long> hotItemIds = hotItems.stream().map(HotItem::getItemId).toList();
        hotItemMapper.bulkDeleteHotItems(hotItemIds);
        hotItemMapper.batchInsertHotItems(hotItems);
    }

    /**
     * Recommend the matched items according the label of items and current user.
     */

    public List<HotItem> getRecommendedHotItems(String userId) {
        return hotItemMapper.getRecommendedHotItems(userId);
    }

    public List<HotItem> getHighLabelItems() {
        return hotItemMapper.getHighLabelItems();
    }

    public List<HotItem> getLowLabelItems() {
        return hotItemMapper.getLowLabelItems();
    }

}
