package com.playground.vo;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MemberVO {

  /** 회원 고유 번호 */
  private Long memberId;

  /** 회원 이메일 (로그인 ID) */
  private String email;

  /** 회원 비밀번호 */
  private String password;

  /** 회원 닉네임 */
  private String nickname;

  /** 회원 닉네임 변경 일자 */
  private LocalDateTime nicknameChangedAt;

  /** 회원 이름 */
  private String name;

  /** 회원 연락처 */
  private String phone;

  /** 회원 주소 */
  private String address;

  /** 회원 가입 일자 */
  private LocalDateTime memberCreatedAt;

  /** 회원 정보 수정 일자 */
  private LocalDateTime memberUpdatedAt;
}
