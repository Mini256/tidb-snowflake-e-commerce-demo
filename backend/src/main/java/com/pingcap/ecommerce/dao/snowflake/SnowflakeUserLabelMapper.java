package com.pingcap.ecommerce.dao.snowflake;

import com.pingcap.ecommerce.model.UserLabel;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Component;

import java.math.BigInteger;
import java.util.List;

@Mapper
@Component
public interface SnowflakeUserLabelMapper {

    BigInteger countUserLabels();

    List<UserLabel> getUserLabels(long limit, long offset);

    void calcUserLabels();

}