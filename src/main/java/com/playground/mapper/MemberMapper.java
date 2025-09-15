package com.playground.mapper;

import com.playground.vo.LoginAttemptVO;
import com.playground.vo.MemberVO;
import org.apache.ibatis.annotations.Param;

public interface MemberMapper {

  /**
   * 회원 정보 DB에 추가
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

  /**
   * 비밀번호 찾기
   * @param email
   * @param encodedPassword
   */
  void updatePassword(@Param("email") String email, @Param("password") String encodedPassword);

  /**
   * 최근 로그인 실패 횟수
   * @param email
   * @return
   */
  int countRecentLoginFailures(String email);

  /**
   * 로그인 시도 기록 모두 삭제
   * @param email
   */
  void deleteLoginAttempts(String email);

  /**
   * 로그인 시도 기록 추가
   * @param failAttempt
   */
  void insertLoginAttempt(LoginAttemptVO failAttempt);

  /**
   * 닉네임 변경 (7일)
   * @param email
   * @param nickname
   */
  void updateNickname(@Param("email") String email, @Param("nickname") String nickname);

  /**
   * 회원 정보 수정 (이름, 연락처, 주소)
   * @param memberVO
   */
  void updateInfo(MemberVO memberVO);

  /**
   * memberId로 회원 정보 조회
   * @param id
   * @return
   */
  MemberVO selectMemberById(@Param("memberId") Long id);

  /**
   * 이메일 변경
   * @param currentEmail
   * @param newEmail
   */
  void updateEmail(@Param("currentEmail") String currentEmail, @Param("newEmail") String newEmail);
}
