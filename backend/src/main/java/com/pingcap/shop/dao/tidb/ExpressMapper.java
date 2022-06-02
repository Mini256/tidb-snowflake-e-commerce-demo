package com.pingcap.shop.dao.tidb;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Component;

@Mapper
@Component
public interface ExpressMapper {

    Boolean existsAnyExpresses();

}