package com.pingcap.shop.dao.tidb;

import com.pingcap.shop.model.OrderSeries;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Component;

import java.util.List;


@Mapper
@Component
public interface OrderSeriesMapper {

    void insertOrderSeries(OrderSeries orderSeries);

    void insertOrderSeriesList(List<OrderSeries> orderSeriesList);

    OrderSeries selectLatestAllTypeAmountAndTotal();

    List<OrderSeries> selectLatestGroupTypeAmountAndTotal();

}