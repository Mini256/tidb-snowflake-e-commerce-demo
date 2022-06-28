package com.pingcap.ecommerce.dao.tidb;

import com.pingcap.ecommerce.model.User;
import com.pingcap.ecommerce.vo.PageMeta;
import com.pingcap.ecommerce.vo.UserVO;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.math.BigInteger;
import java.util.List;
import java.util.Set;

@Mapper
@Component
public interface UserMapper {

    User selectByUsername(String username);

    Integer existsAnyUsers();

    List<UserVO> getUsers(String username, Pageable pageable);

    List<PageMeta<String>> getUserPages(int pageSize);

    List<String> getUserIdsByPageMeta(PageMeta<String> pageMeta);

    List<String> getUserIds(Pageable pageable);

    List<User> getUserByIds(Set<String> userIds);

    List<UserVO> searchUsersForAutoComplete(String keyword);

    List<UserVO> getUsersWithLabel(Pageable pageable);

    BigInteger getUsersWithLabelCount();
}