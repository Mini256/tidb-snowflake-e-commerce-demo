package com.pingcap.shop.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Item {

    private Long id;

    private String itemName;

    private String itemType;

    private BigDecimal itemPrice;

    private String itemDesc;

    private Date createTime;

    private Date updateTime;

    public Item(Long id, String itemName, BigDecimal itemPrice) {
        this.id = id;
        this.itemName = itemName;
        this.itemPrice = itemPrice;
    }

}