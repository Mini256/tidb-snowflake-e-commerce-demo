package com.pingcap.shop.dao.snowflake;

import com.pingcap.shop.model.UserLabel;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import java.util.List;

@Mapper
@Component
public interface SnowflakeUserLabelMapper {

    List<UserLabel> getUserLabels(long limit, long offset);

    void calcUserLabels();

}