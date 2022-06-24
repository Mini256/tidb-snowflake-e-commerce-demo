package com.pingcap.ecommerce.vo;

import lombok.Data;

import java.util.Date;

@Data
public class StatsMeta {

    private String dbName;

    private String tableName;

    private String partitionName;

    private Date updateTime;

    private Long modifyCount;

    private Long rowCount;

}
