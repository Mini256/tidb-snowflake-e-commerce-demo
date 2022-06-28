package com.pingcap.ecommerce.service;

import com.pingcap.ecommerce.dao.tidb.TableStatsMapper;
import com.pingcap.ecommerce.dto.TiDBDataSourceConfig;
import com.pingcap.ecommerce.model.TableStats;
import com.pingcap.ecommerce.vo.TableInfo;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.time.ZonedDateTime;
import java.util.*;

@Service
@AllArgsConstructor
public class TableStatsService {

    private final Set<String> tableNames = new HashSet<>(Set.of("users", "orders", "items", "express"));

    private final TableStatsMapper tableStatsMapper;

    private final DynamicDataSourceService dataSourceService;

    public TableInfo getTableInfo(String dbName, String tableName) {
        List<TableInfo> tableStatsMetaList = tableStatsMapper.getTableInfos(dbName, tableName);
        if (tableStatsMetaList.isEmpty()) return null;
        return tableStatsMetaList.get(0);
    }

    public BigInteger getTableInfoRows(String tableName) {
        TiDBDataSourceConfig dataSourceConfig = dataSourceService.getTidbDataSourceConfig();
        TableInfo tableInfo = getTableInfo(dataSourceConfig.getDatabase(), tableName);
        if (tableInfo != null) {
            return tableInfo.getTableRows();
        }
        return null;
    }

    public List<TableInfo> getTableInfoList(String dbName, String tableName) {
        return tableStatsMapper.getTableInfos(dbName, tableName);
    }
    
    public void recordTableStats() {
        TiDBDataSourceConfig tidbDataSourceConfig = dataSourceService.getTidbDataSourceConfig();
        List<TableInfo> tableInfoList = tableStatsMapper.getTableInfos(tidbDataSourceConfig.getDatabase(), null);

        List<TableStats> tableStatsList = new ArrayList<>();
        for (TableInfo tableInfo : tableInfoList) {
            if (tableNames.contains(tableInfo.getTableName())) {
                tableStatsList.add(new TableStats(tableInfo.getDatabaseName(), tableInfo.getTableName(), tableInfo.getTableRows()));
            }
        }

        if (!tableStatsList.isEmpty()) {
            tableStatsMapper.insertTableStatsList(tableStatsList);
        }
    }

    public List<TableStats> getTableStatsHistory(String tableName, ZonedDateTime lastDateTime) {
        TiDBDataSourceConfig tidbDataSourceConfig = dataSourceService.getTidbDataSourceConfig();
        String dbName = tidbDataSourceConfig.getDatabase();
        return tableStatsMapper.getTableStatsHistory(dbName, tableName, lastDateTime);
    }

}
