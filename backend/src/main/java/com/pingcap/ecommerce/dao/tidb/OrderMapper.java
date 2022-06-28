package com.pingcap.ecommerce.dao.tidb;

import com.pingcap.ecommerce.vo.OrderTotalVO;
import com.pingcap.ecommerce.vo.OrderTypeTotalVO;
import com.pingcap.ecommerce.vo.OrderVO;
import com.pingcap.ecommerce.vo.PageMeta;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.math.BigInteger;
import java.util.List;

@Mapper
@Component
public interface OrderMapper {

    List<OrderVO> getOrders(String userId, Pageable pageable);

    List<PageMeta<Long>> getOrderIdPages(int pageSize);

    List<Long> getOrderIdsByPageMeta(PageMeta<Long> pageMeta);

    List<Long> getOrderIds(Pageable pageable);

    BigInteger getOrdersCount(String userId);

    List<OrderVO> getOrdersByUserId(String userId);

    OrderTotalVO getOrderTotalAndAmount();

    List<OrderTypeTotalVO> getOrderTotalAndAmountByType();

}