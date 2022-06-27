package com.pingcap.ecommerce.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TableStats {

    private Long id;

    private String dbName;

    private String tableName;

    private Long rowTotal;

    private ZonedDateTime ts;

    public TableStats(String dbName, String tableName, Long rowTotal) {
        this.dbName = dbName;
        this.tableName = tableName;
        this.rowTotal = rowTotal;
    }
}
