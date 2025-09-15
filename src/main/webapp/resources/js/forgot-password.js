// 비밀번호 찾기 페이지 스크립트
console.log("비밀번호 찾기 페이지 스크립트 로드 완료.");

document.addEventListener('DOMContentLoaded', function() {
  // 폼 요소들 초기화
  initializeForm();

  // 이메일 유효성 검사
  initEmailValidation();

  // 애니메이션 효과
  initAnimations();
});

// 폼 초기화
function initializeForm() {
  const form = document.getElementById('forgotPasswordForm');
  const emailInput = document.getElementById('email');

  // 이메일 입력 시 실시간 유효성 검사
  emailInput.addEventListener('input', function() {
    validateEmail(this);
  });

  // 폼 제출 이벤트
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    handleFormSubmit();
  });
}

// 이메일 유효성 검사 초기화
function initEmailValidation() {
  const emailInput = document.getElementById('email');

  // 포커스 시 효과
  emailInput.addEventListener('focus', function() {
    this.style.borderColor = '#6366f1';
    this.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)';
  });

  // 블러 시 유효성 검사
  emailInput.addEventListener('blur', function() {
    this.style.boxShadow = 'none';
    validateEmail(this);
  });
}

// 이메일 유효성 검사
function validateEmail(input) {
  const email = input.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailValidation = document.getElementById('emailValidation');

  if (!email) {
    input.style.borderColor = '#e5e7eb';
    showValidationMessage('', emailValidation, '');
    return false;
  }

  if (!emailRegex.test(email)) {
    input.style.borderColor = '#ef4444';
    showValidationMessage('올바른 이메일 형식을 입력해주세요.', emailValidation, 'error');
    return false;
  } else {
    input.style.borderColor = '#10b981';
    showValidationMessage('올바른 이메일 형식입니다.', emailValidation, 'success');
    return true;
  }
}

// 검증 메시지 표시
function showValidationMessage(message, element, type) {
  element.textContent = message;
  element.className = `validation-message ${type}`;
}

// 폼 제출 처리
function handleFormSubmit() {
  const form = document.getElementById('forgotPasswordForm');
  const resetBtn = document.querySelector('.reset-btn');
  const emailInput = document.getElementById('email');

  // 이메일 유효성 검사
  const isEmailValid = validateEmail(emailInput);

  if (!isEmailValid) {
    emailInput.focus();
    return;
  }

  // 로딩 상태 시작
  showLoadingState(resetBtn);

  // 실제 서버로 폼 데이터 전송
  form.submit();
}

// 로딩 상태 표시
function showLoadingState(button) {
  button.classList.add('loading');
  button.disabled = true;
  button.style.opacity = '0.8';
}

// 로딩 상태 복구
function resetLoadingState(button) {
  button.classList.remove('loading');
  button.disabled = false;
  button.style.opacity = '1';
}

// 임시 메시지 표시
function showTempMessage(message, type) {
  const messageEl = document.createElement('div');
  messageEl.className = `temp-message ${type}`;
  messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 12px;
        font-size: 14px;
        font-weight: 500;
        z-index: 1000;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 320px;
    `;

  if (type === 'error') {
    messageEl.style.background = '#fef2f2';
    messageEl.style.color = '#dc2626';
    messageEl.style.border = '1px solid #fecaca';
  } else {
    messageEl.style.background = '#f0fdf4';
    messageEl.style.color = '#16a34a';
    messageEl.style.border = '1px solid #bbf7d0';
  }

  messageEl.textContent = message;
  document.body.appendChild(messageEl);

  setTimeout(() => {
    messageEl.style.transform = 'translateX(0)';
  }, 100);

  setTimeout(() => {
    messageEl.style.transform = 'translateX(400px)';
    setTimeout(() => {
      if (document.body.contains(messageEl)) {
        document.body.removeChild(messageEl);
      }
    }, 300);
  }, 4000);
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
  const formElements = document.querySelectorAll('.brand-header, .forgot-password-form, .info-box, .back-links');

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

// 키보드 네비게이션 지원
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    // ESC 키로 로그인 페이지로 이동
    window.location.href = '/member/login';
  }
});

// 폼 자동완성 개선
window.addEventListener('load', function() {
  const emailInput = document.getElementById('email');
  if (emailInput.value) {
    emailInput.style.borderColor = '#6366f1';
    validateEmail(emailInput);
  }
});

// 이메일 자동 포커스
document.addEventListener('DOMContentLoaded', function() {
  const emailInput = document.getElementById('email');
  if (emailInput && !emailInput.value) {
    setTimeout(() => {
      emailInput.focus();
    }, 1000);
  }
});