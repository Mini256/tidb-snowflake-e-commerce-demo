package com.pingcap.ecommerce.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserVO {

  private String userId;

  private String username;

  private String userLabel;

  private BigDecimal avgAmount;

  private Date createTime;

  private Date updateTime;

}
