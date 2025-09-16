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
  initPhoneFormatting();

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

// 비밀번호 폼 초기화 함수
function initPasswordForm() {
  const newPassword = document.getElementById('newPassword');
  const confirmPassword = document.getElementById('confirmPassword');
  const currentPassword = document.getElementById('currentPassword');

  // 새 비밀번호 입력 시 강도 검사 및 실시간 유효성 검사
  if (newPassword) {
    // 비밀번호 강도 표시 요소 생성
    const strengthContainer = createPasswordStrengthIndicator();
    newPassword.parentNode.appendChild(strengthContainer);

    newPassword.addEventListener('input', function() {
      const password = this.value;

      if (password.length > 0) {
        strengthContainer.style.display = 'block';
        updatePasswordStrength(password, strengthContainer);
        validateNewPasswordStrength(this);
      } else {
        strengthContainer.style.display = 'none';
        this.style.borderColor = '#e5e7eb';
        this.setCustomValidity('');
      }

      // 비밀번호 확인란이 비어있지 않으면 다시 검사
      if (confirmPassword && confirmPassword.value) {
        validatePasswordMatch();
      }
    });

    // 비밀번호 보기/숨기기 토글 추가
    addPasswordToggle(newPassword);
  }

  // 비밀번호 확인 실시간 검사
  if (confirmPassword && newPassword) {
    confirmPassword.addEventListener('input', function() {
      validatePasswordMatch();
    });

    // 비밀번호 확인란에도 토글 추가
    addPasswordToggle(confirmPassword);
  }

  // 현재 비밀번호에도 토글 추가
  if (currentPassword) {
    addPasswordToggle(currentPassword);
  }

  // 폼 제출 시 최종 검증
  const passwordForm = document.querySelector('#passwordForm form');
  if (passwordForm) {
    passwordForm.addEventListener('submit', function(e) {
      if (!validatePasswordForm()) {
        e.preventDefault();
        showNotification('비밀번호 입력 정보를 확인해주세요.', 'error');
      }
    });
  }
}

// 비밀번호 강도 표시기 생성
function createPasswordStrengthIndicator() {
  const container = document.createElement('div');
  container.className = 'password-strength';
  container.style.cssText = `
    margin-top: 8px;
    display: none;
  `;

  container.innerHTML = `
    <div class="strength-bar" style="
      width: 100%;
      height: 4px;
      background: #e5e7eb;
      border-radius: 2px;
      overflow: hidden;
      margin-bottom: 4px;
    ">
      <div class="strength-fill" style="
        height: 100%;
        width: 0%;
        border-radius: 2px;
        transition: all 0.3s ease;
      "></div>
    </div>
    <div class="strength-text" style="
      font-size: 12px;
      color: #6b7280;
    ">비밀번호 강도</div>
  `;

  return container;
}

// 비밀번호 강도 업데이트
function updatePasswordStrength(password, container) {
  const strengthFill = container.querySelector('.strength-fill');
  const strengthText = container.querySelector('.strength-text');

  if (!strengthFill || !strengthText) return;

  let score = 0;
  let feedback = '';

  // 길이 검사
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;

  // 문자 종류 검사
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  // 강도 분류 및 스타일 적용
  strengthFill.className = 'strength-fill';

  if (score <= 2) {
    strengthFill.style.width = '25%';
    strengthFill.style.background = '#ef4444';
    feedback = '약함 - 더 강한 비밀번호를 사용하세요';
  } else if (score <= 3) {
    strengthFill.style.width = '50%';
    strengthFill.style.background = '#f59e0b';
    feedback = '보통 - 특수문자를 추가해보세요';
  } else if (score <= 4) {
    strengthFill.style.width = '75%';
    strengthFill.style.background = '#3b82f6';
    feedback = '좋음 - 안전한 비밀번호입니다';
  } else {
    strengthFill.style.width = '100%';
    strengthFill.style.background = '#10b981';
    feedback = '매우 강함 - 훌륭한 비밀번호입니다';
  }

  strengthText.textContent = feedback;
}

// 새 비밀번호 강도 유효성 검사
function validateNewPasswordStrength(input) {
  const password = input.value;

  if (password.length < 8) {
    input.style.borderColor = '#ef4444';
    input.setCustomValidity('비밀번호는 최소 8자 이상이어야 합니다.');
    return false;
  }

  if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
    input.style.borderColor = '#f59e0b';
    input.setCustomValidity('비밀번호는 영문자와 숫자를 포함해야 합니다.');
    return false;
  }

  input.style.borderColor = '#10b981';
  input.setCustomValidity('');
  return true;
}

// 비밀번호 확인 검사 (기존 함수 개선)
function validatePasswordMatch() {
  const newPassword = document.getElementById('newPassword');
  const confirmPassword = document.getElementById('confirmPassword');

  if (!newPassword || !confirmPassword) return false;

  const password = newPassword.value;
  const confirmPass = confirmPassword.value;

  if (confirmPass && password !== confirmPass) {
    confirmPassword.style.borderColor = '#ef4444';
    confirmPassword.setCustomValidity('비밀번호가 일치하지 않습니다.');
    showFieldError(confirmPassword, '비밀번호가 일치하지 않습니다.');
    return false;
  } else if (confirmPass && password === confirmPass) {
    confirmPassword.style.borderColor = '#10b981';
    confirmPassword.setCustomValidity('');
    hideFieldError(confirmPassword);
    return true;
  } else {
    confirmPassword.style.borderColor = '#e5e7eb';
    confirmPassword.setCustomValidity('');
    hideFieldError(confirmPassword);
    return true;
  }
}

// 비밀번호 토글 기능 추가
function addPasswordToggle(passwordInput) {
  // 이미 토글이 있는지 확인
  if (passwordInput.parentNode.querySelector('.password-toggle')) {
    return;
  }

  // 부모 요소를 relative로 설정
  passwordInput.parentNode.style.position = 'relative';

  // 토글 버튼 생성
  const toggleBtn = document.createElement('button');
  toggleBtn.type = 'button';
  toggleBtn.className = 'password-toggle';
  toggleBtn.innerHTML = '<span class="toggle-icon">👁</span>';
  toggleBtn.style.cssText = `
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    opacity: 0.6;
    transition: opacity 0.3s ease;
    z-index: 10;
  `;

  toggleBtn.addEventListener('mouseenter', function() {
    this.style.opacity = '1';
  });

  toggleBtn.addEventListener('mouseleave', function() {
    this.style.opacity = '0.6';
  });

  toggleBtn.addEventListener('click', function() {
    const isPassword = passwordInput.type === 'password';
    const icon = this.querySelector('.toggle-icon');

    passwordInput.type = isPassword ? 'text' : 'password';
    icon.textContent = isPassword ? '🙈' : '👁';

    // 포커스 유지
    passwordInput.focus();
    const length = passwordInput.value.length;
    passwordInput.setSelectionRange(length, length);
  });

  passwordInput.parentNode.appendChild(toggleBtn);

  // 인풋에 패딩 추가
  passwordInput.style.paddingRight = '48px';
}

// 비밀번호 폼 전체 유효성 검사
function validatePasswordForm() {
  const currentPassword = document.getElementById('currentPassword');
  const newPassword = document.getElementById('newPassword');
  const confirmPassword = document.getElementById('confirmPassword');

  let isValid = true;

  // 현재 비밀번호 확인
  if (!currentPassword || !currentPassword.value.trim()) {
    if (currentPassword) {
      currentPassword.style.borderColor = '#ef4444';
      showFieldError(currentPassword, '현재 비밀번호를 입력해주세요.');
    }
    isValid = false;
  }

  // 새 비밀번호 강도 검사
  if (!newPassword || !validateNewPasswordStrength(newPassword)) {
    isValid = false;
  }

  // 비밀번호 확인 검사
  if (!validatePasswordMatch()) {
    isValid = false;
  }

  return isValid;
}

// 비밀번호 변경 성공 시 폼 리셋
function resetPasswordForm() {
  const passwordForm = document.querySelector('#passwordForm form');
  if (passwordForm) {
    passwordForm.reset();

    // 모든 필드 스타일 초기화
    const inputs = passwordForm.querySelectorAll('input[type="password"]');
    inputs.forEach(input => {
      input.style.borderColor = '#e5e7eb';
      input.setCustomValidity('');
      hideFieldError(input);
    });

    // 강도 표시기 숨기기
    const strengthContainer = passwordForm.querySelector('.password-strength');
    if (strengthContainer) {
      strengthContainer.style.display = 'none';
    }
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

// 전화번호 포맷팅 기능 초기화
function initPhoneFormatting() {
  const phoneInput = document.getElementById('phone');
  const countrySelect = document.getElementById('countrySelect');
  const phoneValidation = document.getElementById('phoneValidation');

  if (!phoneInput || !countrySelect) return;

  // 기존 전화번호에서 국가 코드 감지
  detectCountryFromPhone();

  // 국가 변경 시 포맷 업데이트
  countrySelect.addEventListener('change', function() {
    const selectedOption = this.options[this.selectedIndex];
    const format = selectedOption.getAttribute('data-format');
    const countryCode = selectedOption.getAttribute('data-code');

    phoneInput.placeholder = getPlaceholderFromFormat(format);
    phoneInput.value = ''; // 국가 변경 시 기존 번호 초기화
    phoneValidation.textContent = `${countryCode} 형식으로 입력해주세요`;
    phoneValidation.className = 'phone-validation info';
  });

  // 전화번호 입력 시 자동 포맷팅
  phoneInput.addEventListener('input', function(e) {
    const selectedOption = countrySelect.options[countrySelect.selectedIndex];
    const countryCode = selectedOption.value;
    const format = selectedOption.getAttribute('data-format');

    let value = e.target.value.replace(/\D/g, ''); // 숫자만 추출
    let formattedValue = formatPhoneNumber(value, countryCode, format);

    e.target.value = formattedValue;
    validatePhoneNumber(formattedValue, countryCode);
  });

  // 초기 포맷팅 적용
  if (phoneInput.value) {
    const event = new Event('input');
    phoneInput.dispatchEvent(event);
  }
}

// 기존 전화번호에서 국가 감지
function detectCountryFromPhone() {
  const phoneInput = document.getElementById('phone');
  const countrySelect = document.getElementById('countrySelect');

  if (!phoneInput.value) return;

  const phone = phoneInput.value.replace(/\D/g, '');

  // 한국 번호 (010, 011, 016, 017, 018, 019로 시작)
  if (phone.match(/^(010|011|016|017|018|019)/)) {
    countrySelect.value = 'KR';
    return;
  }

  // 미국/캐나다 번호 (1로 시작하고 10자리)
  if (phone.match(/^1\d{10}$/)) {
    countrySelect.value = 'US';
    return;
  }

  // 일본 번호 (81로 시작)
  if (phone.startsWith('81')) {
    countrySelect.value = 'JP';
    return;
  }

  // 중국 번호 (86으로 시작)
  if (phone.startsWith('86')) {
    countrySelect.value = 'CN';
    return;
  }
}

// 국가별 전화번호 포맷팅
function formatPhoneNumber(numbers, countryCode, format) {
  if (!numbers) return '';

  switch (countryCode) {
    case 'KR': // 한국: 010-1234-5678
      if (numbers.length <= 3) return numbers;
      if (numbers.length <= 7) return numbers.slice(0, 3) + '-' + numbers.slice(3);
      return numbers.slice(0, 3) + '-' + numbers.slice(3, 7) + '-' + numbers.slice(7, 11);

    case 'US':
    case 'CA': // 미국/캐나다: (123) 456-7890
      if (numbers.length <= 3) return numbers;
      if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;

    case 'JP': // 일본: 090-1234-5678
      if (numbers.length <= 3) return numbers;
      if (numbers.length <= 7) return numbers.slice(0, 3) + '-' + numbers.slice(3);
      return numbers.slice(0, 3) + '-' + numbers.slice(3, 7) + '-' + numbers.slice(7, 11);

    case 'CN': // 중국: 138 0013 8000
      if (numbers.length <= 3) return numbers;
      if (numbers.length <= 7) return numbers.slice(0, 3) + ' ' + numbers.slice(3);
      return numbers.slice(0, 3) + ' ' + numbers.slice(3, 7) + ' ' + numbers.slice(7, 11);

    case 'GB': // 영국: 07700 900123
      if (numbers.length <= 5) return numbers;
      return numbers.slice(0, 5) + ' ' + numbers.slice(5, 11);

    case 'DE': // 독일: 0151 12345678
      if (numbers.length <= 4) return numbers;
      return numbers.slice(0, 4) + ' ' + numbers.slice(4, 12);

    case 'FR': // 프랑스: 06 12 34 56 78
      if (numbers.length <= 2) return numbers;
      if (numbers.length <= 4) return numbers.slice(0, 2) + ' ' + numbers.slice(2);
      if (numbers.length <= 6) return numbers.slice(0, 2) + ' ' + numbers.slice(2, 4) + ' ' + numbers.slice(4);
      if (numbers.length <= 8) return numbers.slice(0, 2) + ' ' + numbers.slice(2, 4) + ' ' + numbers.slice(4, 6) + ' ' + numbers.slice(6);
      return numbers.slice(0, 2) + ' ' + numbers.slice(2, 4) + ' ' + numbers.slice(4, 6) + ' ' + numbers.slice(6, 8) + ' ' + numbers.slice(8, 10);

    case 'AU': // 호주: 0412 345 678
      if (numbers.length <= 4) return numbers;
      if (numbers.length <= 7) return numbers.slice(0, 4) + ' ' + numbers.slice(4);
      return numbers.slice(0, 4) + ' ' + numbers.slice(4, 7) + ' ' + numbers.slice(7, 10);

    case 'IN': // 인도: 98765 43210
      if (numbers.length <= 5) return numbers;
      return numbers.slice(0, 5) + ' ' + numbers.slice(5, 10);

    default:
      return numbers;
  }
}

// 전화번호 유효성 검사
function validatePhoneNumber(phoneNumber, countryCode) {
  const phoneValidation = document.getElementById('phoneValidation');
  const phoneInput = document.getElementById('phone');

  if (!phoneNumber.trim()) {
    phoneValidation.textContent = '';
    phoneValidation.className = 'phone-validation';
    phoneInput.style.borderColor = '#e5e7eb';
    return;
  }

  const numbers = phoneNumber.replace(/\D/g, '');
  let isValid = false;
  let message = '';

  switch (countryCode) {
    case 'KR':
      isValid = /^(010|011|016|017|018|019)\d{7,8}$/.test(numbers);
      message = isValid ? '올바른 한국 전화번호입니다' : '010, 011, 016, 017, 018, 019로 시작하는 11자리 번호를 입력하세요';
      break;

    case 'US':
    case 'CA':
      isValid = /^\d{10}$/.test(numbers);
      message = isValid ? '올바른 북미 전화번호입니다' : '10자리 번호를 입력하세요 (예: (555) 123-4567)';
      break;

    case 'JP':
      isValid = /^(070|080|090)\d{8}$/.test(numbers);
      message = isValid ? '올바른 일본 전화번호입니다' : '070, 080, 090으로 시작하는 11자리 번호를 입력하세요';
      break;

    case 'CN':
      isValid = /^1[3-9]\d{9}$/.test(numbers);
      message = isValid ? '올바른 중국 전화번호입니다' : '13-19로 시작하는 11자리 번호를 입력하세요';
      break;

    case 'GB':
      isValid = /^07\d{9}$/.test(numbers);
      message = isValid ? '올바른 영국 전화번호입니다' : '07로 시작하는 11자리 번호를 입력하세요';
      break;

    case 'DE':
      isValid = /^01[5-7]\d{8,9}$/.test(numbers);
      message = isValid ? '올바른 독일 전화번호입니다' : '015, 016, 017로 시작하는 번호를 입력하세요';
      break;

    case 'FR':
      isValid = /^0[67]\d{8}$/.test(numbers);
      message = isValid ? '올바른 프랑스 전화번호입니다' : '06 또는 07로 시작하는 10자리 번호를 입력하세요';
      break;

    case 'AU':
      isValid = /^04\d{8}$/.test(numbers);
      message = isValid ? '올바른 호주 전화번호입니다' : '04로 시작하는 10자리 번호를 입력하세요';
      break;

    case 'IN':
      isValid = /^[6-9]\d{9}$/.test(numbers);
      message = isValid ? '올바른 인도 전화번호입니다' : '6, 7, 8, 9로 시작하는 10자리 번호를 입력하세요';
      break;

    default:
      isValid = numbers.length >= 8;
      message = isValid ? '전화번호가 입력되었습니다' : '최소 8자리 이상 입력하세요';
  }

  phoneValidation.textContent = message;
  phoneValidation.className = `phone-validation ${isValid ? 'valid' : 'invalid'}`;
  phoneInput.style.borderColor = isValid ? '#10b981' : '#ef4444';

  return isValid;
}

// 포맷에서 플레이스홀더 생성
function getPlaceholderFromFormat(format) {
  const placeholders = {
    'KR': '010-1234-5678',
    'US': '(555) 123-4567',
    'CA': '(555) 123-4567',
    'JP': '090-1234-5678',
    'CN': '138 0013 8000',
    'GB': '07700 900123',
    'DE': '0151 12345678',
    'FR': '06 12 34 56 78',
    'AU': '0412 345 678',
    'IN': '98765 43210'
  };

  return format ? format.replace(/0/g, '●') : '전화번호를 입력하세요';
}

// 국가별 통화 코드 반환
function getCountryDialCode(countryCode) {
  const dialCodes = {
    'KR': '+82',
    'US': '+1',
    'CA': '+1',
    'JP': '+81',
    'CN': '+86',
    'GB': '+44',
    'DE': '+49',
    'FR': '+33',
    'AU': '+61',
    'IN': '+91'
  };

  return dialCodes[countryCode] || '';
}