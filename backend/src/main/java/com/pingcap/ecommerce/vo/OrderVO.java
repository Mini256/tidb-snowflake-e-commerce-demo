package com.pingcap.ecommerce.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderVO {

  private Long orderId;

  private Date orderDate;

  private String userId;

  private String username;

  private Long itemId;

  private String itemName;

  private BigDecimal amount;

  private String status;

  private String currentAddress;

}
