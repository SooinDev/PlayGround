package com.playground.mapper.admin;

import com.playground.vo.admin.AdminVO;
import com.playground.vo.LoginAttemptVO;

public interface AdminMapper {

  /**
   * 총 로그인 시도 횟수 반환
   * @param email
   * @return
   */
  int countRecentLoginFailures(String email);

  /**
   * 이메일로 관리자 조회
   * @param email
   * @return
   */
  AdminVO selectAdminByEmail(String email);

  /**
   * 로그인 시도 횟수 초기화
   * @param email
   */
  void deleteLoginAttempts(String email);

  /**
   * 로그인 시도 횟수 증가
   * @param failAttempt
   */
  void insertLoginAttempt(LoginAttemptVO failAttempt);
}
