package com.pingcap.ecommerce.model;

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

    private Long timestamp;

    private String type;

    private BigDecimal amount;

    private Long total;

}
