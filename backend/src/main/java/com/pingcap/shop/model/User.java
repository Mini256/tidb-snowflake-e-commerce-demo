package com.pingcap.shop.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {

  private String id;

  private String username;

  private String password;

  private Date createTime;

  private Date updateTime;

}
