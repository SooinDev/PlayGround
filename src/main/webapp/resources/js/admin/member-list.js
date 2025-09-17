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

  // 회원 상태 관리 기능
  initMemberStatusManagement();
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

// 회원 상태 관리 기능 초기화
function initMemberStatusManagement() {
  // 모든 상태 셀렉트 박스에 이벤트 리스너 추가
  const statusSelects = document.querySelectorAll('.status-select');
  statusSelects.forEach(select => {
    select.addEventListener('change', function(e) {
      const memberId = this.dataset.memberId;
      const newStatus = this.value;
      const oldStatus = this.dataset.originalStatus;

      // 상태 변경 확인
      confirmStatusChange(memberId, oldStatus, newStatus, this);
    });
  });

  // 일괄 상태 변경 기능
  initBulkStatusChange();
}

// 일괄 상태 변경 기능 초기화
function initBulkStatusChange() {
  // 전체 선택 체크박스
  const selectAllCheckbox = document.getElementById('selectAll');
  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener('change', function() {
      const memberCheckboxes = document.querySelectorAll('.member-checkbox');
      memberCheckboxes.forEach(checkbox => {
        checkbox.checked = this.checked;
      });
      updateBulkActionButtons();
    });
  }

  // 개별 체크박스
  const memberCheckboxes = document.querySelectorAll('.member-checkbox');
  memberCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      updateBulkActionButtons();
      updateSelectAllCheckbox();
    });
  });
}

// 상태 변경 확인 다이얼로그
function confirmStatusChange(memberId, oldStatus, newStatus, selectElement) {
  const statusNames = {
    'ACTIVE': '활성',
    'INACTIVE': '비활성',
    'SUSPENDED': '정지'
  };

  const memberRow = document.querySelector(`[data-member-id="${memberId}"]`);
  const memberName = memberRow ? memberRow.querySelector('.member-name')?.textContent : `ID ${memberId}`;

  const confirmMessage = `회원 "${memberName}"의 상태를 "${statusNames[oldStatus]}"에서 "${statusNames[newStatus]}"로 변경하시겠습니까?`;

  if (confirm(confirmMessage)) {
    changeMemberStatus(memberId, newStatus, selectElement);
  } else {
    // 취소 시 원래 값으로 복원
    selectElement.value = oldStatus;
  }
}

// 회원 상태 변경 실행
function changeMemberStatus(memberId, newStatus, selectElement) {
  // 로딩 상태 표시
  const originalColor = selectElement.style.backgroundColor;
  selectElement.disabled = true;
  selectElement.style.backgroundColor = '#374151';

  showNotification(`회원 상태를 변경하는 중...`, 'info');

  // 실제 구현에서는 서버 API 호출
  const statusData = {
    memberId: memberId,
    status: newStatus,
    changedBy: 'admin', // 실제로는 현재 로그인한 관리자 ID
    timestamp: new Date().toISOString()
  };

  // 서버 요청 시뮬레이션
  setTimeout(() => {
    fetch(`/admin/members/${memberId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify(statusData)
    })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          if (data.success) {
            // 성공 시 UI 업데이트
            updateMemberStatusUI(memberId, newStatus, selectElement);
            showNotification(`회원 상태가 성공적으로 변경되었습니다.`, 'success');
            logAdminActivity('member_status_change', `${memberId}:${newStatus}`);
          } else {
            throw new Error(data.message || '상태 변경 실패');
          }
        })
        .catch(error => {
          console.error('상태 변경 오류:', error);
          showNotification(`상태 변경 중 오류가 발생했습니다: ${error.message}`, 'error');

          // 오류 시 원래 값으로 복원
          selectElement.value = selectElement.dataset.originalStatus;
        })
        .finally(() => {
          // 로딩 상태 해제
          selectElement.disabled = false;
          selectElement.style.backgroundColor = originalColor;
        });
  }, 1000); // 실제 구현에서는 이 setTimeout 제거
}

// 회원 상태 UI 업데이트
function updateMemberStatusUI(memberId, newStatus, selectElement) {
  // 원본 상태 업데이트
  selectElement.dataset.originalStatus = newStatus;

  // 상태에 따른 스타일 적용
  const statusColors = {
    'ACTIVE': '#10b981',
    'INACTIVE': '#6b7280',
    'SUSPENDED': '#ef4444'
  };

  selectElement.style.color = statusColors[newStatus];
  selectElement.style.borderColor = statusColors[newStatus];

  // 회원 행에 상태 클래스 업데이트
  const memberRow = document.querySelector(`[data-member-id="${memberId}"]`);
  if (memberRow) {
    memberRow.classList.remove('status-active', 'status-inactive', 'status-suspended');
    memberRow.classList.add(`status-${newStatus.toLowerCase()}`);
  }
}

// 일괄 상태 변경
function bulkChangeStatus(newStatus) {
  const selectedMembers = getSelectedMembers();

  if (selectedMembers.length === 0) {
    showNotification('변경할 회원을 선택해주세요.', 'warning');
    return;
  }

  const statusNames = {
    'ACTIVE': '활성',
    'INACTIVE': '비활성',
    'SUSPENDED': '정지'
  };

  const confirmMessage = `선택된 ${selectedMembers.length}명의 회원 상태를 "${statusNames[newStatus]}"로 변경하시겠습니까?`;

  if (!confirm(confirmMessage)) {
    return;
  }

  showNotification(`${selectedMembers.length}명의 회원 상태를 변경하는 중...`, 'info');

  // 일괄 변경 요청
  const bulkData = {
    memberIds: selectedMembers,
    status: newStatus,
    changedBy: 'admin',
    timestamp: new Date().toISOString()
  };

  fetch('/admin/members/bulk-status', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    body: JSON.stringify(bulkData)
  })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // 각 선택된 회원의 상태 UI 업데이트
          selectedMembers.forEach(memberId => {
            const selectElement = document.querySelector(`[data-member-id="${memberId}"] .status-select`);
            if (selectElement) {
              selectElement.value = newStatus;
              updateMemberStatusUI(memberId, newStatus, selectElement);
            }
          });

          showNotification(`${selectedMembers.length}명의 회원 상태가 성공적으로 변경되었습니다.`, 'success');
          logAdminActivity('bulk_status_change', `${selectedMembers.length}:${newStatus}`);

          // 선택 해제
          clearMemberSelection();
        } else {
          throw new Error(data.message || '일괄 상태 변경 실패');
        }
      })
      .catch(error => {
        console.error('일괄 상태 변경 오류:', error);
        showNotification(`일괄 상태 변경 중 오류가 발생했습니다: ${error.message}`, 'error');
      });
}

// 선택된 회원 ID 목록 반환
function getSelectedMembers() {
  const selectedCheckboxes = document.querySelectorAll('.member-checkbox:checked');
  return Array.from(selectedCheckboxes).map(checkbox => checkbox.dataset.memberId);
}

// 회원 선택 해제
function clearMemberSelection() {
  const checkboxes = document.querySelectorAll('.member-checkbox, #selectAll');
  checkboxes.forEach(checkbox => {
    checkbox.checked = false;
  });
  updateBulkActionButtons();
}

// 일괄 작업 버튼 업데이트
function updateBulkActionButtons() {
  const selectedCount = getSelectedMembers().length;
  const bulkActions = document.querySelector('.bulk-actions');

  if (bulkActions) {
    if (selectedCount > 0) {
      bulkActions.style.display = 'flex';
      bulkActions.querySelector('.selected-count').textContent = `${selectedCount}명 선택됨`;
    } else {
      bulkActions.style.display = 'none';
    }
  }
}

// 전체 선택 체크박스 업데이트
function updateSelectAllCheckbox() {
  const selectAllCheckbox = document.getElementById('selectAll');
  const memberCheckboxes = document.querySelectorAll('.member-checkbox');
  const checkedCount = document.querySelectorAll('.member-checkbox:checked').length;

  if (selectAllCheckbox) {
    selectAllCheckbox.checked = checkedCount === memberCheckboxes.length && memberCheckboxes.length > 0;
    selectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < memberCheckboxes.length;
  }
}

// 상태별 필터링
function filterByStatus(status) {
  const rows = document.querySelectorAll('.member-row');
  let visibleCount = 0;

  rows.forEach(row => {
    const statusSelect = row.querySelector('.status-select');
    const memberStatus = statusSelect ? statusSelect.value : '';

    if (status === 'all' || memberStatus === status) {
      row.style.display = '';
      visibleCount++;
    } else {
      row.style.display = 'none';
    }
  });

  updateTableInfo(visibleCount);

  // 필터 버튼 활성화 상태 업데이트
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.status === status) {
      btn.classList.add('active');
    }
  });

  showNotification(`${visibleCount}명의 회원이 필터링되었습니다.`, 'info');
  logAdminActivity('status_filter', status);
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
  const status = memberRow.querySelector('.status-select')?.value || '';

  const statusNames = {
    'ACTIVE': '활성',
    'INACTIVE': '비활성',
    'SUSPENDED': '정지'
  };

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
          <div class="detail-item">
            <span class="detail-label">상태</span>
            <span class="detail-value status-badge status-${status.toLowerCase()}">${statusNames[status] || status}</span>
          </div>
        </div>
      </div>
      <div class="detail-section">
        <h4 class="detail-title">상태 변경</h4>
        <div class="status-change-section">
          <select class="modal-status-select" data-member-id="${memberId}">
            <option value="ACTIVE" ${status === 'ACTIVE' ? 'selected' : ''}>활성</option>
            <option value="INACTIVE" ${status === 'INACTIVE' ? 'selected' : ''}>비활성</option>
            <option value="SUSPENDED" ${status === 'SUSPENDED' ? 'selected' : ''}>정지</option>
          </select>
          <button type="button" class="btn-change-status" onclick="changeStatusFromModal(${memberId})">
            상태 변경
          </button>
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
    .status-badge {
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
    }
    .status-badge.status-active { background: #10b981; color: white; }
    .status-badge.status-inactive { background: #6b7280; color: white; }
    .status-badge.status-suspended { background: #ef4444; color: white; }
    .status-change-section {
      display: flex;
      gap: 12px;
      align-items: center;
    }
    .modal-status-select {
      padding: 8px 12px;
      border: 1px solid #374151;
      background: #1f2937;
      color: #f9fafb;
      border-radius: 6px;
      font-size: 14px;
    }
    .btn-change-status {
      padding: 8px 16px;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
    }
    .btn-change-status:hover {
      background: #2563eb;
    }
  `;

  if (!document.getElementById('modal-styles')) {
    style.id = 'modal-styles';
    document.head.appendChild(style);
  }

  modal.classList.add('active');
  logAdminActivity('member_view', memberId.toString());
}

// 모달에서 상태 변경
function changeStatusFromModal(memberId) {
  const modalSelect = document.querySelector('.modal-status-select');
  const newStatus = modalSelect.value;
  const tableSelect = document.querySelector(`[data-member-id="${memberId}"] .status-select`);

  if (tableSelect && tableSelect.value !== newStatus) {
    changeMemberStatus(memberId, newStatus, tableSelect);

    // 모달 닫기
    setTimeout(() => {
      closeMemberModal();
    }, 1500);
  } else {
    showNotification('동일한 상태입니다.', 'info');
  }
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

// 전역 함수들 (HTML에서 직접 호출 가능)
window.toggleSearchPanel = toggleSearchPanel;
window.refreshMemberList = refreshMemberList;
window.performSearch = performSearch;
window.resetSearch = resetSearch;
window.viewMember = viewMember;
window.editMember = editMember;
window.deleteMember = deleteMember;
window.closeMemberModal = closeMemberModal;
window.bulkChangeStatus = bulkChangeStatus;
window.filterByStatus = filterByStatus;
window.changeStatusFromModal = changeStatusFromModal;