package com.pingcap.ecommerce.service;

import com.pingcap.ecommerce.dao.tidb.UserMapper;
import com.pingcap.ecommerce.vo.PageResultVO;
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

  private final UserMapper userMapper;

  public PageResultVO<UserVO> getUsersWithLabel(Pageable pageable) {
    List<UserVO> users = userMapper.getUsersWithLabel(pageable);
    long rowTotal = 1000; // userMapper.getUsersWithLabelCount();
    return PageResultVO.of(users, rowTotal, pageable.getPageNumber(), pageable.getPageSize());
  }

  public List<UserVO> searchUsersForAutoComplete(String keyword) {
    return userMapper.searchUsersForAutoComplete(keyword);
  }

}
