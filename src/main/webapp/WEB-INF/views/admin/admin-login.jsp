<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>관리자 로그인 - PlayGround Admin</title>
  <link rel="stylesheet" href="<c:url value='/resources/css/admin/admin-login.css'/>">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
</head>
<body>
<div class="login-container">
  <div class="illustration-panel">
    <div class="illustration-content">
      <div class="main-illustration">
        <div class="admin-mockup">
          <div class="dashboard-screen">
            <div class="dashboard-header">
              <div class="header-item"></div>
              <div class="header-item"></div>
              <div class="header-item"></div>
            </div>
            <div class="dashboard-content">
              <div class="chart-container">
                <div class="chart-bar bar-1"></div>
                <div class="chart-bar bar-2"></div>
                <div class="chart-bar bar-3"></div>
                <div class="chart-bar bar-4"></div>
                <div class="chart-bar bar-5"></div>
              </div>
              <div class="stats-grid">
                <div class="stat-card card-1"></div>
                <div class="stat-card card-2"></div>
                <div class="stat-card card-3"></div>
                <div class="stat-card card-4"></div>
              </div>
            </div>
          </div>
          <div class="security-badge">
            <div class="badge-icon">🛡️</div>
            <div class="badge-text">SECURE</div>
          </div>
        </div>
      </div>

      <div class="tagline">
        <h1>PlayGround<br>관리자 센터</h1>
        <p>안전하고 강력한 관리 도구로 시스템을 제어하세요</p>
      </div>
    </div>
  </div>

  <div class="form-panel">
    <div class="form-content">
      <div class="brand-header">
        <div class="logo">⚡ PlayGround Admin</div>
        <h2>관리자 로그인</h2>
        <p class="subtitle">관리자 계정으로 로그인하여 시스템을 관리하세요</p>
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

      <form action="<c:url value='/admin/login'/>" method="post" id="adminLoginForm" class="login-form">
        <div class="form-group">
          <label for="email">관리자 이메일</label>
          <input
                  type="email"
                  id="email"
                  name="adminEmail"
                  placeholder="admin@playground.com"
                  value="${param.email}"
                  required
                  autocomplete="email"
          >
        </div>

        <div class="form-group">
          <label for="password">비밀번호</label>
          <div class="password-field">
            <input
                    type="password"
                    id="password"
                    name="adminPassword"
                    placeholder="비밀번호를 입력하세요"
                    required
                    autocomplete="current-password"
            >
            <button type="button" class="password-toggle" aria-label="비밀번호 보기/숨기기">
              <span class="toggle-icon">👁</span>
            </button>
          </div>
        </div>

        <div class="form-options">
          <label class="remember-me">
            <input type="checkbox" name="rememberMe">
            <span class="checkmark"></span>
            로그인 상태 유지
          </label>
          <div class="security-notice">
            <span class="security-icon">🔒</span>
            <span>보안 연결</span>
          </div>
        </div>

        <button type="submit" class="login-btn">
          <span class="btn-text">관리자 로그인</span>
          <span class="btn-loading">인증 중...</span>
        </button>
      </form>

      <div class="security-info">
        <div class="security-item">
          <div class="security-icon">🛡️</div>
          <div class="security-content">
            <h4>보안 알림</h4>
            <p>관리자 계정은 보안이 강화된 인증을 사용합니다.</p>
          </div>
        </div>
        <div class="security-item">
          <div class="security-icon">📊</div>
          <div class="security-content">
            <h4>시스템 모니터링</h4>
            <p>모든 관리자 활동이 로그로 기록됩니다.</p>
          </div>
        </div>
      </div>

      <div class="back-link">
        <a href="<c:url value='/'/>">← 메인 사이트로 돌아가기</a>
      </div>
    </div>
  </div>
</div>

<script src="<c:url value='/resources/js/admin/admin-login.js'/>"></script>
</body>
</html>