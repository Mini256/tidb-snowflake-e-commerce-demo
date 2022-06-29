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
public class OrderVO {

  private Long orderId;

  private ZonedDateTime orderDate;

  private String userId;

  private String username;

  private Long itemId;

  private String itemName;

  private BigDecimal amount;

  private String status;

  private String currentAddress;

}
