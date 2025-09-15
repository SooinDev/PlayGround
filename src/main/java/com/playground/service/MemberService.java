package com.playground.service;

import com.playground.exception.EmailDuplicateException;
import com.playground.exception.NicknameDuplicateException;
import com.playground.vo.MemberVO;

public interface MemberService {

  /**
   * 회원 가입
   * @param memberVO
   * @throws EmailDuplicateException
   * @throws NicknameDuplicateException
   */
  void register(MemberVO memberVO) throws EmailDuplicateException, NicknameDuplicateException;

  /**
   * 로그인
   * @param memberVO
   * @return
   */
  MemberVO login(MemberVO memberVO);

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
