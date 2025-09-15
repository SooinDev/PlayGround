package com.playground.mapper;

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

  /**
   * 이메일(로그인 ID)로 회원 정보 조회
   * @param email
   * @return
   */
  MemberVO selectMemberByEmail(String email);
}
