package com.pingcap.shop.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderSeries {

    private Date ts;

    private String type;

    private BigDecimal amount;

    private Long total;

}
