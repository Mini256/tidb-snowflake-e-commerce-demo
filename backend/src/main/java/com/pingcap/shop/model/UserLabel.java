package com.pingcap.shop.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserLabel {

    private String userId;

    private String userLabel;

    private BigDecimal avgAmount;

}