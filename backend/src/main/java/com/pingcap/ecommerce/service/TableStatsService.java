package com.pingcap.ecommerce.service;

import com.pingcap.ecommerce.dao.tidb.TableStatsMapper;
import com.pingcap.ecommerce.dto.TiDBDataSourceConfig;
import com.pingcap.ecommerce.model.TableStats;
import com.pingcap.ecommerce.vo.StatsMeta;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.*;

@Service
@AllArgsConstructor
public class TableStatsService {

    private final Set<String> tableNames = new HashSet<>(Set.of("users", "orders", "items", "express"));

    private final TableStatsMapper tableStatsMapper;

    private final DynamicDataSourceService dataSourceService;

    public StatsMeta getTableStatsMeta(String dbName, String tableName) {
        List<StatsMeta> tableStatsMetaList = tableStatsMapper.getTableStatsMetaList(dbName, tableName);
        if (tableStatsMetaList.isEmpty()) return null;
        return tableStatsMetaList.get(0);
    }
    
    public void recordTableStats() {
        TiDBDataSourceConfig tidbDataSourceConfig = dataSourceService.getTidbDataSourceConfig();
        List<StatsMeta> tableStatsMetaList = tableStatsMapper.getTableStatsMetaList(tidbDataSourceConfig.getDatabase(), null);
        List<TableStats> tableStatsList = new ArrayList<>();
        for (StatsMeta statsMeta : tableStatsMetaList) {
            if (tableNames.contains(statsMeta.getTableName())) {
                tableStatsList.add(new TableStats(statsMeta.getDbName(), statsMeta.getTableName(), statsMeta.getRowCount()));
            }
        }

        if (!tableStatsList.isEmpty()) {
            tableStatsMapper.insertTableStatsList(tableStatsList);
        }
    }

    public List<TableStats> getTableStats(String tableName, ZonedDateTime lastDateTime) {
        TiDBDataSourceConfig tidbDataSourceConfig = dataSourceService.getTidbDataSourceConfig();
        String dbName = tidbDataSourceConfig.getDatabase();
        return tableStatsMapper.getTableStatsHistory(dbName, tableName, lastDateTime);
    }

}
