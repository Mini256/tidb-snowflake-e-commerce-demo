package com.pingcap.ecommerce.dao.tidb;

import com.pingcap.ecommerce.vo.PageMeta;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.List;

@Mapper
@Component
public interface ExpressMapper {

    Boolean existsAnyExpresses();

    List<Long> getExpressIds(Pageable pageable);

    List<PageMeta<Long>> getExpressIdPages(int pageSize);

    List<Long> getExpressIdsByPageMeta(PageMeta<Long> pageMeta);

}