package com.pingcap.ecommerce.service;

import com.pingcap.ecommerce.cli.loader.ConcurrentCSVBatchLoader;
import com.pingcap.ecommerce.dao.tidb.UserMapper;
import com.pingcap.ecommerce.vo.ResultVO;
import com.pingcap.ecommerce.vo.UserVO;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.*;

import static net.andreinc.mockneat.types.enums.StringType.*;
import static net.andreinc.mockneat.unit.text.Strings.strings;
import static net.andreinc.mockneat.unit.user.Passwords.passwords;
import static net.andreinc.mockneat.unit.user.Users.users;

@Slf4j
@Service
@AllArgsConstructor
public class UserService {

  private final UserMapper userMapper;

  public ResultVO<UserVO> getUsersWithLabel(Pageable pageable) {
    List<UserVO> users = userMapper.getUsersWithLabel(pageable);
    long rowTotal = 1000; // userMapper.getUsersWithLabelCount();
    return ResultVO.of(users, rowTotal, pageable.getPageNumber(), pageable.getPageSize());
  }

  public List<UserVO> searchUsersForAutoComplete(String keyword) {
    return userMapper.searchUsersForAutoComplete(keyword);
  }

}
