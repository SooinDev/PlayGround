package com.playground.service;

import com.playground.vo.MemberVO;

import javax.security.auth.login.AccountLockedException;
import javax.servlet.http.HttpServletRequest;

public interface MemberService {

  /**
   * 회원 가입
   * @param memberVO
   * @throws Exception
   */
  void register(MemberVO memberVO) throws Exception;

  /**
   * 로그인
   * @param memberVO
   * @param request
   * @return
   * @throws AccountLockedException
   */
  MemberVO login(MemberVO memberVO, HttpServletRequest request) throws AccountLockedException;
  /**
   * 비밀번호 찾기
   * @param email
   * @param encodedPassword
   */
  void forgotPassword(String email, String encodedPassword);

  /**
   * 임시 비밀번호 발급
   * @param email
   * @return
   */
  boolean issueTemporaryPassword(String email);
}
