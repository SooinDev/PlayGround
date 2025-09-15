<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>회원가입 - PlayGround</title>
  <link rel="stylesheet" href="<c:url value='/resources/css/register.css'/>">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
</head>
<body>
<div class="register-container">
  <!-- 왼쪽 일러스트레이션 영역 -->
  <div class="illustration-panel">
    <div class="illustration-content">
      <div class="floating-elements">
        <div class="element element-1"></div>
        <div class="element element-2"></div>
        <div class="element element-3"></div>
        <div class="element element-4"></div>
        <div class="element element-5"></div>
        <div class="element element-6"></div>
      </div>

      <div class="main-illustration">
        <div class="community-mockup">
          <div class="users-grid">
            <div class="user-card card-1">
              <div class="user-avatar avatar-1"></div>
              <div class="user-info">
                <div class="user-name"></div>
                <div class="user-role"></div>
              </div>
            </div>
            <div class="user-card card-2">
              <div class="user-avatar avatar-2"></div>
              <div class="user-info">
                <div class="user-name"></div>
                <div class="user-role"></div>
              </div>
            </div>
            <div class="user-card card-3">
              <div class="user-avatar avatar-3"></div>
              <div class="user-info">
                <div class="user-name"></div>
                <div class="user-role"></div>
              </div>
            </div>
          </div>
          <div class="connection-lines">
            <div class="line line-1"></div>
            <div class="line line-2"></div>
            <div class="line line-3"></div>
          </div>
        </div>
      </div>

      <div class="tagline">
        <h1>새로운 커뮤니티에<br>참여하세요</h1>
        <p>PlayGround에서 동료들과 연결되고 성장하세요</p>
      </div>
    </div>
  </div>

  <!-- 오른쪽 회원가입 폼 영역 -->
  <div class="form-panel">
    <div class="form-content">
      <div class="brand-header">
        <div class="logo">PlayGround</div>
        <h2>계정 만들기</h2>
        <p class="subtitle">몇 분 안에 시작할 수 있습니다</p>
      </div>

      <c:if test="${not empty errorMessage}">
        <div class="error-message">
          <div class="error-icon">⚠</div>
          <div class="error-text">${errorMessage}</div>
        </div>
      </c:if>

      <c:if test="${not empty successMessage}">
        <div class="success-message">
          <div class="success-icon">✓</div>
          <div class="success-text">${successMessage}</div>
        </div>
      </c:if>

      <form action="<c:url value='/member/register'/>" method="post" id="registerForm" class="register-form">
        <div class="form-row">
          <div class="form-group">
            <label for="email">이메일 주소 *</label>
            <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="your@email.com"
                    value="${param.email}"
                    required
                    autocomplete="email"
            >
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="nickname">닉네임 *</label>
            <input
                    type="text"
                    id="nickname"
                    name="nickname"
                    placeholder="다른 사용자에게 표시될 이름"
                    value="${param.nickname}"
                    required
                    autocomplete="username"
            >
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="password">비밀번호 *</label>
            <div class="password-field">
              <input
                      type="password"
                      id="password"
                      name="password"
                      placeholder="최소 8자리 이상"
                      required
                      autocomplete="new-password"
                      minlength="8"
              >
              <button type="button" class="password-toggle" aria-label="비밀번호 보기/숨기기">
                <span class="toggle-icon">👁</span>
              </button>
            </div>
            <div class="password-strength">
              <div class="strength-bar">
                <div class="strength-fill"></div>
              </div>
              <div class="strength-text">비밀번호 강도</div>
            </div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="confirmPassword">비밀번호 확인 *</label>
            <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="비밀번호를 다시 입력하세요"
                    required
                    autocomplete="new-password"
            >
          </div>
        </div>

        <div class="form-row two-columns">
          <div class="form-group">
            <label for="name">실명</label>
            <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="이름"
                    value="${param.name}"
                    autocomplete="name"
            >
          </div>
          <div class="form-group">
            <label for="phone">연락처</label>
            <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="010-1234-5678"
                    value="${param.phone}"
                    autocomplete="tel"
            >
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="address">주소</label>
            <input
                    type="text"
                    id="address"
                    name="address"
                    placeholder="서울특별시 강남구..."
                    value="${param.address}"
                    autocomplete="address-line1"
            >
          </div>
        </div>

        <div class="terms-agreement">
          <label class="checkbox-container">
            <input type="checkbox" name="agreeTerms" required>
            <span class="checkmark"></span>
            <span class="terms-text">
                <a href="#" class="terms-link">이용약관</a> 및
                <a href="#" class="terms-link">개인정보처리방침</a>에 동의합니다
              </span>
          </label>
        </div>

        <button type="submit" class="register-btn">
          <span class="btn-text">계정 만들기</span>
          <span class="btn-loading">처리 중...</span>
        </button>
      </form>

      <div class="divider">
        <span>또는</span>
      </div>

      <div class="social-register">
        <button type="button" class="social-btn google-btn">
          <svg class="social-icon" viewBox="0 0 24 24">
            <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google로 가입하기
        </button>

        <button type="button" class="social-btn github-btn">
          <svg class="social-icon" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          GitHub로 가입하기
        </button>
      </div>

      <div class="login-link">
        <p>이미 계정이 있으신가요?
          <a href="<c:url value='/member/login'/>">로그인하기</a>
        </p>
      </div>
    </div>
  </div>
</div>

<script src="<c:url value='/resources/js/register.js'/>"></script>
</body>
</html>