package com.pingcap.ecommerce.dao.snowflake;

import com.pingcap.ecommerce.vo.TableInfo;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface SnowflakeSchemaMapper {

    void useJSONResultFormat();

    List<TableInfo> getTableInfos();

}
