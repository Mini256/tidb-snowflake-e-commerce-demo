package com.pingcap.ecommerce.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TableInfo {

    private String databaseName;

    private String schemaName;

    private String tableName;

    private String kind;

    private BigDecimal tableRows = BigDecimal.ZERO;

    private BigDecimal dataSize = BigDecimal.ZERO;

    private BigDecimal indexSize = BigDecimal.ZERO;

    private BigDecimal totalSize = BigDecimal.ZERO;

    private Date createdTime;

    public TableInfo(String databaseName, String schemaName, String tableName, String kind) {
        this.databaseName = databaseName;
        this.schemaName = schemaName;
        this.tableName = tableName;
        this.kind = kind;
    }

    public TableInfo(String schemaName, String tableName) {
        this.schemaName = schemaName;
        this.tableName = tableName;
    }

}
