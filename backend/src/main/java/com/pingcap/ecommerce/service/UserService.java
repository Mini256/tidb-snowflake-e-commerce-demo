package com.pingcap.ecommerce.service;

import com.pingcap.ecommerce.dao.tidb.SchemaMapper;
import com.pingcap.ecommerce.dao.tidb.UserMapper;
import com.pingcap.ecommerce.dto.TiDBDataSourceConfig;
import com.pingcap.ecommerce.vo.PageResultVO;
import com.pingcap.ecommerce.vo.StatsMeta;
import com.pingcap.ecommerce.vo.UserVO;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
@AllArgsConstructor
public class UserService {

  private static final String USERS_TABLE_NAME = "users";

  private final UserMapper userMapper;

  private final TableStatsService tableStatsService;

  private final DynamicDataSourceService dataSourceService;

  public PageResultVO<UserVO> getUsersWithLabel(Pageable pageable) {
    List<UserVO> users = userMapper.getUsersWithLabel(pageable);
    long rowTotal = getRowsCount();
    return PageResultVO.of(users, rowTotal, pageable.getPageNumber(), pageable.getPageSize());
  }

  public Long getRowsCount() {
    TiDBDataSourceConfig dataSourceConfig = dataSourceService.getTidbDataSourceConfig();
    StatsMeta statsMeta = tableStatsService.getTableStatsMeta(dataSourceConfig.getDatabase(), USERS_TABLE_NAME);
    if (statsMeta != null) {
      return statsMeta.getRowCount();
    }
    return userMapper.getUsersWithLabelCount();
  }

  public List<UserVO> searchUsersForAutoComplete(String keyword) {
    return userMapper.searchUsersForAutoComplete(keyword);
  }

}
