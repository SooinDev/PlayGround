// 완성된 마이페이지 스크립트
console.log("마이페이지 로드 완료");

document.addEventListener('DOMContentLoaded', function() {
  // 모든 초기화 함수 호출
  initTabs();
  initTheme();
  initPasswordForm();
  initDeleteModal();
  initToggles();
  initFormValidation();

  // 서버에서 전달된 메시지 처리
  handleServerMessages();
});

// 서버 메시지 처리
function handleServerMessages() {
  const errorAlert = document.querySelector('.alert.error');
  const successAlert = document.querySelector('.alert.success');

  if (errorAlert) {
    const errorText = errorAlert.textContent.trim();
    if (errorText) {
      // 기술적 에러를 사용자 친화적으로 변환
      let friendlyMessage = errorText;
      if (errorText.includes('BindingException') || errorText.includes('nested exception')) {
        friendlyMessage = '시스템 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      } else if (errorText.includes('NullPointerException')) {
        friendlyMessage = '처리 중 오류가 발생했습니다. 입력 정보를 확인해주세요.';
      } else if (errorText.includes('7일')) {
        friendlyMessage = errorText; // 닉네임 변경 제한 메시지는 그대로 표시
      }

      showNotification(friendlyMessage, 'error', 8000);
    }
    errorAlert.style.display = 'none';
  }

  if (successAlert) {
    const successText = successAlert.textContent.trim();
    if (successText) {
      showNotification(successText, 'success', 4000);
    }
    successAlert.style.display = 'none';
  }
}

// 탭 기능
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;

      // 모든 탭 버튼 비활성화
      tabBtns.forEach(b => b.classList.remove('active'));
      // 클릭된 탭 활성화
      btn.classList.add('active');

      // 모든 탭 콘텐츠 숨기기
      tabContents.forEach(content => {
        content.classList.remove('active');
      });

      // 선택된 탭 콘텐츠 표시
      const targetTab = document.getElementById(tabId + '-tab');
      if (targetTab) {
        targetTab.classList.add('active');
      }
    });
  });
}

// 테마 설정
function initTheme() {
  const themeOptions = document.querySelectorAll('.theme-option');

  // 저장된 테마 로드
  const savedTheme = localStorage.getItem('theme') || 'light';
  applyTheme(savedTheme);

  // 해당 테마 옵션 활성화
  themeOptions.forEach(option => {
    if (option.dataset.theme === savedTheme) {
      option.classList.add('active');
    } else {
      option.classList.remove('active');
    }
  });

  // 테마 변경 이벤트
  themeOptions.forEach(option => {
    option.addEventListener('click', () => {
      const theme = option.dataset.theme;

      // 활성 상태 변경
      themeOptions.forEach(opt => opt.classList.remove('active'));
      option.classList.add('active');

      // 테마 적용
      applyTheme(theme);
      localStorage.setItem('theme', theme);

      showNotification(`${getThemeName(theme)} 테마가 적용되었습니다.`);
    });
  });
}

// 테마 적용
function applyTheme(theme) {
  const body = document.body;

  body.classList.remove('light', 'dark');

  if (theme === 'auto') {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      body.classList.add('dark');
    } else {
      body.classList.add('light');
    }
  } else {
    body.classList.add(theme);
  }
}

// 테마 이름 반환
function getThemeName(theme) {
  const names = {
    'light': '라이트',
    'dark': '다크',
    'auto': '자동'
  };
  return names[theme] || '라이트';
}

// 비밀번호 폼 토글
function togglePasswordForm() {
  const form = document.getElementById('passwordForm');
  if (form.style.display === 'none' || !form.style.display) {
    form.style.display = 'block';
    form.scrollIntoView({ behavior: 'smooth' });
  } else {
    form.style.display = 'none';
    const formElement = form.querySelector('form');
    if (formElement) {
      formElement.reset();
    }
  }
}

// 비밀번호 폼 초기화
function initPasswordForm() {
  const newPassword = document.getElementById('newPassword');
  const confirmPassword = document.getElementById('confirmPassword');

  if (confirmPassword && newPassword) {
    confirmPassword.addEventListener('input', function() {
      if (newPassword.value && this.value !== newPassword.value) {
        this.style.borderColor = '#ef4444';
        showFieldError(this, '비밀번호가 일치하지 않습니다.');
      } else {
        this.style.borderColor = '#22c55e';
        hideFieldError(this);
      }
    });
  }
}

// 삭제 모달 초기화
function initDeleteModal() {
  const deleteInput = document.getElementById('deleteConfirm');
  const confirmBtn = document.getElementById('confirmDeleteBtn');

  if (deleteInput && confirmBtn) {
    deleteInput.addEventListener('input', function() {
      if (this.value === 'DELETE') {
        confirmBtn.disabled = false;
      } else {
        confirmBtn.disabled = true;
      }
    });

    confirmBtn.addEventListener('click', function() {
      if (deleteInput.value === 'DELETE') {
        showNotification('계정 삭제가 진행됩니다...', 'warning');
        setTimeout(() => {
          window.location.href = '/member/delete';
        }, 2000);
      }
    });
  }
}

// 삭제 확인 모달 표시
function confirmDelete() {
  const modal = document.getElementById('deleteModal');
  if (modal) {
    modal.classList.add('show');

    const input = document.getElementById('deleteConfirm');
    if (input) {
      input.value = '';
      input.focus();
    }

    const btn = document.getElementById('confirmDeleteBtn');
    if (btn) {
      btn.disabled = true;
    }
  }
}

// 모달 닫기
function closeModal() {
  const modal = document.getElementById('deleteModal');
  if (modal) {
    modal.classList.remove('show');
  }
}

// 토글 스위치 초기화
function initToggles() {
  const toggles = document.querySelectorAll('.toggle input');

  toggles.forEach(toggle => {
    toggle.addEventListener('change', function() {
      const preferenceItem = this.closest('.preference-item');
      if (preferenceItem) {
        const label = preferenceItem.querySelector('span').textContent;
        const status = this.checked ? '활성화' : '비활성화';
        showNotification(`${label}이 ${status}되었습니다.`);
      }
    });
  });
}

// 폼 유효성 검사 초기화
function initFormValidation() {
  const form = document.querySelector('.profile-form');
  if (!form) return;

  const inputs = form.querySelectorAll('input[required]');

  inputs.forEach(input => {
    input.addEventListener('blur', function() {
      validateField(this);
    });

    if (input.type === 'email') {
      input.addEventListener('input', function() {
        validateEmail(this);
      });
    }
  });

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    console.log('폼 제출 시도');

    let isValid = true;
    inputs.forEach(input => {
      if (!validateField(input)) {
        isValid = false;
      }
    });

    if (!isValid) {
      showNotification('입력 정보를 확인해주세요.', 'error');
      return;
    }

    // 중복 제출 방지
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      if (submitBtn.disabled) {
        return; // 이미 제출 중
      }
      submitBtn.disabled = true;
      submitBtn.textContent = '저장 중...';
    }

    showNotification('프로필 업데이트 중...', 'info');

    // 실제 폼 제출
    setTimeout(() => {
      form.submit();
    }, 100);
  });
}

// 필드 유효성 검사
function validateField(input) {
  if (input.hasAttribute('required') && !input.value.trim()) {
    showFieldError(input, '필수 입력 항목입니다.');
    input.style.borderColor = '#ef4444';
    return false;
  }

  hideFieldError(input);
  input.style.borderColor = '#e5e7eb';
  return true;
}

// 이메일 유효성 검사
function validateEmail(input) {
  const email = input.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (email && !emailRegex.test(email)) {
    showFieldError(input, '올바른 이메일 형식을 입력해주세요.');
    input.style.borderColor = '#ef4444';
    return false;
  }

  hideFieldError(input);
  input.style.borderColor = '#e5e7eb';
  return true;
}

// 필드 오류 표시
function showFieldError(input, message) {
  hideFieldError(input);

  const errorEl = document.createElement('div');
  errorEl.className = 'field-error';
  errorEl.textContent = message;
  errorEl.style.cssText = `
    color: #ef4444;
    font-size: 0.875rem;
    margin-top: 0.25rem;
  `;

  input.parentNode.appendChild(errorEl);
}

// 필드 오류 숨기기
function hideFieldError(input) {
  const errorEl = input.parentNode.querySelector('.field-error');
  if (errorEl) {
    errorEl.remove();
  }
}

// 폼 리셋
function resetForm() {
  const form = document.querySelector('.profile-form');
  if (!form) return;

  form.reset();

  // 모든 오류 메시지 제거
  const errors = form.querySelectorAll('.field-error');
  errors.forEach(error => error.remove());

  // 필드 스타일 초기화
  const inputs = form.querySelectorAll('input');
  inputs.forEach(input => {
    input.style.borderColor = '#e5e7eb';
  });

  // 제출 버튼 상태 복구
  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.textContent = '저장하기';
  }

  showNotification('변경사항이 취소되었습니다.');
}

// 개선된 알림 표시
function showNotification(message, type = 'success', duration = 5000) {
  // 기존 알림 제거
  const existing = document.querySelector('.notification');
  if (existing) {
    existing.remove();
  }

  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-icon">${getNotificationIcon(type)}</span>
      <span class="notification-text">${message}</span>
      <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
  `;

  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    max-width: 400px;
    word-wrap: break-word;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(10px);
  `;

  // 타입별 스타일
  switch(type) {
    case 'success':
      notification.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      notification.style.color = 'white';
      break;
    case 'error':
      notification.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
      notification.style.color = 'white';
      break;
    case 'warning':
      notification.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
      notification.style.color = 'white';
      break;
    case 'info':
      notification.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)';
      notification.style.color = 'white';
      break;
    default:
      notification.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)';
      notification.style.color = 'white';
  }

  // 알림 내용 스타일
  const content = notification.querySelector('.notification-content');
  content.style.cssText = `
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
  `;

  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.style.cssText = `
    background: none;
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;
    padding: 0;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background 0.2s;
  `;

  closeBtn.addEventListener('mouseenter', function() {
    this.style.background = 'rgba(255, 255, 255, 0.2)';
  });

  closeBtn.addEventListener('mouseleave', function() {
    this.style.background = 'none';
  });

  document.body.appendChild(notification);

  // 슬라이드 인 애니메이션
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);

  // 자동 제거 (에러의 경우 더 오래 표시)
  const autoRemoveTime = type === 'error' ? duration * 2 : duration;
  setTimeout(() => {
    if (document.body.contains(notification)) {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }
  }, autoRemoveTime);
}

// 알림 아이콘 반환
function getNotificationIcon(type) {
  switch(type) {
    case 'success': return '✓';
    case 'error': return '⚠';
    case 'warning': return '⚡';
    case 'info': return 'ℹ';
    default: return 'ℹ';
  }
}

// 페이지 로드 완료 후 버튼 상태 복구
window.addEventListener('pageshow', function() {
  const submitBtn = document.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.textContent = '저장하기';
  }
});

// 키보드 이벤트
document.addEventListener('keydown', function(e) {
  // ESC로 모달 닫기
  if (e.key === 'Escape') {
    closeModal();
  }
});

// 모달 외부 클릭시 닫기
document.addEventListener('click', function(e) {
  const modal = document.getElementById('deleteModal');
  if (modal && modal.classList.contains('show') && e.target === modal) {
    closeModal();
  }
});

// 로그아웃 확인
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('logout')) {
    e.preventDefault();
    if (confirm('정말 로그아웃하시겠습니까?')) {
      showNotification('로그아웃 중...');
      setTimeout(() => {
        window.location.href = e.target.href;
      }, 1000);
    }
  }
});

// 시스템 테마 변경 감지
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function() {
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme === 'auto') {
    applyTheme('auto');
  }
});

// 전역 에러 처리
window.addEventListener('error', function(e) {
  console.error('전역 에러:', e.error);
  showNotification('예상치 못한 오류가 발생했습니다. 페이지를 새로고침해주세요.', 'error');
});

console.log("마이페이지 초기화 완료");