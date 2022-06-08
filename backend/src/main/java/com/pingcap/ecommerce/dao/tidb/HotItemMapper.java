package com.pingcap.ecommerce.dao.tidb;

import com.pingcap.ecommerce.model.HotItem;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.List;

@Mapper
@Component
public interface HotItemMapper {

    List<HotItem> getHighLabelItems();

    List<HotItem> getLowLabelItems();

    List<HotItem> getRecommendedHotItems(String userId, Pageable pageable);

    long batchInsertHotItems(List<HotItem> hotItems);

    long bulkDeleteHotItems(List<Long> hotItemIds);

}