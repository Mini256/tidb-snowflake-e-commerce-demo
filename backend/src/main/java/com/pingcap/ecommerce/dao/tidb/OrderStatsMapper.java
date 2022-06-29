package com.pingcap.ecommerce.dao.tidb;

import com.pingcap.ecommerce.model.OrderStats;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Component;

import java.time.ZonedDateTime;
import java.util.List;


@Mapper
@Component
public interface OrderStatsMapper {

    void insertOrderStats(OrderStats orderStats);

    void insertOrderStatsList(List<OrderStats> orderStatsList);

    OrderStats getTodayOrderStats();

    List<OrderStats> getTodayOrderStatsGroupByType();

    List<OrderStats> getTodayOrderStatsTrends(ZonedDateTime lastDateTime);

}