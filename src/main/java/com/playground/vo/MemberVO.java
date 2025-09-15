package com.playground.vo;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MemberVO {
  private Long memberId;
  private String email;
  private String password;
  private String nickname;
  private LocalDateTime nicknameChangedAt;
  private String name;
  private String phone;
  private String address;
  private LocalDateTime memberCreatedAt;
  private LocalDateTime memberUpdatedAt;
}
