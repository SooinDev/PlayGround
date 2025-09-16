package com.playground.service.impl;

import com.playground.mapper.AdminMapper;
import com.playground.service.AdminService;
import com.playground.vo.AdminVO;
import com.playground.vo.LoginAttemptVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.security.auth.login.AccountLockedException;
import javax.servlet.http.HttpServletRequest;

@Service
public class AdminServiceImpl implements AdminService {

  @Autowired
  AdminMapper adminMapper;

  @Autowired
  PasswordEncoder passwordEncoder;

  @Override
  public AdminVO login(AdminVO adminVO, HttpServletRequest request) throws AccountLockedException {

    String email = adminVO.getAdminEmail();
    String ipAddress = request.getRemoteAddr(); // IP 주소 미리 가져오기

    // 계정 잠김 여부 확인
    int failCount = adminMapper.countRecentLoginFailures(email);
    if (failCount >= 5) {
      throw new AccountLockedException("5회 이상 로그인에 실패하여 계정이 10분간 잠겼습니다.");
    }

    // 이메일로 회원 정보 조회
    AdminVO dbAdmin = adminMapper.selectAdminByEmail(email);

    // 로그인 성공/실패 처리
    if (dbAdmin != null && passwordEncoder.matches(adminVO.getAdminPassword(), dbAdmin.getAdminPassword())) {
      // 로그인 성공 시
      // 실패 기록 모두 삭제
      adminMapper.deleteLoginAttempts(email);

      return dbAdmin; // 로그인 성공한 회원 정보 반환
    } else {
      // 로그인 실패 시
      // 실패 기록 DB에 추가
      LoginAttemptVO failAttempt = LoginAttemptVO.builder()
              .email(email)
              .ipAddress(ipAddress)
              .success(false)
              .attemptType("MEMBER")
              .build();
      adminMapper.insertLoginAttempt(failAttempt);

      return null; // 로그인 실패 시 null 반환
    }
  }
}
