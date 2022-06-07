package com.pingcap.ecommerce.dao.tidb;

import com.pingcap.ecommerce.model.Item;
import com.pingcap.ecommerce.vo.PageMeta;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.List;

@Mapper
@Component
public interface ItemMapper {

    List<Item> getItems(String type, Pageable pageable);

    List<Item> getItemsBaseInfos(Pageable pageable);

    List<PageMeta<Long>> getItemsBaseInfoPage(int pageSize);

    List<Item> getItemsBaseInfosByPageMeta(PageMeta<Long> pageMeta);

    long getItemsCount(String type);

}