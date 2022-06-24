package com.pingcap.ecommerce.service;

import com.pingcap.ecommerce.dao.tidb.SchemaMapper;
import com.pingcap.ecommerce.vo.StatsMeta;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class TableStatsService {

    private final SchemaMapper schemaMapper;

    public StatsMeta getTableStatsMeta(String dbName, String tableName) {
        List<StatsMeta> tableStatsMetaList = schemaMapper.getTableStatsMetaList(dbName, tableName);
        if (tableStatsMetaList.isEmpty()) return null;
        return tableStatsMetaList.get(0);
    }

}
