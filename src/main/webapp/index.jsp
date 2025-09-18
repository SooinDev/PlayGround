<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PlayGround - 당신의 디지털 공간</title>
  <link rel="stylesheet" href="<c:url value='/resources/css/index.css'/>">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
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
          <a href="<c:url value='/posts'/>" class="nav-btn nav-btn-posts">
            <span class="btn-icon">📝</span>
            게시판
          </a>
          <a href="<c:url value='/dashboard'/>" class="nav-btn nav-btn-primary">
            <span class="btn-icon">📊</span>
            대시보드
          </a>
          <a href="<c:url value='/member/mypage'/>" class="nav-btn nav-btn-secondary">
            <span class="btn-icon">⚙️</span>
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
    </c:when>
    <c:otherwise>
      <h2 class="tagline">당신의 새로운 디지털 경험</h2>
      <p class="subtitle">
        PlayGround는 창의적인 아이디어와 혁신적인 기능들이 만나는 곳입니다.
        지금 시작하여 무한한 가능성을 경험해보세요.
      </p>
    </c:otherwise>
  </c:choose>

  <div class="cta-buttons">
    <c:choose>
      <c:when test="${not empty sessionScope.loginMember}">
        <a href="<c:url value='/posts'/>" class="btn btn-primary posts-highlight">
          <span class="btn-text">게시판 보기</span>
          <span class="btn-icon">📝</span>
        </a>
        <a href="<c:url value='/posts/new'/>" class="btn btn-secondary">
          <span class="btn-text">글쓰기</span>
          <span class="btn-icon">✍️</span>
        </a>
        <a href="<c:url value='/member/mypage'/>" class="btn btn-tertiary">
          <span class="btn-text">마이페이지</span>
          <span class="btn-icon">⚙️</span>
        </a>
      </c:when>
      <c:otherwise>
        <a href="<c:url value='/member/register'/>" class="btn btn-primary">
          <span class="btn-text">지금 시작하기</span>
          <span class="btn-icon">🚀</span>
        </a>
        <a href="<c:url value='/member/login'/>" class="btn btn-secondary">
          <span class="btn-text">로그인</span>
          <span class="btn-icon">🔐</span>
        </a>
        <a href="<c:url value='/posts'/>" class="btn btn-tertiary">
          <span class="btn-text">둘러보기</span>
          <span class="btn-icon">👀</span>
        </a>
      </c:otherwise>
    </c:choose>
  </div>

  <!-- 퀵 액션 (로그인 시에만 표시) -->
  <c:if test="${not empty sessionScope.loginMember}">
    <div class="quick-actions">
      <div class="action-card primary-action" onclick="location.href='<c:url value='/posts'/>'">
        <div class="action-icon">📝</div>
        <div class="action-content">
          <h3 class="action-title">게시판 둘러보기</h3>
          <p class="action-description">다양한 주제의 글들을 확인하고 소통해보세요</p>
          <span class="action-link">바로가기 →</span>
        </div>
      </div>

      <div class="action-card" onclick="location.href='<c:url value='/posts/new'/>'">
        <div class="action-icon">✍️</div>
        <div class="action-content">
          <h3 class="action-title">새 글 작성</h3>
          <p class="action-description">당신의 이야기를 다른 사람들과 공유해보세요</p>
          <span class="action-link">작성하기 →</span>
        </div>
      </div>

      <div class="action-card" onclick="location.href='<c:url value='/member/mypage'/>'">
        <div class="action-icon">⚙️</div>
        <div class="action-content">
          <h3 class="action-title">프로필 관리</h3>
          <p class="action-description">개인 정보와 계정 설정을 관리해보세요</p>
          <span class="action-link">설정하기 →</span>
        </div>
      </div>
    </div>
  </c:if>
</div>

<!-- Features Section -->
<section class="features" id="features">
  <div class="container">
    <h2 class="section-title">PlayGround의 특별함</h2>
    <p class="section-subtitle">혁신적인 기능들로 더 나은 디지털 경험을 만들어보세요</p>

    <div class="features-grid">
      <div class="feature-card">
        <div class="feature-icon">💬</div>
        <h3 class="feature-title">실시간 소통</h3>
        <p class="feature-description">언제든지 다른 사용자들과 자유롭게 소통하고 아이디어를 공유할 수 있습니다.</p>
      </div>

      <div class="feature-card">
        <div class="feature-icon">🔒</div>
        <h3 class="feature-title">안전한 환경</h3>
        <p class="feature-description">강화된 보안 시스템으로 안전하고 신뢰할 수 있는 플랫폼을 제공합니다.</p>
      </div>

      <div class="feature-card">
        <div class="feature-icon">🎨</div>
        <h3 class="feature-title">창의적 도구</h3>
        <p class="feature-description">다양한 창작 도구와 기능들로 당신의 아이디어를 현실로 만들어보세요.</p>
      </div>
    </div>
  </div>
</section>

<!-- Footer -->
<footer class="footer">
  <div class="container">
    <p>&copy; 2024 PlayGround. All rights reserved.</p>
    <p>혁신적인 디지털 경험의 시작</p>
  </div>
</footer>

<!-- 네비게이션 도트 -->
<nav class="nav-dots">
  <a href="#hero" class="nav-dot active" data-section="hero"></a>
  <a href="#features" class="nav-dot" data-section="features"></a>
</nav>

<script src="<c:url value='/resources/js/index.js'/>"></script>
<script>
  // 환영 메시지 닫기
  function closeWelcomeMessage() {
    const message = document.getElementById('welcomeMessage');
    if (message) {
      message.style.transform = 'translateX(100%)';
      setTimeout(() => message.remove(), 300);
    }
  }

  // 게시판 로딩 상태 관리
  function handlePostsNavigation(element) {
    // 로딩 상태 추가
    element.classList.add('loading');
    element.style.pointerEvents = 'none';

    // 원래 텍스트 저장
    const originalText = element.querySelector('.btn-text').textContent;
    element.querySelector('.btn-text').textContent = '로딩 중...';

    // 페이지 이동
    setTimeout(() => {
      window.location.href = element.href || element.onclick.toString().match(/location\.href='([^']+)'/)[1];
    }, 100);
  }

  // 모든 게시판 관련 링크에 로딩 처리 적용
  document.addEventListener('DOMContentLoaded', function() {
    // CTA 버튼들
    const postsLinks = document.querySelectorAll('a[href*="/posts"], .action-card[onclick*="posts"]');

    postsLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        handlePostsNavigation(this);
      });
    });

    // 네비게이션 버튼들
    const navPostsLinks = document.querySelectorAll('.nav-btn[href*="/posts"]');
    navPostsLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        handlePostsNavigation(this);
      });
    });
  });

  // 뒤로가기 시 로딩 상태 초기화
  window.addEventListener('pageshow', function(event) {
    // bfcache에서 페이지가 복원될 때
    if (event.persisted) {
      // 모든 로딩 상태 제거
      const loadingElements = document.querySelectorAll('.loading');
      loadingElements.forEach(element => {
        element.classList.remove('loading');
        element.style.pointerEvents = 'auto';

        // 텍스트 복원
        const btnText = element.querySelector('.btn-text');
        if (btnText) {
          if (btnText.textContent === '로딩 중...') {
            if (element.href && element.href.includes('/posts')) {
              btnText.textContent = '게시판 보기';
            } else if (element.classList.contains('nav-btn-posts')) {
              btnText.textContent = '게시판';
            }
          }
        }
      });
    }
  });

  // 페이지 언로드 시 상태 초기화
  window.addEventListener('beforeunload', function() {
    const loadingElements = document.querySelectorAll('.loading');
    loadingElements.forEach(element => {
      element.classList.remove('loading');
      element.style.pointerEvents = 'auto';
    });
  });

  // 자동으로 환영 메시지 숨기기 (5초 후)
  <c:if test="${not empty sessionScope.loginMember}">
  setTimeout(() => {
    const message = document.getElementById('welcomeMessage');
    if (message) {
      closeWelcomeMessage();
    }
  }, 5000);
  </c:if>

  // 네비게이션 도트 활성화
  const sections = document.querySelectorAll('section, .hero-section');
  const navDots = document.querySelectorAll('.nav-dot');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollY >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    navDots.forEach(dot => {
      dot.classList.remove('active');
      if (dot.getAttribute('data-section') === current) {
        dot.classList.add('active');
      }
    });
  });
</script>
</body>
</html>