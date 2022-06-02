package com.pingcap.shop.dao.tidb;

import com.pingcap.shop.model.UserLabel;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Component;

import java.util.List;

@Mapper
@Component
public interface UserLabelMapper {

    int batchInsertUserLabels(List<UserLabel> userLabels);

    int bulkDeleteUserLabels(List<String> userIds);

}