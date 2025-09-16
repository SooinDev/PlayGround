package com.playground.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordGenerator {

  public static void main(String[] args) {
    // 1. 여기에 암호화하고 싶은 순수 비밀번호를 입력하세요.
    String rawPassword = "Pg_Admin!@#2025";

    BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    String encodedPassword = passwordEncoder.encode(rawPassword);

    System.out.println("암호화할 비밀번호: " + rawPassword);
    System.out.println("암호화된 비밀번호: " + encodedPassword);
  }
}