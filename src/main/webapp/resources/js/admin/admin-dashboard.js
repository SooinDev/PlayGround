// 관리자 대시보드 스크립트 (현실적 버전 - mock 데이터 제거)
console.log("관리자 대시보드 스크립트 로드 완료.");

document.addEventListener('DOMContentLoaded', function() {
  // 상단 네비게이션 기능
  initTopNavigation();

  // 기본 보안 기능
  initBasicSecurity();

  // 마지막 업데이트 시간 설정
  updateLastUpdateTime();
});

// 환영 알림 표시 함수 (전역)
function showWelcomeNotification(adminEmail) {
  const message = `환영합니다, ${adminEmail}님! 관리자 대시보드에 성공적으로 로그인되었습니다.`;
  showNotification(message, 'success', 5000);
  logAdminActivity('admin_login_welcome', adminEmail);
}

// 알림 메시지 표시 함수
function showNotification(message, type = 'info', duration = 5000) {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    padding: 16px 24px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    color: white;
    transform: translateX(400px);
    transition: transform 0.3s ease;
    max-width: 400px;
    word-wrap: break-word;
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    border-left: 4px solid;
  `;

  // 타입별 스타일 설정
  switch(type) {
    case 'success':
      notification.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      notification.style.borderLeftColor = '#34d399';
      break;
    case 'error':
      notification.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
      notification.style.borderLeftColor = '#f87171';
      break;
    case 'warning':
      notification.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
      notification.style.borderLeftColor = '#fbbf24';
      break;
    case 'critical':
      notification.style.background = 'linear-gradient(135deg, #dc2626, #991b1b)';
      notification.style.borderLeftColor = '#ef4444';
      notification.style.animation = 'pulse 1s infinite';
      break;
    default:
      notification.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)';
      notification.style.borderLeftColor = '#60a5fa';
  }

  notification.textContent = message;
  document.body.appendChild(notification);

  // 슬라이드 인 애니메이션
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);

  // 자동 제거
  setTimeout(() => {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, duration);
}

// 상단 네비게이션 초기화
function initTopNavigation() {
  // 로그아웃 확인
  const logoutBtn = document.querySelector('.nav-btn-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (confirm('정말 로그아웃하시겠습니까?')) {
        logAdminActivity('logout', 'admin_dashboard');
        // 실제 로그아웃 처리
        window.location.href = this.href;
      }
    });
  }

  // 네비게이션 클릭 로깅
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const target = this.textContent.trim();
      logAdminActivity('navigation', target);
    });
  });
}

// 대시보드 새로고침 함수 (전역)
function refreshDashboard() {
  logAdminActivity('dashboard_refresh', 'manual');

  // 새로고침 버튼 일시적 비활성화
  const refreshBtn = document.querySelector('.refresh-btn');
  if (refreshBtn) {
    refreshBtn.style.opacity = '0.6';
    refreshBtn.disabled = true;

    setTimeout(() => {
      refreshBtn.style.opacity = '1';
      refreshBtn.disabled = false;
      updateLastUpdateTime();
    }, 1000);
  }

  console.log('대시보드 새로고침 완료');
}

// 마지막 업데이트 시간 갱신
function updateLastUpdateTime() {
  const timeElement = document.getElementById('lastUpdate');
  if (timeElement) {
    const now = new Date();
    const timeString = now.getHours().toString().padStart(2, '0') + ':' +
        now.getMinutes().toString().padStart(2, '0');
    timeElement.textContent = timeString;
  }
}

// 기본 보안 기능
function initBasicSecurity() {
  // 관리자 활동 로깅
  logAdminActivity('page_access', 'admin_dashboard');

  // 세션 타임아웃 기본 모니터링
  initBasicSessionMonitoring();

  // 페이지 가시성 모니터링
  initVisibilityMonitoring();
}

// 기본 세션 모니터링
function initBasicSessionMonitoring() {
  let lastActivity = Date.now();
  const sessionWarningTime = 25 * 60 * 1000; // 25분
  const sessionTimeout = 30 * 60 * 1000; // 30분

  // 사용자 활동 감지
  ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'].forEach(event => {
    document.addEventListener(event, () => {
      lastActivity = Date.now();
    }, { passive: true });
  });

  // 세션 체크 (5분마다)
  setInterval(() => {
    const timeSinceLastActivity = Date.now() - lastActivity;

    if (timeSinceLastActivity > sessionWarningTime && timeSinceLastActivity < sessionTimeout) {
      if (confirm('세션이 5분 후 만료됩니다. 페이지를 새로고침하여 연장하시겠습니까?')) {
        window.location.reload();
      }
    } else if (timeSinceLastActivity > sessionTimeout) {
      alert('세션이 만료되어 로그인 페이지로 이동합니다.');
      logAdminActivity('session_timeout', 'auto_logout');
      window.location.href = '/admin/login?timeout=true';
    }
  }, 300000); // 5분마다 체크
}

// 페이지 가시성 모니터링
function initVisibilityMonitoring() {
  let isHidden = false;
  let hiddenStartTime = null;

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isHidden = true;
      hiddenStartTime = Date.now();
      logAdminActivity('page_hidden', 'tab_switch');
    } else if (isHidden) {
      isHidden = false;
      const hiddenDuration = Date.now() - hiddenStartTime;

      // 5분 이상 숨겨져 있었다면 업데이트 시간 갱신
      if (hiddenDuration > 300000) {
        console.log('페이지가 오랫동안 비활성 상태였습니다. 데이터를 새로고침합니다.');
        updateLastUpdateTime();
      }

      logAdminActivity('page_visible', `hidden_for_${Math.floor(hiddenDuration/1000)}s`);
    }
  });
}

// 관리자 활동 로깅 (기본적인 콘솔 로그)
function logAdminActivity(action, target) {
  const logData = {
    timestamp: new Date().toISOString(),
    action: action,
    target: target,
    userAgent: navigator.userAgent,
    url: window.location.href
  };

  console.log('관리자 활동:', logData);

  // 실제 구현시에는 서버로 로그 전송
  // fetch('/admin/activity-log', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(logData)
  // });
}

// 키보드 단축키 (기본적인 것들만)
document.addEventListener('keydown', function(e) {
  // Ctrl/Cmd + R로 대시보드 새로고침
  if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
    e.preventDefault();
    refreshDashboard();
  }

  // F5로 강제 새로고침 로깅
  if (e.key === 'F5') {
    logAdminActivity('force_refresh', 'f5_key');
  }
});

// 브라우저 이벤트 처리
window.addEventListener('beforeunload', function(e) {
  logAdminActivity('page_unload', 'browser_navigation');
});

window.addEventListener('error', function(e) {
  console.error('JavaScript 오류:', e.error);
  logAdminActivity('javascript_error', e.error ? e.error.message : 'unknown_error');
});

// 네트워크 상태 모니터링 (기본)
window.addEventListener('online', function() {
  console.log('인터넷 연결이 복구되었습니다.');
  logAdminActivity('network_status', 'online');
});

window.addEventListener('offline', function() {
  console.log('인터넷 연결이 끊어졌습니다.');
  logAdminActivity('network_status', 'offline');
});

// 페이지 로드 완료 후 초기화
window.addEventListener('load', function() {
  console.log("관리자 대시보드 로드 및 초기화 완료 (현실적 버전)");

  // 초기 데이터 로드
  setTimeout(() => {
    updateLastUpdateTime();
  }, 1000);

  // 초기 성능 체크 (기본)
  if (performance.timing) {
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    if (loadTime > 3000) {
      console.warn('페이지 로딩이 평소보다 느립니다:', loadTime + 'ms');
    }
  }
});

console.log("관리자 대시보드 스크립트 초기화 완료 (Mock 데이터 제거됨)");