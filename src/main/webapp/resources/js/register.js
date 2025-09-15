// GitHub 스타일 회원가입 페이지 스크립트
console.log("회원가입 페이지 스크립트 로드 완료.");

document.addEventListener('DOMContentLoaded', function() {
  // 폼 요소들 초기화
  initializeForm();

  // 비밀번호 토글 및 강도 검사
  initPasswordFeatures();

  // 폼 유효성 검사
  initFormValidation();

  // 중복 확인 기능
  initDuplicateCheck();

  // 소셜 회원가입 버튼
  initSocialRegister();

  // 애니메이션 효과
  initAnimations();
});

// 폼 초기화
function initializeForm() {
  const form = document.getElementById('registerForm');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');

  // 비밀번호 확인 실시간 검사
  confirmPasswordInput.addEventListener('input', function() {
    validatePasswordMatch();
  });

  // 폼 제출 이벤트
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    handleFormSubmit();
  });
}

// 비밀번호 관련 기능 초기화
function initPasswordFeatures() {
  const passwordInput = document.getElementById('password');
  const toggleButton = document.querySelector('.password-toggle');
  const toggleIcon = document.querySelector('.toggle-icon');
  const strengthContainer = document.querySelector('.password-strength');

  // 비밀번호 보기/숨기기 토글
  if (toggleButton) {
    toggleButton.addEventListener('click', function() {
      const isPassword = passwordInput.type === 'password';

      passwordInput.type = isPassword ? 'text' : 'password';
      toggleIcon.textContent = isPassword ? '🙈' : '👁';

      passwordInput.focus();
      const length = passwordInput.value.length;
      passwordInput.setSelectionRange(length, length);
    });
  }

  // 비밀번호 강도 검사
  passwordInput.addEventListener('input', function() {
    const password = this.value;

    if (password.length > 0) {
      strengthContainer.classList.add('visible');
      updatePasswordStrength(password);
    } else {
      strengthContainer.classList.remove('visible');
    }

    validatePasswordStrength();
  });
}

// 비밀번호 강도 업데이트
function updatePasswordStrength(password) {
  const strengthFill = document.querySelector('.strength-fill');
  const strengthText = document.querySelector('.strength-text');

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
    strengthFill.classList.add('weak');
    feedback = '약함 - 더 강한 비밀번호를 사용하세요';
  } else if (score <= 3) {
    strengthFill.classList.add('fair');
    feedback = '보통 - 특수문자를 추가해보세요';
  } else if (score <= 4) {
    strengthFill.classList.add('good');
    feedback = '좋음 - 안전한 비밀번호입니다';
  } else {
    strengthFill.classList.add('strong');
    feedback = '매우 강함 - 훌륭한 비밀번호입니다';
  }

  strengthText.textContent = feedback;
}

// 비밀번호 강도 유효성 검사
function validatePasswordStrength() {
  const passwordInput = document.getElementById('password');
  const password = passwordInput.value;

  if (password.length < 8) {
    passwordInput.style.borderColor = '#ef4444';
    passwordInput.setCustomValidity('비밀번호는 최소 8자 이상이어야 합니다.');
    return false;
  }

  if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
    passwordInput.style.borderColor = '#f59e0b';
    passwordInput.setCustomValidity('비밀번호는 영문자와 숫자를 포함해야 합니다.');
    return false;
  }

  passwordInput.style.borderColor = '#10b981';
  passwordInput.setCustomValidity('');
  return true;
}

// 비밀번호 확인 검사
function validatePasswordMatch() {
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');

  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  if (confirmPassword && password !== confirmPassword) {
    confirmPasswordInput.style.borderColor = '#ef4444';
    confirmPasswordInput.setCustomValidity('비밀번호가 일치하지 않습니다.');
    return false;
  } else {
    confirmPasswordInput.style.borderColor = '#e5e7eb';
    confirmPasswordInput.setCustomValidity('');
    return true;
  }
}

// 이메일 유효성 검사
function validateEmail() {
  const emailInput = document.getElementById('email');
  const email = emailInput.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (email && !emailRegex.test(email)) {
    emailInput.style.borderColor = '#ef4444';
    emailInput.setCustomValidity('올바른 이메일 형식을 입력해주세요.');
    return false;
  } else {
    emailInput.style.borderColor = '#e5e7eb';
    emailInput.setCustomValidity('');
    return true;
  }
}

// 닉네임 유효성 검사
function validateNickname() {
  const nicknameInput = document.getElementById('nickname');
  const nickname = nicknameInput.value.trim();
  const nicknameRegex = /^[a-zA-Z0-9가-힣_]{2,20}$/;

  if (nickname && !nicknameRegex.test(nickname)) {
    nicknameInput.style.borderColor = '#ef4444';
    nicknameInput.setCustomValidity('닉네임은 2-20자의 영문, 한글, 숫자, 언더스코어만 사용 가능합니다.');
    return false;
  } else {
    nicknameInput.style.borderColor = '#e5e7eb';
    nicknameInput.setCustomValidity('');
    return true;
  }
}

// 폼 유효성 검사 초기화
function initFormValidation() {
  const inputs = document.querySelectorAll('input');

  inputs.forEach(input => {
    // 포커스 시 효과
    input.addEventListener('focus', function() {
      this.style.borderColor = '#10b981';
      this.style.boxShadow = '0 0 0 4px rgba(16, 185, 129, 0.1)';
    });

    // 블러 시 유효성 검사
    input.addEventListener('blur', function() {
      this.style.boxShadow = 'none';

      if (this.type === 'email') {
        validateEmail();
      } else if (this.name === 'nickname') {
        validateNickname();
      } else if (this.name === 'confirmPassword') {
        validatePasswordMatch();
      } else if (this.hasAttribute('required') && this.value.trim() === '') {
        this.style.borderColor = '#ef4444';
      } else {
        this.style.borderColor = '#e5e7eb';
      }
    });

    // 실시간 입력 검사
    input.addEventListener('input', function() {
      if (this.type === 'email') {
        validateEmail();
      } else if (this.name === 'nickname') {
        validateNickname();
      }
    });
  });
}

// 폼 제출 처리
function handleFormSubmit() {
  const form = document.getElementById('registerForm');
  const registerBtn = document.querySelector('.register-btn');
  const termsCheckbox = document.querySelector('input[name="agreeTerms"]');

  // 모든 유효성 검사 실행
  const isEmailValid = validateEmail();
  const isPasswordValid = validatePasswordStrength();
  const isPasswordMatchValid = validatePasswordMatch();
  const isNicknameValid = validateNickname();

  // 약관 동의 확인
  if (!termsCheckbox.checked) {
    showValidationMessage('이용약관에 동의해주세요.', 'error');
    termsCheckbox.focus();
    return;
  }

  // 필수 필드 확인
  const requiredFields = form.querySelectorAll('input[required]');
  let hasEmptyRequired = false;

  requiredFields.forEach(field => {
    if (field.value.trim() === '') {
      field.style.borderColor = '#ef4444';
      hasEmptyRequired = true;
    }
  });

  if (hasEmptyRequired || !isEmailValid || !isPasswordValid || !isPasswordMatchValid || !isNicknameValid) {
    showValidationMessage('입력 정보를 다시 확인해주세요.', 'error');
    scrollToFirstError();
    return;
  }

  // 로딩 상태 시작
  showLoadingState(registerBtn);

  // 성공 메시지 표시 후 실제 제출
  setTimeout(() => {
    showValidationMessage('계정이 성공적으로 생성되었습니다!', 'success');
    setTimeout(() => {
      form.submit();
    }, 1000);
  }, 1000);
}

// 로딩 상태 표시
function showLoadingState(button) {
  button.classList.add('loading');
  button.disabled = true;
  button.style.opacity = '0.8';
}

// 첫 번째 오류 필드로 스크롤
function scrollToFirstError() {
  const firstInvalidField = document.querySelector('input:invalid, input[style*="border-color: rgb(239, 68, 68)"]');
  if (firstInvalidField) {
    firstInvalidField.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
    firstInvalidField.focus();
  }
}

// 유효성 검사 메시지 표시
function showValidationMessage(message, type) {
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

// 소셜 회원가입 초기화
function initSocialRegister() {
  const googleBtn = document.querySelector('.google-btn');
  const githubBtn = document.querySelector('.github-btn');

  if (googleBtn) {
    googleBtn.addEventListener('click', function() {
      console.log('Google 회원가입 시도');
      showValidationMessage('Google 회원가입 기능은 준비 중입니다.', 'error');
    });
  }

  if (githubBtn) {
    githubBtn.addEventListener('click', function() {
      console.log('GitHub 회원가입 시도');
      showValidationMessage('GitHub 회원가입 기능은 준비 중입니다.', 'error');
    });
  }
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
  const formElements = document.querySelectorAll('.brand-header, .register-form, .divider, .social-register, .login-link');

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
  if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
    const inputs = Array.from(document.querySelectorAll('input:not([type="checkbox"])'));
    const currentIndex = inputs.indexOf(e.target);
    const nextInput = inputs[currentIndex + 1];

    if (nextInput) {
      e.preventDefault();
      nextInput.focus();
    }
  }
});

// 체크박스 애니메이션
document.addEventListener('change', function(e) {
  if (e.target.type === 'checkbox') {
    const checkmark = e.target.nextElementSibling;
    if (e.target.checked) {
      checkmark.style.transform = 'scale(1.1)';
      setTimeout(() => {
        checkmark.style.transform = 'scale(1)';
      }, 150);
    }
  }
});

// 폼 자동완성 개선
window.addEventListener('load', function() {
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => {
    if (input.value) {
      input.style.borderColor = '#10b981';
    }
  });
});disabled = true;
submitBtn.style.opacity = '0.7';

// 3초 후 원래 상태로 복구 (실제로는 서버 응답을 기다려야 함)
setTimeout(() => {
  submitBtn.textContent = originalText;
  submitBtn.disabled = false;
  submitBtn.style.opacity = '1';
}, 3000);

// 이벤트 리스너 등록
passwordInput.addEventListener('input', validatePasswordStrength);
confirmPasswordInput.addEventListener('input', validatePasswordMatch);
emailInput.addEventListener('input', validateEmail);
nicknameInput.addEventListener('input', validateNickname);

// 폼 제출 시 유효성 검사
form.addEventListener('submit', function(e) {
  const isEmailValid = validateEmail();
  const isPasswordValid = validatePasswordStrength();
  const isNicknameValid = validateNickname();

  validatePasswordMatch();

  if (!isEmailValid || !isPasswordValid || !isNicknameValid || !form.checkValidity()) {
    e.preventDefault();
    smoothScrollToError();

    // 오류 메시지 표시
    console.log('폼 유효성 검사 실패');
    return false;
  }

  // 로딩 상태 표시
  showLoadingState();

  console.log('폼 제출 중...');
});

// 입력 효과 초기화
addInputEffects();

// 페이지 로드 시 애니메이션
setTimeout(() => {
  document.querySelector('.form-container').style.opacity = '1';
  document.querySelector('.form-container').style.transform = 'translateY(0)';
}, 100);

// 접근성: 키보드 네비게이션 개선
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
    const inputs = Array.from(document.querySelectorAll('input[required]'));
    const currentIndex = inputs.indexOf(e.target);
    const nextInput = inputs[currentIndex + 1];

    if (nextInput) {
      e.preventDefault();
      nextInput.focus();
    }
  }
});

// 폼 필드 자동완성 개선
window.addEventListener('load', function() {
  // 브라우저 자동완성 데이터가 있을 경우 스타일 적용
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => {
    if (input.value) {
      input.style.borderColor = '#007aff';
    }
  });
});