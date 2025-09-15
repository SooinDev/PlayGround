package com.playground.mapper;

import com.playground.exception.EmailDuplicateException;
import com.playground.exception.NicknameDuplicateException;
import com.playground.vo.MemberVO;

public interface MemberMapper {

  /**
   * 회원 정보 DB에 삽입
   * @param member
   */
  void insertMember(MemberVO member);

  /**
   * 이메일 중복 확인
   * @param email
   * @return
   */
  boolean isEmailDuplicated(String email);

  /**
   * 닉네임 중복 확인
   * @param nickname
   * @return
   */
  boolean isNicknameDuplicated(String nickname);
}
