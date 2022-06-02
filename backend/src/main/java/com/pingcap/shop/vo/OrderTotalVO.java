package com.pingcap.shop.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderTotalVO {

    private Date updateTime;

    private BigDecimal totalAmount = BigDecimal.ZERO;

    private Long totalCount = 0L;

}
