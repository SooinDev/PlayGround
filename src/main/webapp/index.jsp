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
<div class="hero-section" id="hero">
  <h1 class="logo">PlayGround</h1>
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