package com.pingcap.ecommerce.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.ZonedDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderStats {

    private ZonedDateTime ts;

    private String type;

    private BigDecimal amount;

    private BigInteger total;

    private BigInteger customers;

}
