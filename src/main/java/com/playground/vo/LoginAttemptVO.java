package com.playground.vo;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class LoginAttemptVO {

  /** 회원 고유 아이디 */
  private Long id;

  /** 회원 IP 주소 */
  private String ipAddress;

  /** 회원 이메일 (로그인 ID) */
  private String email;

  /** 로그인 시도 유형 (MEMBER/ADMIN) */
  private String attemptType;

  /** 로그인 성공 여부 */
  private boolean success;

  /** 로그인 시도 일자 */
  private LocalDateTime attemptedAt;
}
