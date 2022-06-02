package com.pingcap.ecommerce.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HotItem {

    private Long itemId;

    private String itemName;

    private BigDecimal itemPrice;

    private String itemType;

    private String itemDesc;

    private String itemLabel;

}