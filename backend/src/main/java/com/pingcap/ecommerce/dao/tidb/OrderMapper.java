package com.pingcap.ecommerce.dao.tidb;

import com.pingcap.ecommerce.vo.OrderTotalVO;
import com.pingcap.ecommerce.vo.OrderTypeTotalVO;
import com.pingcap.ecommerce.vo.OrderVO;
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