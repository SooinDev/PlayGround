package com.playground.vo.admin;

import com.playground.vo.MemberStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AdminVO {

  /** 관리자 고유 번호 */
  private Long adminId;

  /** 관리자 이메일 (로그인 ID) */
  private String adminEmail;

  /** 관리자 비밀번호 */
  private String adminPassword;

  /** 관리자 닉네임 */
  private String adminNickname;

  /** 관리자 닉네임 변경 일자 */
  private LocalDateTime adminNicknameChangedAt;

  /** 관리자 상태 */
  private MemberStatus adminStatus;

  /** 관리자 가입 일자 */
  private LocalDateTime adminCreatedAt;

  /** 관리자 수정 일자 */
  private LocalDateTime adminUpdatedAt;

}
