package com.pingcap.shop.dao.tidb;

import com.pingcap.shop.model.User;
import com.pingcap.shop.vo.UserVO;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.List;

@Mapper
@Component
public interface UserMapper {

    User selectByUsername(String username);

    Boolean existsAnyUsers();

    List<UserVO> getUsers(String username, Pageable pageable);

    List<UserVO> searchUsersForAutoComplete(String keyword);

    List<UserVO> getUsersWithLabel(Pageable pageable);

    long getUsersWithLabelCount();
}