-- 'playground' 데이터베이스가 없으면 생성하고, 해당 데이터베이스를 사용합니다.
CREATE DATABASE IF NOT EXISTS playground;
USE playground;

-- 1. 회원 테이블 (member)
-- 테이블이 존재하지 않을 경우에만 생성합니다.
CREATE TABLE IF NOT EXISTS member (
    member_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nickname VARCHAR(50) NOT NULL UNIQUE,
    nickname_changed_at TIMESTAMP NULL DEFAULT NULL,
    name VARCHAR(50) NULL,
    phone VARCHAR(20) NULL UNIQUE,
    address VARCHAR(200) NULL,
    status ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_nickname (nickname),
    INDEX idx_phone (phone)
    );

-- 2. 관리자 테이블 (admin)
-- 테이블이 존재하지 않을 경우에만 생성합니다.
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

-- 3. 로그인 실패 기록 테이블 (login_attempt)
-- 테이블이 존재하지 않을 경우에만 생성합니다.
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