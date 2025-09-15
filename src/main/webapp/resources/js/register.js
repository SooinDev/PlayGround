// 회원가입 페이지 스크립트
console.log("회원가입 페이지 스크립트 로드 완료.");

document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM 로드 완료");

  // 모든 초기화 함수 호출
  initializeForm();
  initPasswordFeatures();
  initFormValidation();
  initDuplicateCheck();
  initSocialRegister();
  initAnimations();
});

// 중복 확인 기능 초기화
function initDuplicateCheck() {
  console.log("중복확인 기능 초기화 시작");

  const emailInput = document.getElementById('email');
  const nicknameInput = document.getElementById('nickname');
  const emailCheckBtn = document.getElementById('emailCheckBtn');
  const nicknameCheckBtn = document.getElementById('nicknameCheckBtn');

  console.log('요소 찾기 결과:');
  console.log('emailInput:', emailInput);
  console.log('nicknameInput:', nicknameInput);
  console.log('emailCheckBtn:', emailCheckBtn);
  console.log('nicknameCheckBtn:', nicknameCheckBtn);

  // 이메일 중복 확인
  if (emailCheckBtn) {
    console.log("이메일 중복확인 버튼 이벤트 리스너 추가");
    emailCheckBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log("이메일 중복확인 버튼 클릭됨");

      const email = emailInput.value.trim();
      console.log("입력된 이메일:", email);

      if (!email) {
        showValidationMessage('이메일을 입력해주세요.', 'error', 'emailValidation');
        return;
      }

      if (!validateEmailFormat(email)) {
        showValidationMessage('올바른 이메일 형식을 입력해주세요.', 'error', 'emailValidation');
        return;
      }

      checkEmailDuplicate(email, emailCheckBtn);
    });
  } else {
    console.error("이메일 중복확인 버튼을 찾을 수 없습니다");
  }

  // 닉네임 중복 확인
  if (nicknameCheckBtn) {
    console.log("닉네임 중복확인 버튼 이벤트 리스너 추가");
    nicknameCheckBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log("닉네임 중복확인 버튼 클릭됨");

      const nickname = nicknameInput.value.trim();
      console.log("입력된 닉네임:", nickname);

      if (!nickname) {
        showValidationMessage('닉네임을 입력해주세요.', 'error', 'nicknameValidation');
        return;
      }

      if (!validateNicknameFormat(nickname)) {
        showValidationMessage('닉네임은 2-20자의 영문, 한글, 숫자, 언더스코어만 사용 가능합니다.', 'error', 'nicknameValidation');
        return;
      }

      checkNicknameDuplicate(nickname, nicknameCheckBtn);
    });
  } else {
    console.error("닉네임 중복확인 버튼을 찾을 수 없습니다");
  }

  // 입력값 변경 시 버튼 상태 초기화
  if (emailInput) {
    emailInput.addEventListener('input', function() {
      resetButton(emailCheckBtn);
      hideValidationMessage('emailValidation');
    });
  }

  if (nicknameInput) {
    nicknameInput.addEventListener('input', function() {
      resetButton(nicknameCheckBtn);
      hideValidationMessage('nicknameValidation');
    });
  }
}

// 이메일 중복확인 - 실제 서버 API 호출
function checkEmailDuplicate(email, button) {
  console.log("이메일 중복확인 시작:", email);

  setButtonLoading(button, true);
  showValidationMessage('이메일 중복 확인 중...', 'info', 'emailValidation');

  // 서버 API 호출
  fetch('/member/check-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'email=' + encodeURIComponent(email)
  })
      .then(response => response.json())
      .then(data => {
        setButtonLoading(button, false);

        if (data.success) {
          setButtonSuccess(button);
          showValidationMessage(data.message, 'success', 'emailValidation');
          console.log("이메일 사용 가능:", email);
        } else {
          setButtonError(button);
          showValidationMessage(data.message, 'error', 'emailValidation');
          console.log("이메일 사용 불가:", email);
        }
      })
      .catch(error => {
        console.error('이메일 중복확인 에러:', error);
        setButtonLoading(button, false);
        setButtonError(button);
        showValidationMessage('서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.', 'error', 'emailValidation');
      });
}

// 닉네임 중복확인 - 실제 서버 API 호출
function checkNicknameDuplicate(nickname, button) {
  console.log("닉네임 중복확인 시작:", nickname);

  setButtonLoading(button, true);
  showValidationMessage('닉네임 중복 확인 중...', 'info', 'nicknameValidation');

  // 서버 API 호출
  fetch('/member/check-nickname', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'nickname=' + encodeURIComponent(nickname)
  })
      .then(response => response.json())
      .then(data => {
        setButtonLoading(button, false);

        if (data.success) {
          setButtonSuccess(button);
          showValidationMessage(data.message, 'success', 'nicknameValidation');
          console.log("닉네임 사용 가능:", nickname);
        } else {
          setButtonError(button);
          showValidationMessage(data.message, 'error', 'nicknameValidation');
          console.log("닉네임 사용 불가:", nickname);
        }
      })
      .catch(error => {
        console.error('닉네임 중복확인 에러:', error);
        setButtonLoading(button, false);
        setButtonError(button);
        showValidationMessage('서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.', 'error', 'nicknameValidation');
      });
}

// 버튼 상태 관리 함수들
function setButtonLoading(button, isLoading) {
  if (!button) return;

  if (isLoading) {
    button.classList.add('loading');
    button.disabled = true;
  } else {
    button.classList.remove('loading');
    button.disabled = false;
  }
}

function setButtonSuccess(button) {
  if (!button) return;

  button.classList.remove('loading', 'error');
  button.classList.add('success');
  button.disabled = true;
}

function setButtonError(button) {
  if (!button) return;

  button.classList.remove('loading', 'success');
  button.classList.add('error');
  button.disabled = false;
}

function resetButton(button) {
  if (!button) return;

  button.classList.remove('loading', 'success', 'error');
  button.disabled = false;
  console.log("버튼 상태 초기화됨");
}

// 유효성 검사 메시지 함수들
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
  console.log("폼 초기화");

  const form = document.getElementById('registerForm');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');

  // 비밀번호 확인 실시간 검사
  if (confirmPasswordInput) {
    confirmPasswordInput.addEventListener('input', function() {
      validatePasswordMatch();
    });
  }

  // 폼 제출 이벤트
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      handleFormSubmit();
    });
  }
}

// 비밀번호 관련 기능 초기화
function initPasswordFeatures() {
  console.log("비밀번호 기능 초기화");

  const passwordInput = document.getElementById('password');
  const toggleButton = document.querySelector('.password-toggle');
  const toggleIcon = document.querySelector('.toggle-icon');
  const strengthContainer = document.querySelector('.password-strength');

  // 비밀번호 보기/숨기기 토글
  if (toggleButton && passwordInput && toggleIcon) {
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
  if (passwordInput && strengthContainer) {
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
}

// 비밀번호 강도 업데이트
function updatePasswordStrength(password) {
  const strengthFill = document.querySelector('.strength-fill');
  const strengthText = document.querySelector('.strength-text');

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
  if (!passwordInput) return false;

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

  if (!passwordInput || !confirmPasswordInput) return false;

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
  console.log("폼 유효성 검사 초기화");

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
        if (this.value && !validateEmailFormat(this.value)) {
          this.style.borderColor = '#ef4444';
        } else {
          this.style.borderColor = '#e5e7eb';
        }
      } else if (this.name === 'nickname') {
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
  console.log("폼 제출 처리 시작");

  const form = document.getElementById('registerForm');
  const registerBtn = document.querySelector('.register-btn');
  const termsCheckbox = document.querySelector('input[name="agreeTerms"]');

  // 중복확인 완료 여부 체크
  const emailCheckBtn = document.getElementById('emailCheckBtn');
  const nicknameCheckBtn = document.getElementById('nicknameCheckBtn');

  if (!emailCheckBtn || !emailCheckBtn.classList.contains('success')) {
    showGlobalMessage('이메일 중복확인을 완료해주세요.', 'error');
    return;
  }

  if (!nicknameCheckBtn || !nicknameCheckBtn.classList.contains('success')) {
    showGlobalMessage('닉네임 중복확인을 완료해주세요.', 'error');
    return;
  }

  // 기본 유효성 검사
  const isPasswordValid = validatePasswordStrength();
  const isPasswordMatchValid = validatePasswordMatch();

  // 약관 동의 확인
  if (!termsCheckbox || !termsCheckbox.checked) {
    showGlobalMessage('이용약관에 동의해주세요.', 'error');
    if (termsCheckbox) termsCheckbox.focus();
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
  if (registerBtn) {
    showLoadingState(registerBtn);
  }

  // 실제 폼 제출
  showGlobalMessage('계정 생성 중...', 'info');
  setTimeout(() => {
    form.submit();
  }, 500);
}

// 로딩 상태 표시
function showLoadingState(button) {
  if (!button) return;

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
  console.log("소셜 회원가입 초기화");

  const googleBtn = document.querySelector('.google-btn');
  const githubBtn = document.querySelector('.github-btn');

  if (googleBtn) {
    googleBtn.addEventListener('click', function() {
      showGlobalMessage('Google 회원가입 기능은 준비 중입니다.', 'info');
    });
  }

  if (githubBtn) {
    githubBtn.addEventListener('click', function() {
      showGlobalMessage('GitHub 회원가입 기능은 준비 중입니다.', 'info');
    });
  }
}

// 애니메이션 효과 초기화
function initAnimations() {
  console.log("애니메이션 초기화");

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
    if (e.target.checked && checkmark) {
      checkmark.style.transform = 'scale(1.1)';
      setTimeout(() => {
        checkmark.style.transform = 'scale(1)';
      }, 150);
    }
  }
});

// 전화번호 입력 기능 추가
document.addEventListener('DOMContentLoaded', function() {
  const countrySelect = document.getElementById('countrySelect');
  const phoneInput = document.getElementById('phone');
  const phoneValidation = document.getElementById('phoneValidation');

  // 전화번호 포맷팅 함수
  function formatPhoneNumber(value, format) {
    const digits = value.replace(/\D/g, '');
    let formatted = '';
    let digitIndex = 0;

    for (let i = 0; i < format.length && digitIndex < digits.length; i++) {
      if (format[i] === '0') {
        formatted += digits[digitIndex];
        digitIndex++;
      } else {
        formatted += format[i];
      }
    }

    return formatted;
  }

  // 전화번호 유효성 검사
  function validatePhoneNumber(phoneNumber, countryCode) {
    const digits = phoneNumber.replace(/\D/g, '');

    const patterns = {
      'KR': /^010\d{8}$/,
      'US': /^\d{10}$/,
      'JP': /^\d{10,11}$/,
      'CN': /^\d{11}$/,
      'GB': /^\d{10,11}$/,
      'DE': /^\d{10,12}$/,
      'FR': /^\d{10}$/,
      'AU': /^\d{9}$/,
      'CA': /^\d{10}$/,
      'IN': /^\d{10}$/
    };

    const pattern = patterns[countryCode];
    return pattern ? pattern.test(digits) : digits.length >= 8 && digits.length <= 15;
  }

  // 전화번호 입력 처리
  phoneInput.addEventListener('input', function(e) {
    const selectedOption = countrySelect.options[countrySelect.selectedIndex];
    const format = selectedOption.dataset.format;
    const countryCode = selectedOption.value;

    const formattedValue = formatPhoneNumber(e.target.value, format);
    e.target.value = formattedValue;

    // 실시간 유효성 검사
    const digits = formattedValue.replace(/\D/g, '');

    if (digits.length === 0) {
      phoneValidation.textContent = '';
      phoneValidation.className = 'validation-message';
    } else if (validatePhoneNumber(formattedValue, countryCode)) {
      phoneValidation.textContent = '올바른 전화번호 형식입니다';
      phoneValidation.className = 'validation-message success';
    } else {
      phoneValidation.textContent = `${selectedOption.textContent.split('(')[0].trim()} 형식에 맞게 입력해주세요`;
      phoneValidation.className = 'validation-message error';
    }
  });

  // 국가 변경 시 포맷 업데이트
  countrySelect.addEventListener('change', function() {
    const selectedOption = this.options[this.selectedIndex];
    const format = selectedOption.dataset.format;
    const countryCode = selectedOption.value;

    if (phoneInput.value) {
      const formattedValue = formatPhoneNumber(phoneInput.value, format);
      phoneInput.value = formattedValue;

      // 유효성 재검사
      if (validatePhoneNumber(formattedValue, countryCode)) {
        phoneValidation.textContent = '올바른 전화번호 형식입니다';
        phoneValidation.className = 'validation-message success';
      } else {
        phoneValidation.textContent = `${selectedOption.textContent.split('(')[0].trim()} 형식에 맞게 입력해주세요`;
        phoneValidation.className = 'validation-message error';
      }
    }

    // 플레이스홀더 업데이트
    const placeholders = {
      'KR': '010-1234-5678',
      'US': '(555) 123-4567',
      'JP': '090-1234-5678',
      'CN': '138 0013 8000',
      'GB': '07700 900123',
      'DE': '0151 12345678',
      'FR': '06 12 34 56 78',
      'AU': '0412 345 678',
      'CA': '(604) 123-4567',
      'IN': '98765 43210'
    };

    phoneInput.placeholder = placeholders[countryCode] || '전화번호를 입력하세요';
  });

  // 폼 제출 시 전화번호 유효성 최종 검사
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      const phoneValue = phoneInput.value.trim();

      if (phoneValue) {
        const selectedOption = countrySelect.options[countrySelect.selectedIndex];
        const countryCode = selectedOption.value;

        if (!validatePhoneNumber(phoneValue, countryCode)) {
          e.preventDefault();
          phoneValidation.textContent = '올바른 전화번호를 입력해주세요';
          phoneValidation.className = 'validation-message error';
          phoneInput.focus();
          return false;
        }
      }
    });
  }
});

console.log("회원가입 스크립트 초기화 완료");