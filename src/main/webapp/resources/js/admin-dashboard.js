// 관리자 대시보드 스크립트
console.log("관리자 대시보드 스크립트 로드 완료.");

document.addEventListener('DOMContentLoaded', function() {
  // 환영 메시지 자동 닫기
  initWelcomeMessage();

  // 상단 네비게이션 기능
  initTopNavigation();

  // 통계 카드 애니메이션
  initStatsAnimation();

  // 차트 애니메이션
  initChartAnimation();

  // 실시간 업데이트
  initRealTimeUpdates();

  // 보안 기능
  initSecurityFeatures();

  // 차트 컨트롤
  initChartControls();

  // 성능 메트릭 애니메이션
  initPerformanceMetrics();

  // 빠른 액션 버튼
  initQuickActions();
});

// 환영 메시지 관리
function initWelcomeMessage() {
  const welcomeMessage = document.getElementById('welcomeMessage');
  if (welcomeMessage) {
    // 5초 후 자동으로 닫기
    setTimeout(() => {
      closeWelcomeMessage();
    }, 5000);
  }
}

// 환영 메시지 닫기 함수 (전역 함수로 선언)
function closeWelcomeMessage() {
  const welcomeMessage = document.getElementById('welcomeMessage');
  if (welcomeMessage) {
    welcomeMessage.style.transform = 'translateX(100%)';
    welcomeMessage.style.opacity = '0';
    setTimeout(() => {
      welcomeMessage.remove();
    }, 300);
  }
}

// 상단 네비게이션 초기화
function initTopNavigation() {
  // 로그아웃 확인
  const logoutBtn = document.querySelector('.nav-btn-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (confirm('정말 로그아웃하시겠습니까?')) {
        showNotification('로그아웃 중...', 'info');
        logAdminActivity('logout', 'admin_dashboard');
        setTimeout(() => {
          window.location.href = this.href;
        }, 1000);
      }
    });
  }

  // 알림 패널 토글
  const notificationBtn = document.querySelector('.nav-btn-notification');
  if (notificationBtn) {
    notificationBtn.addEventListener('click', toggleNotifications);
  }
}

// 알림 패널 토글 함수 (전역 함수로 선언)
function toggleNotifications() {
  const panel = document.getElementById('notificationPanel');
  panel.classList.toggle('open');

  logAdminActivity('notification_panel', panel.classList.contains('open') ? 'opened' : 'closed');

  // 알림 읽음 처리
  if (panel.classList.contains('open')) {
    setTimeout(() => {
      const unreadItems = panel.querySelectorAll('.notification-item.unread');
      unreadItems.forEach(item => {
        item.classList.remove('unread');
      });

      // 알림 배지 업데이트
      const badge = document.querySelector('.notification-badge');
      if (badge) {
        const criticalCount = panel.querySelectorAll('.notification-item.critical.unread').length;
        if (criticalCount > 0) {
          badge.textContent = criticalCount;
        } else {
          badge.style.display = 'none';
        }
      }
    }, 2000);
  }
}

// 통계 카드 애니메이션 초기화
function initStatsAnimation() {
  const statValues = document.querySelectorAll('.stat-value[data-target]');

  // Intersection Observer로 뷰포트 진입 시 애니메이션
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateStatValue(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statValues.forEach(value => {
    observer.observe(value);
  });
}

// 통계 값 애니메이션
function animateStatValue(element) {
  const target = parseInt(element.dataset.target);
  let current = 0;
  const increment = target / 60;
  const duration = 2000;
  const stepTime = duration / 60;

  element.textContent = '0';

  const counter = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(counter);
    }

    if (target >= 1000) {
      element.textContent = Math.floor(current).toLocaleString();
    } else {
      element.textContent = Math.floor(current);
    }
  }, stepTime);
}

// 차트 애니메이션 초기화
function initChartAnimation() {
  const chartBars = document.querySelectorAll('.chart-bar');

  chartBars.forEach((bar, index) => {
    const originalHeight = bar.style.height;
    bar.style.height = '10px';
    bar.style.opacity = '0.5';

    setTimeout(() => {
      bar.style.height = originalHeight;
      bar.style.opacity = '1';
    }, 500 + (index * 100));
  });
}

// 차트 컨트롤 초기화
function initChartControls() {
  const controlBtns = document.querySelectorAll('.control-btn');

  controlBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // 모든 버튼에서 active 클래스 제거
      controlBtns.forEach(b => b.classList.remove('active'));
      // 클릭된 버튼에 active 클래스 추가
      this.classList.add('active');

      const period = this.dataset.period;
      updateChartData(period);

      logAdminActivity('chart_period_change', period);
    });
  });
}

// 차트 데이터 업데이트
function updateChartData(period) {
  const chartBars = document.querySelectorAll('.chart-bar');
  const labels = document.querySelectorAll('.chart-labels span');

  let newData, newLabels;

  switch(period) {
    case '7d':
      newData = [60, 80, 45, 90, 70, 85, 65];
      newLabels = ['월', '화', '수', '목', '금', '토', '일'];
      break;
    case '30d':
      newData = [70, 85, 60, 95, 80, 75, 90];
      newLabels = ['1주', '2주', '3주', '4주', '5주', '6주', '7주'];
      break;
    case '90d':
      newData = [65, 75, 85, 70, 90, 80, 95];
      newLabels = ['1월', '2월', '3월', '4월', '5월', '6월', '7월'];
      break;
  }

  // 차트 바 업데이트
  chartBars.forEach((bar, index) => {
    bar.style.height = '10px';
    setTimeout(() => {
      bar.style.height = newData[index] + '%';
      bar.dataset.value = Math.floor(newData[index] * 2); // 임의 값
    }, 100);
  });

  // 라벨 업데이트
  labels.forEach((label, index) => {
    label.textContent = newLabels[index];
  });

  showNotification(`${period} 데이터로 업데이트되었습니다.`, 'info', 3000);
}

// 성능 메트릭 애니메이션
function initPerformanceMetrics() {
  const metricFills = document.querySelectorAll('.metric-fill');

  metricFills.forEach((fill, index) => {
    const targetWidth = fill.style.width;
    fill.style.width = '0%';

    setTimeout(() => {
      fill.style.width = targetWidth;
    }, 1000 + (index * 200));
  });
}

// 빠른 액션 초기화
function initQuickActions() {
  const actionBtns = document.querySelectorAll('.quick-action-btn');

  actionBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const actionType = this.onclick.toString().match(/quickAction\('(\w+)'\)/)[1];
      quickAction(actionType);
    });
  });
}

// 빠른 액션 처리 (전역 함수)
function quickAction(action) {
  let message = '';
  let duration = 3000;

  switch(action) {
    case 'backup':
      message = '시스템 백업을 시작합니다...';
      duration = 5000;
      break;
    case 'maintenance':
      message = '유지보수 모드로 전환 중...';
      duration = 4000;
      break;
    case 'cleanup':
      message = '캐시 정리를 시작합니다...';
      duration = 3000;
      break;
    case 'security':
      message = '보안 스캔을 시작합니다...';
      duration = 6000;
      break;
  }

  showNotification(message, 'info', duration);
  logAdminActivity('quick_action', action);

  // 진행률 시뮬레이션
  setTimeout(() => {
    showNotification(`${getActionName(action)}이(가) 완료되었습니다.`, 'success');
  }, duration - 1000);
}

// 액션 이름 반환
function getActionName(action) {
  const names = {
    'backup': '시스템 백업',
    'maintenance': '유지보수 모드 전환',
    'cleanup': '캐시 정리',
    'security': '보안 스캔'
  };
  return names[action] || action;
}

// 대시보드 새로고침 (전역 함수)
function refreshDashboard() {
  showNotification('대시보드를 새로고침하고 있습니다...', 'info');
  logAdminActivity('dashboard_refresh', 'manual');

  // 통계 업데이트
  updateDashboardStats();

  // 차트 새로고침
  initChartAnimation();

  // 성능 메트릭 새로고침
  initPerformanceMetrics();

  // 마지막 업데이트 시간 갱신
  updateLastUpdateTime();

  setTimeout(() => {
    showNotification('대시보드가 새로고침되었습니다.', 'success');
  }, 2000);
}

// 리포트 내보내기 (전역 함수)
function exportReport() {
  showNotification('리포트를 생성하고 있습니다...', 'info');
  logAdminActivity('report_export', 'dashboard');

  // 실제 구현에서는 서버 API 호출
  setTimeout(() => {
    showNotification('리포트가 다운로드 폴더에 저장되었습니다.', 'success');
  }, 3000);
}

// 대시보드 통계 업데이트
function updateDashboardStats() {
  const stats = [
    { selector: '.stat-card:nth-child(1) .stat-value', value: Math.floor(Math.random() * 100) + 1200 },
    { selector: '.stat-card:nth-child(2) .stat-value', value: Math.floor(Math.random() * 100) + 800 },
    { selector: '.stat-card:nth-child(3) .stat-value', value: Math.floor(Math.random() * 200) + 300 },
    { selector: '.stat-card:nth-child(4) .stat-value', value: Math.floor(Math.random() * 20) + 70 }
  ];

  stats.forEach(stat => {
    const element = document.querySelector(stat.selector);
    if (element) {
      element.dataset.target = stat.value;
      animateStatValue(element);
    }
  });
}

// 마지막 업데이트 시간 갱신
function updateLastUpdateTime() {
  const timeElement = document.getElementById('lastUpdate');
  if (timeElement) {
    timeElement.textContent = '방금 전';
  }
}

// 실시간 업데이트 초기화
function initRealTimeUpdates() {
  // 30초마다 통계 업데이트
  setInterval(() => {
    updateDashboardStats();
    updateLastUpdateTime();
  }, 30000);

  // 1분마다 성능 메트릭 업데이트
  setInterval(() => {
    updatePerformanceMetrics();
  }, 60000);

  // 2분마다 새로운 알림 추가
  setInterval(() => {
    addRandomNotification();
  }, 120000);

  // 5분마다 활동 로그 업데이트
  setInterval(() => {
    updateActivityLog();
  }, 300000);
}

// 성능 메트릭 업데이트
function updatePerformanceMetrics() {
  const metrics = document.querySelectorAll('.metric-fill');

  metrics.forEach(metric => {
    const currentValue = parseInt(metric.dataset.value);
    const newValue = Math.max(10, Math.min(95, currentValue + (Math.random() - 0.5) * 20));

    metric.style.width = newValue + '%';
    metric.dataset.value = Math.floor(newValue);

    // 해당하는 값 텍스트 업데이트
    const valueElement = metric.closest('.metric-item').querySelector('.metric-value');
    if (valueElement) {
      valueElement.textContent = Math.floor(newValue) + '%';
    }
  });
}

// 랜덤 알림 추가
function addRandomNotification() {
  const notifications = [
    {
      icon: '⚠️',
      text: '서버 메모리 사용률이 85%를 초과했습니다',
      time: '방금 전',
      type: 'warning'
    },
    {
      icon: '👤',
      text: '새로운 회원이 가입했습니다: user789',
      time: '방금 전',
      type: 'info'
    },
    {
      icon: '🔒',
      text: '보안 스캔에서 이상 없음을 확인했습니다',
      time: '방금 전',
      type: 'success'
    },
    {
      icon: '📈',
      text: '동시 접속자 수가 증가하고 있습니다',
      time: '방금 전',
      type: 'info'
    },
    {
      icon: '🚨',
      text: '데이터베이스 연결 지연이 감지되었습니다',
      time: '방금 전',
      type: 'critical'
    }
  ];

  const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];

  // 알림 패널에 추가
  const notificationList = document.querySelector('.notification-list');
  if (notificationList) {
    const notificationHTML = `
      <div class="notification-item ${randomNotification.type} unread">
        <div class="notification-icon">${randomNotification.icon}</div>
        <div class="notification-content">
          <p>${randomNotification.text}</p>
          <span class="notification-time">${randomNotification.time}</span>
        </div>
      </div>
    `;

    notificationList.insertAdjacentHTML('afterbegin', notificationHTML);

    // 알림 배지 업데이트
    const badge = document.querySelector('.notification-badge');
    if (badge) {
      const currentCount = parseInt(badge.textContent) || 0;
      badge.textContent = currentCount + 1;
      badge.style.display = 'flex';
    }
  }

  // 토스트 알림 표시 (중요한 알림만)
  if (randomNotification.type === 'critical' || randomNotification.type === 'warning') {
    showNotification(randomNotification.text, randomNotification.type, 5000);
  }

  logAdminActivity('notification_received', randomNotification.type);
}

// 활동 로그 업데이트
function updateActivityLog() {
  const activities = [
    {
      icon: 'new-user',
      emoji: '👤',
      text: `새로운 사용자 <strong>user${Math.floor(Math.random() * 1000)}</strong>이 가입했습니다`,
      time: generateRandomTime(),
      status: 'success'
    },
    {
      icon: 'system',
      emoji: '🔧',
      text: '시스템 설정이 업데이트되었습니다',
      time: generateRandomTime(),
      status: 'success'
    },
    {
      icon: 'report',
      emoji: '📊',
      text: '시간별 리포트가 생성되었습니다',
      time: generateRandomTime(),
      status: 'success'
    },
    {
      icon: 'warning',
      emoji: '⚠️',
      text: 'CPU 사용률이 일시적으로 높아졌습니다',
      time: generateRandomTime(),
      status: 'warning'
    }
  ];

  const randomActivity = activities[Math.floor(Math.random() * activities.length)];
  const activityList = document.querySelector('.activity-list');

  if (activityList) {
    const activityHTML = `
      <div class="activity-item">
        <div class="activity-icon ${randomActivity.icon}">${randomActivity.emoji}</div>
        <div class="activity-content">
          <p class="activity-text">${randomActivity.text}</p>
          <span class="activity-time">${randomActivity.time}</span>
        </div>
        <div class="activity-status ${randomActivity.status}">${randomActivity.status === 'success' ? '완료' : '주의'}</div>
      </div>
    `;

    activityList.insertAdjacentHTML('afterbegin', activityHTML);

    // 최대 10개 항목만 유지
    const items = activityList.querySelectorAll('.activity-item');
    if (items.length > 10) {
      items[items.length - 1].remove();
    }
  }
}

// 랜덤 시간 생성
function generateRandomTime() {
  const minutes = Math.floor(Math.random() * 60) + 1;
  if (minutes < 60) {
    return `${minutes}분 전`;
  } else {
    const hours = Math.floor(minutes / 60);
    return `${hours}시간 전`;
  }
}

// 보안 기능 초기화
function initSecurityFeatures() {
  // 관리자 활동 로깅
  logAdminActivity('page_access', 'admin_dashboard');

  // 세션 타임아웃 모니터링
  initSessionMonitoring();

  // 보안 이벤트 감지
  initSecurityMonitoring();

  // 페이지 가시성 모니터링
  initVisibilityMonitoring();
}

// 관리자 활동 로깅
function logAdminActivity(action, target) {
  const logData = {
    timestamp: new Date().toISOString(),
    action: action,
    target: target,
    userAgent: navigator.userAgent,
    url: window.location.href,
    ip: 'hidden' // 서버에서 처리
  };

  console.log('관리자 활동:', logData);

  // 실제 구현시에는 서버로 로그 전송
  // fetch('/admin/activity-log', { method: 'POST', body: JSON.stringify(logData) })
}

// 세션 모니터링
function initSessionMonitoring() {
  let lastActivity = Date.now();
  const sessionTimeout = 30 * 60 * 1000; // 30분
  const warningTime = 25 * 60 * 1000; // 25분

  // 사용자 활동 감지
  ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'].forEach(event => {
    document.addEventListener(event, () => {
      lastActivity = Date.now();
    }, { passive: true });
  });

  // 세션 체크
  setInterval(() => {
    const timeSinceLastActivity = Date.now() - lastActivity;

    if (timeSinceLastActivity > warningTime && timeSinceLastActivity < sessionTimeout) {
      showNotification('세션이 5분 후 만료됩니다. 페이지를 새로고침하여 연장하세요.', 'warning', 10000);
    } else if (timeSinceLastActivity > sessionTimeout) {
      showNotification('세션이 만료되어 로그아웃됩니다.', 'error');
      logAdminActivity('session_timeout', 'auto_logout');
      setTimeout(() => {
        window.location.href = '/admin/login?timeout=true';
      }, 3000);
    }
  }, 60000); // 1분마다 체크
}

// 보안 모니터링
function initSecurityMonitoring() {
  // 개발자 도구 감지
  let devtools = false;

  setInterval(() => {
    const threshold = 160;
    if (window.outerHeight - window.innerHeight > threshold ||
        window.outerWidth - window.innerWidth > threshold) {
      if (!devtools) {
        devtools = true;
        logAdminActivity('security_warning', 'devtools_detected');
        showNotification('보안 경고: 개발자 도구 사용이 감지되었습니다.', 'warning');
      }
    } else {
      devtools = false;
    }
  }, 1000);

  // 비정상적인 브라우저 동작 감지
  let suspiciousActivity = 0;

  document.addEventListener('keydown', (e) => {
    // 특정 키 조합 감지
    if ((e.ctrlKey && e.shiftKey) || e.key === 'F12') {
      suspiciousActivity++;
      if (suspiciousActivity > 3) {
        logAdminActivity('security_alert', 'suspicious_keyboard_activity');
        showNotification('보안 경고: 비정상적인 키보드 활동이 감지되었습니다.', 'warning');
      }
    }
  });
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

      // 5분 이상 숨겨져 있었다면 데이터 새로고침
      if (hiddenDuration > 300000) {
        showNotification('페이지가 오랫동안 비활성 상태였습니다. 데이터를 새로고침합니다.', 'info');
        refreshDashboard();
      }

      logAdminActivity('page_visible', `hidden_for_${Math.floor(hiddenDuration/1000)}s`);
    }
  });
}

// 상세 보기 함수들 (전역)
function viewDetails(type) {
  logAdminActivity('view_details', type);

  switch(type) {
    case 'performance':
      showNotification('성능 상세 페이지로 이동합니다...', 'info');
      // 실제로는 성능 상세 페이지로 이동
      break;
    default:
      showNotification('상세 정보를 불러오는 중...', 'info');
  }
}

function viewAllActivities() {
  logAdminActivity('view_all_activities', 'activity_log');
  showNotification('전체 활동 로그 페이지로 이동합니다...', 'info');
  // 실제로는 전체 활동 로그 페이지로 이동
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
    max-width: 350px;
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

// 키보드 단축키
document.addEventListener('keydown', function(e) {
  // Ctrl/Cmd + R로 대시보드 새로고침
  if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
    e.preventDefault();
    refreshDashboard();
  }

  // ESC로 알림 패널 닫기
  if (e.key === 'Escape') {
    const notificationPanel = document.getElementById('notificationPanel');
    if (notificationPanel && notificationPanel.classList.contains('open')) {
      toggleNotifications();
    }
  }

  // F5로 강제 새로고침
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
  logAdminActivity('javascript_error', e.error.message);
  showNotification('시스템 오류가 발생했습니다. 페이지를 새로고침해주세요.', 'error');
});

// 네트워크 상태 모니터링
window.addEventListener('online', function() {
  showNotification('인터넷 연결이 복구되었습니다.', 'success');
  logAdminActivity('network_status', 'online');
});

window.addEventListener('offline', function() {
  showNotification('인터넷 연결이 끊어졌습니다.', 'warning');
  logAdminActivity('network_status', 'offline');
});

// 페이지 로드 완료 후 초기화
window.addEventListener('load', function() {
  console.log("관리자 대시보드 로드 및 최적화 완료");

  // 초기 데이터 로드
  setTimeout(() => {
    updateLastUpdateTime();
  }, 1000);

  // 환영 알림
  setTimeout(() => {
    showNotification('관리자 대시보드에 오신 것을 환영합니다! 🎛️', 'success', 4000);
  }, 2000);

  // 초기 성능 체크
  if (performance.timing) {
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    if (loadTime > 3000) {
      showNotification('페이지 로딩이 평소보다 느립니다. 성능을 확인해주세요.', 'warning');
    }
  }
});

console.log("관리자 대시보드 스크립트 초기화 완료");