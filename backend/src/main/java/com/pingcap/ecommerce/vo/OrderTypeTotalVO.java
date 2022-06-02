package com.pingcap.ecommerce.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderTypeTotalVO {

    private BigDecimal totalAmount;

    private Long totalCount;

    private String itemType;

}
