CREATE DATABASE IF NOT EXISTS playground;
USE playground;

CREATE TABLE IF NOT EXISTS member (
                                      member_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                      email VARCHAR(100) NOT NULL UNIQUE,
                                      password VARCHAR(255) NOT NULL,
                                      nickname VARCHAR(50) NOT NULL UNIQUE,
                                      nickname_changed_at TIMESTAMP NULL DEFAULT NULL,
                                      name VARCHAR(50) NULL,
                                      phone VARCHAR(20) NULL,
                                      address VARCHAR(200) NULL,
                                      status ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') DEFAULT 'ACTIVE',
                                      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                      INDEX idx_email (email),
                                      INDEX idx_nickname (nickname),
                                      INDEX idx_phone (phone)
);

CREATE TABLE IF NOT EXISTS admin (
                                     admin_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                     email VARCHAR(100) NOT NULL UNIQUE,
                                     password VARCHAR(255) NOT NULL,
                                     nickname VARCHAR(50) NOT NULL UNIQUE,
                                     nickname_changed_at TIMESTAMP NULL DEFAULT NULL,
                                     status ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') DEFAULT 'ACTIVE',
                                     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                     INDEX idx_email (email),
                                     INDEX idx_nickname (nickname)
);

CREATE TABLE IF NOT EXISTS login_attempt (
                                             id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                             ip_address VARCHAR(45) NOT NULL,
                                             email VARCHAR(100) NOT NULL,
                                             attempt_type ENUM('MEMBER', 'ADMIN') NOT NULL,
                                             success BOOLEAN DEFAULT FALSE,
                                             attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                             INDEX idx_ip_email (ip_address, email),
                                             INDEX idx_attempted_at (attempted_at)
);

CREATE TABLE IF NOT EXISTS post (
                                    post_id     BIGINT AUTO_INCREMENT PRIMARY KEY,
                                    member_id   BIGINT NOT NULL,
                                    title       VARCHAR(255) NOT NULL,
                                    content     TEXT NOT NULL,
                                    view_count  INT DEFAULT 0,
                                    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                    INDEX idx_member_id (member_id),
                                    FOREIGN KEY (member_id) REFERENCES member(member_id) ON DELETE CASCADE -- 회원이 탈퇴하면 게시물도 삭제
);

CREATE TABLE IF NOT EXISTS post_view_log (
                                             log_id      BIGINT AUTO_INCREMENT PRIMARY KEY,
                                             post_id     BIGINT NOT NULL,
                                             member_id   BIGINT NULL, -- 비회원은 null
                                             ip_address  VARCHAR(50) NOT NULL,
                                             viewed_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                             INDEX idx_post_member (post_id, member_id),
                                             INDEX idx_post_ip (post_id, ip_address),
                                             FOREIGN KEY (post_id) REFERENCES post(post_id) ON DELETE CASCADE -- 게시물이 삭제되면 로그도 삭제
);

INSERT INTO admin (email, password, nickname, status)
VALUES (
           'email@example.com',
           'ENCODEDPASSWORD',
           '관리자',
           'ACTIVE'
       );