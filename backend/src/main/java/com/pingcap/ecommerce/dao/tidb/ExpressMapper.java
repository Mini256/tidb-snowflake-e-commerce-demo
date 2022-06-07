package com.pingcap.ecommerce.dao.tidb;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.List;

@Mapper
@Component
public interface ExpressMapper {

    Boolean existsAnyExpresses();

    List<Long> getExpressIds(Pageable pageable);

}