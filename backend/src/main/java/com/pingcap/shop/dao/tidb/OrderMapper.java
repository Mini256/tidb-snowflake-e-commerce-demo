package com.pingcap.shop.dao.tidb;

import com.pingcap.shop.vo.OrderTotalVO;
import com.pingcap.shop.vo.OrderTypeTotalVO;
import com.pingcap.shop.vo.OrderVO;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.List;

@Mapper
@Component
public interface OrderMapper {

    Boolean existsAnyOrders();

    List<OrderVO> getOrders(String username, Pageable pageable);

    long getOrdersCount(String username);

    List<OrderVO> getOrdersByUserId(String userId);

    OrderTotalVO getOrderTotalAndAmount();

    List<OrderTypeTotalVO> getOrderTotalAndAmountByType();

}