// 관리자 로그인 페이지 스크립트
console.log("관리자 로그인 페이지 스크립트 로드 완료.");

document.addEventListener('DOMContentLoaded', function() {
  // 폼 요소들 초기화
  initializeForm();

  // 비밀번호 토글 기능
  initPasswordToggle();

  // 폼 유효성 검사
  initFormValidation();

  // 애니메이션 효과
  initAnimations();

  // 보안 기능
  initSecurityFeatures();
});

// 폼 초기화
function initializeForm() {
  const form = document.getElementById('adminLoginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  // 이메일 입력 시 실시간 유효성 검사
  emailInput.addEventListener('input', function() {
    validateEmail(this);
  });

  // 비밀번호 입력 시 엔터 키로 제출
  passwordInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      form.dispatchEvent(new Event('submit'));
    }
  });

  // 폼 제출 이벤트
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    handleFormSubmit();
  });
}

// 비밀번호 보기/숨기기 토글
function initPasswordToggle() {
  const passwordField = document.getElementById('password');
  const toggleButton = document.querySelector('.password-toggle');
  const toggleIcon = document.querySelector('.toggle-icon');

  if (toggleButton) {
    toggleButton.addEventListener('click', function() {
      const isPassword = passwordField.type === 'password';

      passwordField.type = isPassword ? 'text' : 'password';
      toggleIcon.textContent = isPassword ? '🙈' : '👁';

      // 포커스 유지
      passwordField.focus();

      // 커서를 끝으로 이동
      const length = passwordField.value.length;
      passwordField.setSelectionRange(length, length);
    });
  }
}

// 이메일 유효성 검사
function validateEmail(input) {
  const email = input.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (email && !emailRegex.test(email)) {
    input.style.borderColor = '#ef4444';
    input.setCustomValidity('올바른 이메일 형식을 입력해주세요.');
    return false;
  } else {
    input.style.borderColor = '#374151';
    input.setCustomValidity('');
    return true;
  }
}

// 폼 유효성 검사 초기화
function initFormValidation() {
  const inputs = document.querySelectorAll('input[required]');

  inputs.forEach(input => {
    // 포커스 시 효과
    input.addEventListener('focus', function() {
      this.style.borderColor = '#3b82f6';
      this.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
      this.style.background = '#475569';
    });

    // 블러 시 유효성 검사
    input.addEventListener('blur', function() {
      if (this.id === 'email') {
        validateEmail(this);
      } else if (this.value.trim() === '') {
        this.style.borderColor = '#ef4444';
      } else {
        this.style.borderColor = '#374151';
      }

      this.style.boxShadow = 'none';
      this.style.background = '#334155';
    });
  });
}

// 폼 제출 처리
function handleFormSubmit() {
  const form = document.getElementById('adminLoginForm');
  const loginBtn = document.querySelector('.login-btn');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  // 유효성 검사
  const isEmailValid = validateEmail(emailInput);
  const isPasswordValid = passwordInput.value.trim() !== '';

  if (!isEmailValid || !isPasswordValid) {
    showValidationErrors();
    return;
  }

  // 로딩 상태 시작
  showLoadingState(loginBtn);

  // 보안 로그 기록
  logSecurityAttempt(emailInput.value);

  // 실제 폼 제출 (서버로)
  setTimeout(() => {
    form.submit();
  }, 1000); // 관리자 로그인은 약간 더 긴 대기시간
}

// 로딩 상태 표시
function showLoadingState(button) {
  button.classList.add('loading');
  button.disabled = true;
  button.style.opacity = '0.8';
}

// 유효성 검사 오류 표시
function showValidationErrors() {
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  if (!validateEmail(emailInput)) {
    emailInput.focus();
    showNotification('올바른 관리자 이메일을 입력해주세요.', 'error');
    return;
  }

  if (passwordInput.value.trim() === '') {
    passwordInput.style.borderColor = '#ef4444';
    passwordInput.focus();
    showNotification('비밀번호를 입력해주세요.', 'error');
    return;
  }
}

// 보안 기능 초기화
function initSecurityFeatures() {
  // 개발자 도구 감지 (간단한 버전)
  detectDevTools();

  // 우클릭 방지 (관리자 페이지 보안)
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    showNotification('보안을 위해 우클릭이 비활성화되었습니다.', 'warning');
  });

  // F12 키 비활성화
  document.addEventListener('keydown', function(e) {
    if (e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C') ||
        (e.ctrlKey && e.key === 'U')) {
      e.preventDefault();
      showNotification('보안을 위해 해당 기능이 비활성화되었습니다.', 'warning');
    }
  });

  // 세션 타임아웃 경고
  initSessionTimeout();
}

// 개발자 도구 감지
function detectDevTools() {
  let devtools = {
    open: false,
    orientation: null
  };

  const threshold = 160;

  const checkDevTools = () => {
    if (window.outerHeight - window.innerHeight > threshold ||
        window.outerWidth - window.innerWidth > threshold) {
      if (!devtools.open) {
        devtools.open = true;
        console.warn('관리자 페이지 보안 경고: 개발자 도구가 감지되었습니다.');
        showNotification('보안 경고: 개발자 도구 사용이 감지되었습니다.', 'warning');
      }
    } else {
      devtools.open = false;
    }
  };

  setInterval(checkDevTools, 500);
}

// 세션 타임아웃 초기화
function initSessionTimeout() {
  let timeoutWarning = 25 * 60 * 1000; // 25분 후 경고
  let timeoutLogout = 30 * 60 * 1000; // 30분 후 자동 로그아웃

  setTimeout(() => {
    showNotification('세션이 5분 후 만료됩니다. 로그인을 연장하시겠습니까?', 'warning');
  }, timeoutWarning);

  setTimeout(() => {
    showNotification('세션이 만료되어 로그아웃됩니다.', 'error');
    setTimeout(() => {
      window.location.href = '/admin/login?timeout=true';
    }, 3000);
  }, timeoutLogout);
}

// 보안 로그 기록
function logSecurityAttempt(email) {
  const logData = {
    timestamp: new Date().toISOString(),
    email: email,
    ip: 'hidden', // 서버에서 처리
    userAgent: navigator.userAgent,
    action: 'admin_login_attempt'
  };

  console.log('관리자 로그인 시도:', logData);

  // 실제 구현시에는 서버로 보안 로그 전송
  // fetch('/admin/security-log', { ... })
}

// 애니메이션 효과 초기화
function initAnimations() {
  // 페이지 로드 시 애니메이션
  const illustrationPanel = document.querySelector('.illustration-panel');
  const formPanel = document.querySelector('.form-panel');

  if (illustrationPanel) {
    illustrationPanel.style.opacity = '0';
    illustrationPanel.style.transform = 'translateX(-50px)';
    illustrationPanel.style.transition = 'all 0.8s ease';
  }

  if (formPanel) {
    formPanel.style.opacity = '0';
    formPanel.style.transform = 'translateX(50px)';
    formPanel.style.transition = 'all 0.8s ease';
  }

  // 페이지 로드 후 애니메이션 실행
  window.addEventListener('load', function() {
    setTimeout(() => {
      if (illustrationPanel) {
        illustrationPanel.style.opacity = '1';
        illustrationPanel.style.transform = 'translateX(0)';
      }
    }, 200);

    setTimeout(() => {
      if (formPanel) {
        formPanel.style.opacity = '1';
        formPanel.style.transform = 'translateX(0)';
      }
    }, 400);
  });

  // 폼 요소들 순차 애니메이션
  animateFormElements();
}

// 폼 요소 애니메이션
function animateFormElements() {
  const formElements = document.querySelectorAll('.brand-header, .login-form, .security-info, .back-link');

  formElements.forEach((element, index) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'all 0.6s ease';

    setTimeout(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, 600 + (index * 100));
  });
}

// 알림 메시지 표시
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
    max-width: 320px;
    word-wrap: break-word;
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  `;

  // 타입별 배경색 설정
  switch(type) {
    case 'success':
      notification.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      break;
    case 'error':
      notification.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
      break;
    case 'warning':
      notification.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
      break;
    default:
      notification.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)';
  }

  notification.textContent = message;
  document.body.appendChild(notification);

  // 애니메이션
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

// Remember Me 체크박스 애니메이션
document.addEventListener('change', function(e) {
  if (e.target.type === 'checkbox' && e.target.name === 'rememberMe') {
    const checkmark = e.target.nextElementSibling;
    if (e.target.checked) {
      checkmark.style.transform = 'scale(1.1)';
      setTimeout(() => {
        checkmark.style.transform = 'scale(1)';
      }, 150);
    }
  }
});

// 키보드 네비게이션 개선
document.addEventListener('keydown', function(e) {
  if (e.key === 'Tab') {
    // 탭 키 사용 시 포커스 표시 개선
    document.body.classList.add('keyboard-navigation');
  }
});

document.addEventListener('mousedown', function() {
  // 마우스 사용 시 포커스 아웃라인 제거
  document.body.classList.remove('keyboard-navigation');
});

// 접근성 개선을 위한 CSS 추가
const style = document.createElement('style');
style.textContent = `
    .keyboard-navigation input:focus,
    .keyboard-navigation button:focus {
        outline: 2px solid #3b82f6 !important;
        outline-offset: 2px !important;
    }
`;
document.head.appendChild(style);

// 폼 자동완성 개선
window.addEventListener('load', function() {
  // 브라우저 자동완성이 있을 경우 스타일 적용
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => {
    if (input.value) {
      input.style.borderColor = '#3b82f6';
    }
  });
});

// 보안 체크 (페이지 이탈 시 경고)
window.addEventListener('beforeunload', function(e) {
  const form = document.getElementById('adminLoginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  if (emailInput.value || passwordInput.value) {
    const message = '입력된 정보가 손실될 수 있습니다. 정말 이 페이지를 벗어나시겠습니까?';
    e.returnValue = message;
    return message;
  }
});

console.log("관리자 로그인 스크립트 초기화 완료");