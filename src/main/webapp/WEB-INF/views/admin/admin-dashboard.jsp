<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>관리자 대시보드 - PlayGround Admin</title>
  <link rel="stylesheet" href="<c:url value='/resources/css/admin/admin-dashboard.css'/>">
</head>
<body>
<!-- 상단 네비게이션 바 -->
<nav class="admin-navbar">
  <div class="nav-container">
    <div class="nav-brand">
      <span class="brand-logo">⚡ PlayGround Admin</span>
      <span class="page-title">대시보드</span>
    </div>
    <div class="nav-menu">
      <div class="nav-user-info">
        <div class="admin-avatar">
          <span class="avatar-text">${sessionScope.loginAdmin.adminEmail.substring(0,1).toUpperCase()}</span>
        </div>
        <div class="user-details">
          <span class="admin-name">${sessionScope.loginAdmin.adminEmail}</span>
          <span class="admin-role">시스템 관리자</span>
        </div>
      </div>
      <div class="nav-buttons">
        <a href="<c:url value='/admin/members'/>" class="nav-btn nav-btn-primary">
          <span class="btn-icon">회원 관리</span>
        </a>
        <a href="<c:url value='/admin/settings'/>" class="nav-btn nav-btn-secondary">
          <span class="btn-icon">설정</span>
        </a>
        <a href="<c:url value='/admin/logout'/>" class="nav-btn nav-btn-logout">
          <span class="btn-icon">로그아웃</span>
        </a>
      </div>
    </div>
  </div>
</nav>

<!-- 관리자 로그인 성공 시 JavaScript 알림으로 처리 -->
<c:if test="${not empty sessionScope.loginAdmin}">
  <script>
    // 페이지 로드 후 환영 알림 표시
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(() => {
        showWelcomeNotification('${sessionScope.loginAdmin.adminEmail}');
      }, 500);
    });
  </script>
</c:if>

<!-- 메인 대시보드 -->
<main class="dashboard-main">
  <div class="dashboard-container">
    <!-- 대시보드 헤더 -->
    <div class="dashboard-header">
      <div class="header-content">
        <h1 class="dashboard-title">시스템 대시보드</h1>
        <p class="dashboard-subtitle">PlayGround 관리자 시스템 - 현재 구현된 기능 현황</p>
      </div>
      <div class="header-actions">
        <button class="action-btn refresh-btn" onclick="refreshDashboard()">
          <span class="btn-icon">새로고침</span>
        </button>
      </div>
    </div>

    <!-- 실시간 상태 표시 -->
    <div class="status-bar">
      <div class="status-item">
        <div class="status-indicator online"></div>
        <span class="status-text">시스템 정상</span>
      </div>
      <div class="status-item">
        <div class="status-indicator"></div>
        <span class="status-text">마지막 업데이트: <span id="lastUpdate">방금 전</span></span>
      </div>
      <div class="status-item">
        <div class="status-indicator"></div>
        <span class="status-text">관리자 세션: 활성</span>
      </div>
    </div>

    <!-- 현재 구현 상태 -->
    <div class="info-section">
      <h2>🚀 PlayGround 관리자 시스템 현황</h2>
      <p>현재 구현된 기능들과 기본적인 관리 도구들을 확인하실 수 있습니다.</p>

      <ul class="feature-list">
        <li>
          <span class="feature-icon">🔐</span>
          <div class="feature-text">
            <strong>관리자 인증 시스템</strong>
            <br>관리자 로그인/로그아웃 및 세션 관리
          </div>
          <span class="feature-status status-implemented">구현됨</span>
        </li>

        <li>
          <span class="feature-icon">👥</span>
          <div class="feature-text">
            <strong>회원 관리</strong>
            <br>회원 목록 조회 및 기본 관리 기능
          </div>
          <span class="feature-status status-implemented">구현됨</span>
        </li>

        <li>
          <span class="feature-icon">📊</span>
          <div class="feature-text">
            <strong>대시보드 UI</strong>
            <br>기본 대시보드 레이아웃 및 네비게이션
          </div>
          <span class="feature-status status-implemented">구현됨</span>
        </li>

        <li>
          <span class="feature-icon">🔒</span>
          <div class="feature-text">
            <strong>보안 기능</strong>
            <br>기본적인 접근 제어 및 세션 보안
          </div>
          <span class="feature-status status-basic">기본</span>
        </li>

        <li>
          <span class="feature-icon">⚙️</span>
          <div class="feature-text">
            <strong>시스템 설정</strong>
            <br>기본 시스템 설정 페이지
          </div>
          <span class="feature-status status-basic">기본</span>
        </li>

        <li>
          <span class="feature-icon">📝</span>
          <div class="feature-text">
            <strong>활동 로그</strong>
            <br>관리자 활동 기록 (콘솔 로그)
          </div>
          <span class="feature-status status-basic">기본</span>
        </li>
      </ul>

      <p class="info-note">
        💡 이 대시보드는 mock 데이터 없이 실제 구현된 기능들만 표시합니다.<br>
        추가 기능은 점진적으로 개발하여 업데이트할 예정입니다.
      </p>
    </div>
  </div>
</main>

<script src="<c:url value='/resources/js/admin/admin-dashboard.js'/>"></script>
</body>
</html>