package com.pingcap.ecommerce.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigInteger;
import java.time.ZonedDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TableInfo {

    private String databaseName;

    private String schemaName;

    private String tableName;

    private String kind;

    private BigInteger tableRows = BigInteger.ZERO;

    private BigInteger dataSize = BigInteger.ZERO;

    private BigInteger indexSize = BigInteger.ZERO;

    private BigInteger totalSize = BigInteger.ZERO;

    private ZonedDateTime createdTime;

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
