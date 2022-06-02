package com.pingcap.shop.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Express {

    private Long id;

    private Long orderId;

    private String userId;

    private String postId;

    private String address;

    private String currentAddress;

    private String status;

    private Date createTime;

    private Date updateTime;

}