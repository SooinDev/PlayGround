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

// 중복 확인 기능 초기화
function initDuplicateCheck() {
  const emailInput = document.getElementById('email');
  const nicknameInput = document.getElementById('nickname');
  const emailCheckBtn = document.getElementById('emailCheckBtn');
  const nicknameCheckBtn = document.getElementById('nicknameCheckBtn');

  // 이메일 중복 확인
  if (emailCheckBtn) {
    emailCheckBtn.addEventListener('click', function() {
      const email = emailInput.value.trim();
      if (!email) {
        showValidationMessage('이메일을 입력해주세요.', 'error', 'emailValidation');
        return;
      }
      if (!validateEmailFormat(email)) {
        showValidationMessage('올바른 이메일 형식을 입력해주세요.', 'error', 'emailValidation');
        return;
      }
      checkEmailDuplicate(email);
    });
  }

  // 닉네임 중복 확인
  if (nicknameCheckBtn) {
    nicknameCheckBtn.addEventListener('click', function() {
      const nickname = nicknameInput.value.trim();
      if (!nickname) {
        showValidationMessage('닉네임을 입력해주세요.', 'error', 'nicknameValidation');
        return;
      }
      if (!validateNicknameFormat(nickname)) {
        showValidationMessage('닉네임은 2-20자의 영문, 한글, 숫자, 언더스코어만 사용 가능합니다.', 'error', 'nicknameValidation');
        return;
      }
      checkNicknameDuplicate(nickname);
    });
  }

  // 입력값 변경 시 중복확인 상태 초기화
  emailInput.addEventListener('input', function() {
    resetCheckButton(emailCheckBtn, 'emailValidation');
  });

  nicknameInput.addEventListener('input', function() {
    resetCheckButton(nicknameCheckBtn, 'nicknameValidation');
  });
}

// 이메일 중복 확인 API 호출
function checkEmailDuplicate(email) {
  const checkBtn = document.getElementById('emailCheckBtn');
  setButtonLoading(checkBtn, true);

  showValidationMessage('이메일 중복 확인 중...', 'loading', 'emailValidation');

  // 실제 API 호출 (현재는 시뮬레이션)
  fetch('/member/check-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: email })
  })
      .then(response => response.json())
      .then(data => {
        setButtonLoading(checkBtn, false);

        if (data.available) {
          setButtonSuccess(checkBtn);
          showValidationMessage('사용 가능한 이메일입니다.', 'success', 'emailValidation');
        } else {
          setButtonError(checkBtn);
          showValidationMessage('이미 사용중인 이메일입니다.', 'error', 'emailValidation');
        }
      })
      .catch(error => {
        setButtonLoading(checkBtn, false);
        console.error('이메일 중복 확인 오류:', error);

        // 임시: 랜덤하게 성공/실패 시뮬레이션
        const isAvailable = Math.random() > 0.3; // 70% 확률로 사용 가능

        if (isAvailable) {
          setButtonSuccess(checkBtn);
          showValidationMessage('사용 가능한 이메일입니다.', 'success', 'emailValidation');
        } else {
          setButtonError(checkBtn);
          showValidationMessage('이미 사용중인 이메일입니다.', 'error', 'emailValidation');
        }
      });
}

// 닉네임 중복 확인 API 호출
function checkNicknameDuplicate(nickname) {
  const checkBtn = document.getElementById('nicknameCheckBtn');
  setButtonLoading(checkBtn, true);

  showValidationMessage('닉네임 중복 확인 중...', 'loading', 'nicknameValidation');

  // 실제 API 호출 (현재는 시뮬레이션)
  fetch('/member/check-nickname', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ nickname: nickname })
  })
      .then(response => response.json())
      .then(data => {
        setButtonLoading(checkBtn, false);

        if (data.available) {
          setButtonSuccess(checkBtn);
          showValidationMessage('사용 가능한 닉네임입니다.', 'success', 'nicknameValidation');
        } else {
          setButtonError(checkBtn);
          showValidationMessage('이미 사용중인 닉네임입니다.', 'error', 'nicknameValidation');
        }
      })
      .catch(error => {
        setButtonLoading(checkBtn, false);
        console.error('닉네임 중복 확인 오류:', error);

        // 임시: 랜덤하게 성공/실패 시뮬레이션
        const isAvailable = Math.random() > 0.4; // 60% 확률로 사용 가능

        if (isAvailable) {
          setButtonSuccess(checkBtn);
          showValidationMessage('사용 가능한 닉네임입니다.', 'success', 'nicknameValidation');
        } else {
          setButtonError(checkBtn);
          showValidationMessage('이미 사용중인 닉네임입니다.', 'error', 'nicknameValidation');
        }
      });
}

// 버튼 상태 관리 함수들
function setButtonLoading(button, isLoading) {
  if (isLoading) {
    button.classList.add('loading');
    button.disabled = true;
  } else {
    button.classList.remove('loading');
    button.disabled = false;
  }
}

function setButtonSuccess(button) {
  button.classList.remove('loading', 'error');
  button.classList.add('success');
  button.disabled = true;
}

function setButtonError(button) {
  button.classList.remove('loading', 'success');
  button.classList.add('error');
  button.disabled = false;
}

function resetCheckButton(button, validationId) {
  if (button) {
    button.classList.remove('loading', 'success', 'error');
    button.disabled = false;
  }
  hideValidationMessage(validationId);
}

// 유효성 검사 메시지 표시/숨기기
function showValidationMessage(message, type, elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = message;
    element.className = `validation-message ${type} show`;
  }
}

function hideValidationMessage(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.className = 'validation-message';
    element.textContent = '';
  }
}

// 이메일 형식 검증
function validateEmailFormat(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// 닉네임 형식 검증
function validateNicknameFormat(nickname) {
  const nicknameRegex = /^[a-zA-Z0-9가-힣_]{2,20}$/;
  return nicknameRegex.test(nickname);
}

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
    showValidationMessage('비밀번호가 일치하지 않습니다.', 'error', 'confirmPasswordValidation');
    return false;
  } else if (confirmPassword) {
    confirmPasswordInput.style.borderColor = '#10b981';
    confirmPasswordInput.setCustomValidity('');
    showValidationMessage('비밀번호가 일치합니다.', 'success', 'confirmPasswordValidation');
    return true;
  } else {
    confirmPasswordInput.style.borderColor = '#e5e7eb';
    confirmPasswordInput.setCustomValidity('');
    hideValidationMessage('confirmPasswordValidation');
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
        // 이메일 형식만 검사 (중복확인은 버튼으로)
        if (this.value && !validateEmailFormat(this.value)) {
          this.style.borderColor = '#ef4444';
        } else {
          this.style.borderColor = '#e5e7eb';
        }
      } else if (this.name === 'nickname') {
        // 닉네임 형식만 검사 (중복확인은 버튼으로)
        if (this.value && !validateNicknameFormat(this.value)) {
          this.style.borderColor = '#ef4444';
        } else {
          this.style.borderColor = '#e5e7eb';
        }
      } else if (this.name === 'confirmPassword') {
        validatePasswordMatch();
      } else if (this.hasAttribute('required') && this.value.trim() === '') {
        this.style.borderColor = '#ef4444';
      } else {
        this.style.borderColor = '#e5e7eb';
      }
    });
  });
}

// 폼 제출 처리
function handleFormSubmit() {
  const form = document.getElementById('registerForm');
  const registerBtn = document.querySelector('.register-btn');
  const termsCheckbox = document.querySelector('input[name="agreeTerms"]');

  // 중복확인 완료 여부 체크
  const emailCheckBtn = document.getElementById('emailCheckBtn');
  const nicknameCheckBtn = document.getElementById('nicknameCheckBtn');

  if (!emailCheckBtn.classList.contains('success')) {
    showGlobalMessage('이메일 중복확인을 완료해주세요.', 'error');
    return;
  }

  if (!nicknameCheckBtn.classList.contains('success')) {
    showGlobalMessage('닉네임 중복확인을 완료해주세요.', 'error');
    return;
  }

  // 기본 유효성 검사
  const isPasswordValid = validatePasswordStrength();
  const isPasswordMatchValid = validatePasswordMatch();

  // 약관 동의 확인
  if (!termsCheckbox.checked) {
    showGlobalMessage('이용약관에 동의해주세요.', 'error');
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

  if (hasEmptyRequired || !isPasswordValid || !isPasswordMatchValid) {
    showGlobalMessage('입력 정보를 다시 확인해주세요.', 'error');
    scrollToFirstError();
    return;
  }

  // 로딩 상태 시작
  showLoadingState(registerBtn);

  // 실제 폼 제출
  showGlobalMessage('계정 생성 중...', 'info');
  setTimeout(() => {
    form.submit();
  }, 500);
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

// 전역 메시지 표시
function showGlobalMessage(message, type) {
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
  } else if (type === 'success') {
    messageEl.style.background = '#f0fdf4';
    messageEl.style.color = '#16a34a';
    messageEl.style.border = '1px solid #bbf7d0';
  } else {
    messageEl.style.background = '#eff6ff';
    messageEl.style.color = '#2563eb';
    messageEl.style.border = '1px solid #bfdbfe';
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
      showGlobalMessage('Google 회원가입 기능은 준비 중입니다.', 'info');
    });
  }

  if (githubBtn) {
    githubBtn.addEventListener('click', function() {
      console.log('GitHub 회원가입 시도');
      showGlobalMessage('GitHub 회원가입 기능은 준비 중입니다.', 'info');
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
  if (e.key === 'Enter' && e.target.tagName === 'INPUT' && e.target.type !== 'submit') {
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
});