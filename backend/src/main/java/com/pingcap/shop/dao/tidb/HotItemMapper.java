package com.pingcap.shop.dao.tidb;

import com.pingcap.shop.model.HotItem;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Component;

import java.util.List;

@Mapper
@Component
public interface HotItemMapper {

    List<HotItem> getHighLabelItems();

    List<HotItem> getLowLabelItems();

    List<HotItem> getRecommendedHotItems(String userId);

    long batchInsertHotItems(List<HotItem> hotItems);

    long bulkDeleteHotItems(List<Long> hotItemIds);

}