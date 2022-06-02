package com.pingcap.ecommerce.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Order {

    private Long id;

    private String userId;

    private BigDecimal amount;

    private Long itemId;

    private String itemName;

    private Integer itemCount;

    private Date createTime;

    private Date updateTime;

    public Order(Long id, String userId, Date createTime) {
        this.id = id;
        this.userId = userId;
        this.createTime = createTime;
    }

}