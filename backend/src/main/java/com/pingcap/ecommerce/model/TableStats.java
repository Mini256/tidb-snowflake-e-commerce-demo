package com.pingcap.ecommerce.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigInteger;
import java.time.ZonedDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TableStats {

    private Long id;

    private String dbName;

    private String tableName;

    private BigInteger rowTotal;

    private ZonedDateTime ts;

    public TableStats(String dbName, String tableName, BigInteger rowTotal) {
        this.dbName = dbName;
        this.tableName = tableName;
        this.rowTotal = rowTotal;
    }
}
