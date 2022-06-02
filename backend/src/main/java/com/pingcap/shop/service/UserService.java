package com.pingcap.shop.service;

import com.pingcap.shop.dao.tidb.UserMapper;
import com.pingcap.shop.util.*;
import com.pingcap.shop.vo.ResultVO;
import com.pingcap.shop.vo.UserVO;
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

  private final ConcurrentCSVBatchLoader batchLoader;

  public boolean existsAnyUser() {
    return Optional.ofNullable(userMapper.existsAnyUsers()).orElse(false);
  }

  public Set<String> importSampleUserData(int n) {
    Set<String> usernameSet = new ConcurrentSkipListSet<>();
    Set<String> userIdSet = new ConcurrentSkipListSet<>();

    String sql = "INSERT INTO users (id, username, password) VALUES (?, ?, ?);";
    String[] columns = new String[]{
        "id", "username", "password"
    };
    batchLoader.batchInsert("User", "users", columns, n, (w, nWorkers, i) -> {
      String userId = strings().size(32).types(ALPHA_NUMERIC, HEX).get();
      String username = users().get();
      String password = passwords().weak().get();

      if (userIdSet.contains(userId)) {
        return null;
      } else {
        userIdSet.add(userId);
      }

      if (usernameSet.contains(username)) {
        return null;
      } else {
        usernameSet.add(username);
      }

      List<Object> fields = new ArrayList<>();
      fields.add(userId);
      fields.add(username);
      fields.add(password);

      return fields;
    });

    return userIdSet;
  }

  public ResultVO<UserVO> getUsersWithLabel(Pageable pageable) {
    List<UserVO> users = userMapper.getUsersWithLabel(pageable);
    long rowTotal = 1000; // userMapper.getUsersWithLabelCount();
    return ResultVO.of(users, rowTotal, pageable.getPageNumber(), pageable.getPageSize());
  }

  public List<UserVO> searchUsersForAutoComplete(String keyword) {
    return userMapper.searchUsersForAutoComplete(keyword);
  }

}
