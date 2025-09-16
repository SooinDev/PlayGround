package com.playground.mapper;

import com.playground.vo.AdminVO;
import com.playground.vo.LoginAttemptVO;

public interface AdminMapper {

  int countRecentLoginFailures(String email);

  AdminVO selectAdminByEmail(String email);

  void deleteLoginAttempts(String email);

  void insertLoginAttempt(LoginAttemptVO failAttempt);
}
