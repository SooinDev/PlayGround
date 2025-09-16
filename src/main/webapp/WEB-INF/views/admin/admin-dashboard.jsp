<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>관리자 대시보드 - PlayGround Admin</title>
  <link rel="stylesheet" href="<c:url value='/resources/css/admin-dashboard.css'/>">
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
        <button class="nav-btn nav-btn-notification" onclick="toggleNotifications()">
          <span class="btn-icon">🔔</span>
          <span class="notification-badge">5</span>
        </button>
        <a href="<c:url value='/admin/members'/>" class="nav-btn nav-btn-primary">
          <span class="btn-icon">👥</span>
          회원 관리
        </a>
        <a href="<c:url value='/admin/settings'/>" class="nav-btn nav-btn-secondary">
          <span class="btn-icon">⚙️</span>
          설정
        </a>
        <a href="<c:url value='/admin/logout'/>" class="nav-btn nav-btn-logout">
          <span class="btn-icon">🚪</span>
          로그아웃
        </a>
      </div>
    </div>
  </div>
</nav>

<!-- 관리자 로그인 성공 시 환영 메시지 -->
<c:if test="${not empty sessionScope.loginAdmin}">
  <div class="welcome-message" id="welcomeMessage">
    <div class="welcome-content">
      <div class="welcome-icon">👋</div>
      <div class="welcome-text">
        <h3>환영합니다, ${sessionScope.loginAdmin.adminEmail}님!</h3>
        <p>PlayGround 대시보드에 로그인되었습니다.</p>
      </div>
      <button class="welcome-close" onclick="closeWelcomeMessage()">×</button>
    </div>
  </div>
</c:if>

<!-- 메인 대시보드 -->
<main class="dashboard-main">
  <div class="dashboard-container">
    <!-- 대시보드 헤더 -->
    <div class="dashboard-header">
      <div class="header-content">
        <h1 class="dashboard-title">시스템 대시보드</h1>
        <p class="dashboard-subtitle">실시간 시스템 현황과 통계를 모니터링하세요</p>
      </div>
      <div class="header-actions">
        <button class="action-btn refresh-btn" onclick="refreshDashboard()">
          <span class="btn-icon">🔄</span>
          새로고침
        </button>
        <button class="action-btn export-btn" onclick="exportReport()">
          <span class="btn-icon">📊</span>
          리포트 내보내기
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
        <span class="status-text">서버 가동률: 99.9%</span>
      </div>
    </div>

    <!-- 주요 통계 카드 -->
    <div class="stats-grid">
      <div class="stat-card primary">
        <div class="stat-header">
          <div class="stat-icon">👥</div>
          <div class="stat-trend positive">+12</div>
        </div>
        <div class="stat-content">
          <h3 class="stat-title">총 회원수</h3>
          <p class="stat-value" data-target="1234">0</p>
          <span class="stat-change">이번 주 +12명 증가</span>
        </div>
      </div>

      <div class="stat-card success">
        <div class="stat-header">
          <div class="stat-icon">🔥</div>
          <div class="stat-trend positive">+5.2%</div>
        </div>
        <div class="stat-content">
          <h3 class="stat-title">활성 사용자</h3>
          <p class="stat-value" data-target="856">0</p>
          <span class="stat-change">전주 대비 +5.2% 증가</span>
        </div>
      </div>

      <div class="stat-card warning">
        <div class="stat-header">
          <div class="stat-icon">📈</div>
          <div class="stat-trend negative">-2.1%</div>
        </div>
        <div class="stat-content">
          <h3 class="stat-title">오늘 방문자</h3>
          <p class="stat-value" data-target="342">0</p>
          <span class="stat-change">어제 대비 -2.1% 감소</span>
        </div>
      </div>

      <div class="stat-card info">
        <div class="stat-header">
          <div class="stat-icon">💾</div>
          <div class="stat-trend neutral">85%</div>
        </div>
        <div class="stat-content">
          <h3 class="stat-title">서버 사용률</h3>
          <p class="stat-value" data-target="85">0</p>
          <span class="stat-change">CPU 85%, 메모리 72%</span>
        </div>
      </div>
    </div>

    <!-- 차트 및 분석 섹션 -->
    <div class="analytics-grid">
      <!-- 사용자 활동 차트 -->
      <div class="chart-card">
        <div class="card-header">
          <h3 class="card-title">사용자 활동 추이</h3>
          <div class="chart-controls">
            <button class="control-btn active" data-period="7d">7일</button>
            <button class="control-btn" data-period="30d">30일</button>
            <button class="control-btn" data-period="90d">90일</button>
          </div>
        </div>
        <div class="chart-container">
          <canvas id="userActivityChart" width="400" height="200"></canvas>
          <div class="chart-placeholder">
            <div class="chart-bars">
              <div class="chart-bar" style="height: 60%" data-value="120"></div>
              <div class="chart-bar" style="height: 80%" data-value="160"></div>
              <div class="chart-bar" style="height: 45%" data-value="90"></div>
              <div class="chart-bar" style="height: 90%" data-value="180"></div>
              <div class="chart-bar" style="height: 70%" data-value="140"></div>
              <div class="chart-bar" style="height: 85%" data-value="170"></div>
              <div class="chart-bar" style="height: 65%" data-value="130"></div>
            </div>
            <div class="chart-labels">
              <span>월</span>
              <span>화</span>
              <span>수</span>
              <span>목</span>
              <span>금</span>
              <span>토</span>
              <span>일</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 시스템 성능 -->
      <div class="performance-card">
        <div class="card-header">
          <h3 class="card-title">시스템 성능</h3>
          <button class="card-action" onclick="viewDetails('performance')">자세히 보기</button>
        </div>
        <div class="performance-metrics">
          <div class="metric-item">
            <div class="metric-label">CPU 사용률</div>
            <div class="metric-bar">
              <div class="metric-fill" style="width: 75%" data-value="75"></div>
            </div>
            <div class="metric-value">75%</div>
          </div>
          <div class="metric-item">
            <div class="metric-label">메모리 사용률</div>
            <div class="metric-bar">
              <div class="metric-fill" style="width: 62%" data-value="62"></div>
            </div>
            <div class="metric-value">62%</div>
          </div>
          <div class="metric-item">
            <div class="metric-label">디스크 사용률</div>
            <div class="metric-bar">
              <div class="metric-fill" style="width: 45%" data-value="45"></div>
            </div>
            <div class="metric-value">45%</div>
          </div>
          <div class="metric-item">
            <div class="metric-label">네트워크 대역폭</div>
            <div class="metric-bar">
              <div class="metric-fill" style="width: 88%" data-value="88"></div>
            </div>
            <div class="metric-value">88%</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 최근 활동 및 알림 -->
    <div class="activity-grid">
      <!-- 최근 활동 -->
      <div class="activity-card">
        <div class="card-header">
          <h3 class="card-title">최근 활동</h3>
          <button class="card-action" onclick="viewAllActivities()">전체 보기</button>
        </div>
        <div class="activity-list">
          <div class="activity-item">
            <div class="activity-icon new-user">👤</div>
            <div class="activity-content">
              <p class="activity-text">새로운 사용자 <strong>user123</strong>이 가입했습니다</p>
              <span class="activity-time">5분 전</span>
            </div>
            <div class="activity-status success">완료</div>
          </div>
          <div class="activity-item">
            <div class="activity-icon system">🔧</div>
            <div class="activity-content">
              <p class="activity-text">시스템 설정이 업데이트되었습니다</p>
              <span class="activity-time">1시간 전</span>
            </div>
            <div class="activity-status success">완료</div>
          </div>
          <div class="activity-item">
            <div class="activity-icon report">📊</div>
            <div class="activity-content">
              <p class="activity-text">일일 리포트가 생성되었습니다</p>
              <span class="activity-time">3시간 전</span>
            </div>
            <div class="activity-status success">완료</div>
          </div>
          <div class="activity-item">
            <div class="activity-icon warning">⚠️</div>
            <div class="activity-content">
              <p class="activity-text">서버 CPU 사용률이 80%를 초과했습니다</p>
              <span class="activity-time">5시간 전</span>
            </div>
            <div class="activity-status warning">주의</div>
          </div>
        </div>
      </div>

      <!-- 빠른 액션 -->
      <div class="quick-actions-card">
        <div class="card-header">
          <h3 class="card-title">빠른 작업</h3>
        </div>
        <div class="quick-actions">
          <button class="quick-action-btn" onclick="quickAction('backup')">
            <div class="action-icon">💾</div>
            <span class="action-text">시스템 백업</span>
          </button>
          <button class="quick-action-btn" onclick="quickAction('maintenance')">
            <div class="action-icon">🔧</div>
            <span class="action-text">유지보수 모드</span>
          </button>
          <button class="quick-action-btn" onclick="quickAction('cleanup')">
            <div class="action-icon">🧹</div>
            <span class="action-text">캐시 정리</span>
          </button>
          <button class="quick-action-btn" onclick="quickAction('security')">
            <div class="action-icon">🛡️</div>
            <span class="action-text">보안 스캔</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</main>

<!-- 알림 패널 -->
<div class="notification-panel" id="notificationPanel">
  <div class="notification-header">
    <h3>시스템 알림</h3>
    <button class="close-btn" onclick="toggleNotifications()">×</button>
  </div>
  <div class="notification-list">
    <div class="notification-item critical unread">
      <div class="notification-icon">🚨</div>
      <div class="notification-content">
        <p>긴급: 서버 디스크 공간이 부족합니다</p>
        <span class="notification-time">5분 전</span>
      </div>
    </div>
    <div class="notification-item warning unread">
      <div class="notification-icon">⚠️</div>
      <div class="notification-content">
        <p>경고: CPU 사용률이 높습니다</p>
        <span class="notification-time">15분 전</span>
      </div>
    </div>
    <div class="notification-item info unread">
      <div class="notification-icon">📊</div>
      <div class="notification-content">
        <p>정보: 주간 리포트가 준비되었습니다</p>
        <span class="notification-time">1시간 전</span>
      </div>
    </div>
    <div class="notification-item success">
      <div class="notification-icon">✅</div>
      <div class="notification-content">
        <p>성공: 시스템 백업이 완료되었습니다</p>
        <span class="notification-time">2시간 전</span>
      </div>
    </div>
    <div class="notification-item info">
      <div class="notification-icon">👤</div>
      <div class="notification-content">
        <p>새로운 회원 가입: user456</p>
        <span class="notification-time">3시간 전</span>
      </div>
    </div>
  </div>
</div>

<script src="<c:url value='/resources/js/admin-dashboard.js'/>"></script>
</body>
</html>