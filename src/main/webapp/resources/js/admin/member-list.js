// 회원 목록 페이지 JavaScript
console.log("회원 목록 페이지 스크립트 로드 완료.");

document.addEventListener('DOMContentLoaded', function() {
  // 초기화
  initMemberList();

  // 네비게이션 기능
  initNavigation();

  // 테이블 인터랙션
  initTableInteractions();

  // 검색 기능
  initSearchPanel();

  // 모달 기능
  initModal();
});

// 회원 목록 초기화
function initMemberList() {
  console.log("회원 목록 초기화 완료");

  // 페이지 로드 시 활동 로깅
  logAdminActivity('member_list_access', 'page_load');

  // 테이블 행 수 표시
  updateTableInfo();
}

// 네비게이션 초기화
function initNavigation() {
  // 로그아웃 확인
  const logoutBtn = document.querySelector('.nav-btn-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (confirm('정말 로그아웃하시겠습니까?')) {
        logAdminActivity('logout', 'member_list_page');
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

// 테이블 인터랙션 초기화
function initTableInteractions() {
  // 테이블 행 호버 효과
  const memberRows = document.querySelectorAll('.member-row');
  memberRows.forEach(row => {
    row.addEventListener('mouseenter', function() {
      this.style.transform = 'translateX(4px)';
    });

    row.addEventListener('mouseleave', function() {
      this.style.transform = 'translateX(0)';
    });
  });
}

// 검색 패널 초기화
function initSearchPanel() {
  // 검색 패널 토글 시 포커스
  const searchKeyword = document.getElementById('searchKeyword');
  if (searchKeyword) {
    searchKeyword.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        performSearch();
      }
    });
  }
}

// 모달 초기화
function initModal() {
  const modal = document.getElementById('memberModal');
  if (modal) {
    // 모달 외부 클릭 시 닫기
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeMemberModal();
      }
    });

    // ESC 키로 모달 닫기
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeMemberModal();
      }
    });
  }
}

// 검색 패널 토글 (전역 함수)
function toggleSearchPanel() {
  const searchPanel = document.getElementById('searchPanel');
  const searchBtn = document.querySelector('.search-btn');

  if (searchPanel.classList.contains('active')) {
    searchPanel.classList.remove('active');
    searchBtn.textContent = '검색';
    searchBtn.prepend(document.createElement('span')).className = 'btn-icon';
    searchBtn.firstChild.textContent = '🔍';
  } else {
    searchPanel.classList.add('active');
    searchBtn.textContent = '닫기';
    searchBtn.prepend(document.createElement('span')).className = 'btn-icon';
    searchBtn.firstChild.textContent = '✖️';

    // 검색 입력 필드에 포커스
    setTimeout(() => {
      const searchInput = document.getElementById('searchKeyword');
      if (searchInput) searchInput.focus();
    }, 300);
  }

  logAdminActivity('search_panel_toggle', searchPanel.classList.contains('active') ? 'opened' : 'closed');
}

// 회원 목록 새로고침 (전역 함수)
function refreshMemberList() {
  const refreshBtn = document.querySelector('.refresh-btn');

  if (refreshBtn) {
    refreshBtn.style.opacity = '0.6';
    refreshBtn.disabled = true;

    // 새로고침 애니메이션
    const icon = refreshBtn.querySelector('.btn-icon');
    if (icon) {
      icon.style.animation = 'spin 1s linear infinite';
    }

    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }

  logAdminActivity('member_list_refresh', 'manual');
}

// 검색 실행 (전역 함수)
function performSearch() {
  const searchType = document.getElementById('searchType').value;
  const searchKeyword = document.getElementById('searchKeyword').value.trim();

  if (!searchKeyword) {
    showNotification('검색어를 입력해주세요.', 'warning');
    return;
  }

  // 실제 구현에서는 서버로 검색 요청 전송
  showNotification(`"${searchKeyword}" 검색 중...`, 'info');
  logAdminActivity('member_search', `${searchType}:${searchKeyword}`);

  // 임시: 현재 페이지에서 간단한 검색 시뮬레이션
  setTimeout(() => {
    const rows = document.querySelectorAll('.member-row');
    let foundCount = 0;

    rows.forEach(row => {
      const nickname = row.querySelector('.member-name')?.textContent || '';
      const email = row.querySelector('.member-email')?.textContent || '';

      let shouldShow = false;

      switch(searchType) {
        case 'nickname':
          shouldShow = nickname.toLowerCase().includes(searchKeyword.toLowerCase());
          break;
        case 'email':
          shouldShow = email.toLowerCase().includes(searchKeyword.toLowerCase());
          break;
        case 'all':
        default:
          shouldShow = nickname.toLowerCase().includes(searchKeyword.toLowerCase()) ||
              email.toLowerCase().includes(searchKeyword.toLowerCase());
          break;
      }

      if (shouldShow) {
        row.style.display = '';
        foundCount++;
      } else {
        row.style.display = 'none';
      }
    });

    showNotification(`${foundCount}명의 회원을 찾았습니다.`, 'success');
    updateTableInfo(foundCount);
  }, 500);
}

// 검색 초기화 (전역 함수)
function resetSearch() {
  document.getElementById('searchType').value = 'all';
  document.getElementById('searchKeyword').value = '';

  // 모든 행 표시
  document.querySelectorAll('.member-row').forEach(row => {
    row.style.display = '';
  });

  updateTableInfo();
  showNotification('검색 조건이 초기화되었습니다.', 'info');
  logAdminActivity('member_search_reset', 'manual');
}

// 회원 상세보기 (전역 함수)
function viewMember(memberId) {
  const modal = document.getElementById('memberModal');
  const modalBody = document.getElementById('modalBody');

  // 회원 정보 가져오기 (실제로는 AJAX 요청)
  const memberRow = document.querySelector(`[data-member-id="${memberId}"]`);
  if (!memberRow) return;

  const nickname = memberRow.querySelector('.member-name')?.textContent || '';
  const email = memberRow.querySelector('.member-email')?.textContent || '';
  const regDate = memberRow.querySelector('.td-date')?.textContent || '';

  modalBody.innerHTML = `
    <div class="member-detail">
      <div class="detail-section">
        <h4 class="detail-title">기본 정보</h4>
        <div class="detail-grid">
          <div class="detail-item">
            <span class="detail-label">회원 ID</span>
            <span class="detail-value">${memberId}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">닉네임</span>
            <span class="detail-value">${nickname}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">이메일</span>
            <span class="detail-value">${email}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">가입일</span>
            <span class="detail-value">${regDate}</span>
          </div>
        </div>
      </div>
    </div>
  `;

  // 모달 스타일 추가
  const style = document.createElement('style');
  style.textContent = `
    .member-detail { font-family: inherit; }
    .detail-section { margin-bottom: 24px; }
    .detail-title { 
      font-size: 16px; 
      font-weight: 600; 
      color: #f1f5f9; 
      margin-bottom: 16px; 
      border-bottom: 1px solid rgba(255,255,255,0.1); 
      padding-bottom: 8px; 
    }
    .detail-grid { 
      display: grid; 
      gap: 12px; 
    }
    .detail-item { 
      display: flex; 
      justify-content: space-between; 
      padding: 8px 0; 
    }
    .detail-label { 
      font-size: 14px; 
      color: #94a3b8; 
      font-weight: 500; 
    }
    .detail-value { 
      font-size: 14px; 
      color: #e2e8f0; 
      font-weight: 500; 
    }
  `;

  if (!document.getElementById('modal-styles')) {
    style.id = 'modal-styles';
    document.head.appendChild(style);
  }

  modal.classList.add('active');
  logAdminActivity('member_view', memberId.toString());
}

// 회원 편집 (전역 함수)
function editMember(memberId) {
  showNotification(`회원 ID ${memberId} 편집 기능은 준비 중입니다.`, 'info');
  logAdminActivity('member_edit_attempt', memberId.toString());
}

// 회원 삭제 (전역 함수)
function deleteMember(memberId) {
  if (confirm(`정말로 회원 ID ${memberId}를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) {
    showNotification('회원 삭제 기능은 준비 중입니다.', 'warning');
    logAdminActivity('member_delete_attempt', memberId.toString());
  }
}

// 모달 닫기 (전역 함수)
function closeMemberModal() {
  const modal = document.getElementById('memberModal');
  modal.classList.remove('active');
  logAdminActivity('member_modal_close', 'manual');
}

// 테이블 정보 업데이트
function updateTableInfo(visibleCount = null) {
  const tableInfo = document.querySelector('.table-info');
  if (tableInfo) {
    const totalRows = document.querySelectorAll('.member-row').length;
    const displayCount = visibleCount !== null ? visibleCount : totalRows;

    tableInfo.innerHTML = `총 <span class="highlight">${displayCount}</span>명의 회원이 표시됩니다.`;
  }
}

// 알림 메시지 표시
function showNotification(message, type = 'info', duration = 4000) {
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

// 관리자 활동 로깅
function logAdminActivity(action, target) {
  const logData = {
    timestamp: new Date().toISOString(),
    action: action,
    target: target,
    userAgent: navigator.userAgent,
    url: window.location.href,
    page: 'member_list'
  };

  console.log('관리자 활동:', logData);

  // 실제 구현시에는 서버로 로그 전송
  // fetch('/admin/activity-log', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(logData)
  // });
}

// 스핀 애니메이션 CSS 동적 추가
const spinStyle = document.createElement('style');
spinStyle.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(spinStyle);

// 페이지 언로드 시 활동 로깅
window.addEventListener('beforeunload', function() {
  logAdminActivity('page_unload', 'member_list');
});

// 네트워크 상태 모니터링
window.addEventListener('online', function() {
  showNotification('인터넷 연결이 복구되었습니다.', 'success');
});

window.addEventListener('offline', function() {
  showNotification('인터넷 연결이 끊어졌습니다.', 'warning');
});

console.log("회원 목록 페이지 스크립트 초기화 완료");