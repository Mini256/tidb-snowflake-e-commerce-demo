package com.pingcap.ecommerce.dao.tidb;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Component;

@Mapper
@Component
public interface ExpressMapper {

    Boolean existsAnyExpresses();

}