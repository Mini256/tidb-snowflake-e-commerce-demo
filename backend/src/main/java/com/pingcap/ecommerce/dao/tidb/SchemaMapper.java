package com.pingcap.ecommerce.dao.tidb;

import com.pingcap.ecommerce.vo.TableInfo;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface SchemaMapper {

    List<String> getTableNames();

    List<TableInfo> getTableInfos(String tableName);

}
