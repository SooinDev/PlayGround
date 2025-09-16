// GitHub 스타일 로그인 페이지 스크립트
console.log("로그인 페이지 스크립트 로드 완료.");

document.addEventListener('DOMContentLoaded', function() {
  // 폼 요소들 초기화
  initializeForm();

  // 비밀번호 토글 기능
  initPasswordToggle();

  // 폼 유효성 검사
  initFormValidation();

  // 소셜 로그인 버튼
  initSocialLogin();

  // 애니메이션 효과
  initAnimations();
});

// 폼 초기화
function initializeForm() {
  const form = document.getElementById('loginForm');
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
    input.style.borderColor = '#e5e7eb';
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
      this.style.borderColor = '#667eea';
      this.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1)';
    });

    // 블러 시 유효성 검사
    input.addEventListener('blur', function() {
      if (this.type === 'email') {
        validateEmail(this);
      } else if (this.value.trim() === '') {
        this.style.borderColor = '#ef4444';
      } else {
        this.style.borderColor = '#e5e7eb';
      }

      this.style.boxShadow = 'none';
    });
  });
}

// 폼 제출 처리
function handleFormSubmit() {
  const form = document.getElementById('loginForm');
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

  // 실제 폼 제출 (서버로)
  setTimeout(() => {
    form.submit();
  }, 500);
}

// 로딩 상태 표시
function showLoadingState(button) {
  button.classList.add('loading');
  button.disabled = true;
  button.style.opacity = '0.7';
}

// 유효성 검사 오류 표시
function showValidationErrors() {
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  if (!validateEmail(emailInput)) {
    emailInput.focus();
    return;
  }

  if (passwordInput.value.trim() === '') {
    passwordInput.style.borderColor = '#ef4444';
    passwordInput.focus();
    return;
  }
}

// 소셜 로그인 초기화
function initSocialLogin() {
  const googleBtn = document.querySelector('.google-btn');
  const githubBtn = document.querySelector('.github-btn');

  if (googleBtn) {
    googleBtn.addEventListener('click', function() {
      console.log('Google 로그인 시도');
      // TODO: Google OAuth 구현
      showSocialLoginMessage('Google');
    });
  }

  if (githubBtn) {
    githubBtn.addEventListener('click', function() {
      console.log('GitHub 로그인 시도');
      // TODO: GitHub OAuth 구현
      showSocialLoginMessage('GitHub');
    });
  }
}

// 소셜 로그인 메시지 표시
function showSocialLoginMessage(provider) {
  const message = document.createElement('div');
  message.className = 'temp-message';
  message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #667eea;
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        font-size: 14px;
        z-index: 1000;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
  message.textContent = `${provider} 로그인 기능은 준비 중입니다.`;

  document.body.appendChild(message);

  // 애니메이션
  setTimeout(() => {
    message.style.transform = 'translateX(0)';
  }, 100);

  // 자동 제거
  setTimeout(() => {
    message.style.transform = 'translateX(400px)';
    setTimeout(() => {
      document.body.removeChild(message);
    }, 300);
  }, 3000);
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
  const formElements = document.querySelectorAll('.brand-header, .login-form, .divider, .social-login, .signup-link');

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
        outline: 2px solid #667eea !important;
        outline-offset: 2px !important;
    }
    
    .temp-message {
        animation: slideIn 0.3s ease;
    }
    
    @keyframes slideIn {
        from { transform: translateX(400px); }
        to { transform: translateX(0); }
    }
`;
document.head.appendChild(style);

// 폼 자동완성 개선
window.addEventListener('load', function() {
  // 브라우저 자동완성이 있을 경우 스타일 적용
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => {
    if (input.value) {
      input.style.borderColor = '#667eea';
    }
  });
});