package com.pingcap.shop.dao.snowflake;

import com.pingcap.shop.model.HotItem;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Component;

import java.util.List;

@Mapper
@Component
public interface SnowflakeHotItemMapper {

    List<HotItem> getHotItems(long limit, long offset);

    List<HotItem> getHighLabelItems();

    List<HotItem> getLowLabelItems();

    void calcHighLabelItems();

    void calcLowLabelItems();

    void deleteHighLabelItems();

    void deleteLowLabelItems();

}