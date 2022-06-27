package com.pingcap.ecommerce.dao.tidb;

import com.pingcap.ecommerce.model.TableStats;
import com.pingcap.ecommerce.vo.StatsMeta;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Component;

import java.time.ZonedDateTime;
import java.util.List;

@Mapper
@Component
public interface TableStatsMapper {

    List<StatsMeta> getTableStatsMetaList(String dbName, String tableName);

    int insertTableStatsList(List<TableStats> tableStatsList);

    List<TableStats> getTableStatsHistory(String dbName, String tableName, ZonedDateTime lastDateTime);

}
