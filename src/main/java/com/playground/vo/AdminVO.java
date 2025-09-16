package com.playground.vo;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AdminVO {

  private Long adminId;
  private String adminEmail;
  private String adminPassword;
  private String adminNickname;
  private LocalDateTime adminNicknameChangedAt;
  private MemberStatus adminStatus;
  private LocalDateTime adminCreatedAt;
  private LocalDateTime adminUpdatedAt;

}
