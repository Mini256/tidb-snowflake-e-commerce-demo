package com.pingcap.shop.dao.tidb;

import com.pingcap.shop.model.Item;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.List;

@Mapper
@Component
public interface ItemMapper {

    List<Item> getItems(String type, Pageable pageable);

    long getItemsCount(String type);

}