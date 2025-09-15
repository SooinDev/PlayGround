<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PlayGround - 당신의 디지털 공간</title>
  <link rel="stylesheet" href="<c:url value='/resources/css/index.css'/>">
</head>
<body>
<!-- 로그인 시 상단 네비게이션 바 -->
<c:if test="${not empty sessionScope.loginMember}">
  <nav class="top-navbar">
    <div class="nav-container">
      <div class="nav-brand">
        <span class="brand-logo">PlayGround</span>
      </div>
      <div class="nav-menu">
        <div class="nav-user-info">
          <div class="user-avatar">
            <span class="avatar-text">${sessionScope.loginMember.nickname.substring(0,1).toUpperCase()}</span>
          </div>
          <span class="username">${sessionScope.loginMember.nickname}님</span>
        </div>
        <div class="nav-buttons">
          <a href="<c:url value='/dashboard'/>" class="nav-btn nav-btn-primary">
            <span class="btn-icon">📊</span>
            대시보드
          </a>
          <a href="<c:url value='/member/mypage/info'/>" class="nav-btn nav-btn-secondary">
            <span class="btn-icon">👤</span>
            마이페이지
          </a>
          <a href="<c:url value='/member/logout'/>" class="nav-btn nav-btn-logout">
            <span class="btn-icon">🚪</span>
            로그아웃
          </a>
        </div>
      </div>
    </div>
  </nav>
</c:if>

<!-- 로그인 성공 시 환영 메시지 -->
<c:if test="${not empty sessionScope.loginMember}">
  <div class="welcome-message" id="welcomeMessage">
    <div class="welcome-content">
      <div class="welcome-icon">👋</div>
      <div class="welcome-text">
        <h3>환영합니다, ${sessionScope.loginMember.nickname}님!</h3>
        <p>PlayGround에 성공적으로 로그인되었습니다.</p>
      </div>
      <button class="welcome-close" onclick="closeWelcomeMessage()">×</button>
    </div>
  </div>
</c:if>

<div class="hero-section" id="hero">
  <h1 class="logo">PlayGround</h1>
  <c:choose>
    <c:when test="${not empty sessionScope.loginMember}">
      <h2 class="tagline">${sessionScope.loginMember.nickname}님의 디지털 공간</h2>
      <p class="subtitle">
        다시 오신 것을 환영합니다! 새로운 기능들을 둘러보시고
        PlayGround에서 더 많은 것들을 경험해보세요.
      </p>
      <div class="cta-buttons">
        <a href="<c:url value='/dashboard'/>" class="btn btn-primary">
          <span class="btn-icon">📊</span>
          대시보드 바로가기
        </a>
        <a href="<c:url value='/member/mypage'/>" class="btn btn-secondary">
          <span class="btn-icon">👤</span>
          내 프로필
        </a>
      </div>

      <!-- 로그인 사용자를 위한 빠른 액션 카드 -->
      <div class="quick-actions">
        <div class="action-card">
          <div class="action-icon">📈</div>
          <h3>대시보드</h3>
          <p>나의 활동 내역을 확인하세요</p>
          <a href="<c:url value='/dashboard'/>" class="action-link">보러가기 →</a>
        </div>
        <div class="action-card">
          <div class="action-icon">⚙️</div>
          <h3>계정 설정</h3>
          <p>프로필과 설정을 관리하세요</p>
          <a href="<c:url value='/member/mypage'/>" class="action-link">설정하기 →</a>
        </div>
        <div class="action-card">
          <div class="action-icon">🌟</div>
          <h3>새로운 기능</h3>
          <p>최신 업데이트를 확인하세요</p>
          <a href="#features" class="action-link">둘러보기 →</a>
        </div>
      </div>
    </c:when>
    <c:otherwise>
      <h2 class="tagline">당신의 디지털 공간</h2>
      <p class="subtitle">
        혁신적인 회원 관리 시스템으로 더 나은 커뮤니티를 만들어보세요.
        간편하고 안전한 가입 절차를 통해 새로운 디지털 경험을 시작하세요.
      </p>
      <div class="cta-buttons">
        <a href="<c:url value='/member/register'/>" class="btn btn-primary">
          회원가입
        </a>
        <a href="<c:url value='/member/login'/>" class="btn btn-secondary">
          로그인
        </a>
      </div>
    </c:otherwise>
  </c:choose>
</div>

<div class="features" id="features">
  <div class="container">
    <h2 class="section-title">왜 PlayGround인가?</h2>
    <p class="section-subtitle">
      사용자 중심의 설계와 최신 보안 기술로 안전하고 편리한 서비스를 제공합니다.
    </p>

    <div class="features-grid">
      <div class="feature-card">
        <div class="feature-icon">🔒</div>
        <h3 class="feature-title">강력한 보안</h3>
        <p class="feature-description">
          최신 암호화 기술과 다중 보안 계층으로 개인정보를 안전하게 보호합니다.
        </p>
      </div>

      <div class="feature-card">
        <div class="feature-icon">⚡</div>
        <h3 class="feature-title">빠른 성능</h3>
        <p class="feature-description">
          최적화된 시스템 아키텍처로 빠르고 안정적인 서비스를 경험하세요.
        </p>
      </div>

      <div class="feature-card">
        <div class="feature-icon">🎨</div>
        <h3 class="feature-title">직관적 디자인</h3>
        <p class="feature-description">
          사용자 친화적인 인터페이스로 누구나 쉽게 이용할 수 있습니다.
        </p>
      </div>
    </div>
  </div>
</div>

<div class="footer">
  <div class="container">
    <p>&copy; 2025 PlayGround. 모든 권리 보유.</p>
    <p style="margin-top: 8px; font-size: 15px;">
      개인정보보호정책 | 이용약관 | 고객지원
    </p>
  </div>
</div>

<div class="nav-dots">
  <div class="nav-dot active" data-section="hero"></div>
  <div class="nav-dot" data-section="features"></div>
</div>

<script src="<c:url value='/resources/js/index.js'/>"></script>
</body>
</html>