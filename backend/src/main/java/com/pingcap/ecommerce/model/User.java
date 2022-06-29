package com.pingcap.ecommerce.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {

  private String id;

  private String username;

  private String password;

  private ZonedDateTime createTime;

  private ZonedDateTime updateTime;

}
