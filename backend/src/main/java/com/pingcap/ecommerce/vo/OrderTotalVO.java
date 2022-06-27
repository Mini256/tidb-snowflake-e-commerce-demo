package com.pingcap.ecommerce.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderTotalVO {

    private ZonedDateTime updateTime;

    private BigDecimal totalAmount = BigDecimal.ZERO;

    private Long totalCount = 0L;

}
