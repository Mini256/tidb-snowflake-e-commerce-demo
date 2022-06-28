package com.pingcap.ecommerce.service;

import com.pingcap.ecommerce.dao.tidb.UserMapper;
import com.pingcap.ecommerce.dto.TiDBDataSourceConfig;
import com.pingcap.ecommerce.vo.PageResultVO;
import com.pingcap.ecommerce.vo.TableInfo;
import com.pingcap.ecommerce.vo.UserVO;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
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
    BigInteger rowTotal = getRowsCount();
    return PageResultVO.of(users, rowTotal, pageable.getPageNumber(), pageable.getPageSize());
  }

  public BigInteger getRowsCount() {
    TiDBDataSourceConfig cfg = dataSourceService.getTidbDataSourceConfig();
    TableInfo tableInfo = tableStatsService.getTableInfo(cfg.getDatabase(), USERS_TABLE_NAME);
    if (tableInfo != null) {
      return tableInfo.getTableRows();
    }
    return userMapper.getUsersWithLabelCount();
  }

  public List<UserVO> searchUsersForAutoComplete(String keyword) {
    return userMapper.searchUsersForAutoComplete(keyword);
  }

}
