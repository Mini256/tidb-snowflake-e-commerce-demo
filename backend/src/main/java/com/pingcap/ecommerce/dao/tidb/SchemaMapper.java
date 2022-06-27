package com.pingcap.ecommerce.dao.tidb;

import com.pingcap.ecommerce.vo.TableInfo;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Component;

import java.util.List;

@Mapper
@Component
public interface SchemaMapper {

    List<String> getTableNames();

    List<TableInfo> getTableInfos(String tableName);

}
