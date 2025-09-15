// Apple-style 회원가입 폼 스크립트
console.log("Apple-style 회원가입 스크립트 로드 완료.");

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('registerForm');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const emailInput = document.getElementById('email');
  const nicknameInput = document.getElementById('nickname');

  // 실시간 비밀번호 확인
  function validatePasswordMatch() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (confirmPassword && password !== confirmPassword) {
      confirmPasswordInput.setCustomValidity('비밀번호가 일치하지 않습니다.');
      confirmPasswordInput.style.borderColor = '#ff3b30';
    } else {
      confirmPasswordInput.setCustomValidity('');
      confirmPasswordInput.style.borderColor = '';
    }
  }

  // 비밀번호 강도 검사
  function validatePasswordStrength() {
    const password = passwordInput.value;
    const minLength = 8;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      passwordInput.setCustomValidity(`비밀번호는 최소 ${minLength}자 이상이어야 합니다.`);
      passwordInput.style.borderColor = '#ff3b30';
      return false;
    }

    if (!hasLetter || !hasNumber) {
      passwordInput.setCustomValidity('비밀번호는 영문자와 숫자를 포함해야 합니다.');
      passwordInput.style.borderColor = '#ff9500';
      return false;
    }

    passwordInput.setCustomValidity('');
    passwordInput.style.borderColor = '#34c759';
    return true;
  }

  // 이메일 형식 검사
  function validateEmail() {
    const email = emailInput.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email && !emailRegex.test(email)) {
      emailInput.setCustomValidity('올바른 이메일 형식을 입력해주세요.');
      emailInput.style.borderColor = '#ff3b30';
      return false;
    }

    emailInput.setCustomValidity('');
    emailInput.style.borderColor = '';
    return true;
  }

  // 닉네임 형식 검사 (2-20자, 특수문자 제한)
  function validateNickname() {
    const nickname = nicknameInput.value;
    const nicknameRegex = /^[a-zA-Z0-9가-힣_]{2,20}$/;

    if (nickname && !nicknameRegex.test(nickname)) {
      nicknameInput.setCustomValidity('닉네임은 2-20자의 영문, 한글, 숫자, 언더스코어만 사용 가능합니다.');
      nicknameInput.style.borderColor = '#ff3b30';
      return false;
    }

    nicknameInput.setCustomValidity('');
    nicknameInput.style.borderColor = '';
    return true;
  }

  // 부드러운 스크롤 효과
  function smoothScrollToError() {
    const firstInvalidField = form.querySelector(':invalid');
    if (firstInvalidField) {
      firstInvalidField.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      firstInvalidField.focus();
    }
  }

  // 입력 필드 포커스 효과
  function addInputEffects() {
    const inputs = form.querySelectorAll('input');

    inputs.forEach(input => {
      input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
        this.parentElement.style.transition = 'transform 0.3s ease';
      });

      input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
        setTimeout(() => {
          this.parentElement.style.transition = '';
        }, 300);
      });
    });
  }

  // 제출 버튼 로딩 효과
  function showLoadingState() {
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;

    submitBtn.textContent = '처리 중...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';

    // 3초 후 원래 상태로 복구 (실제로는 서버 응답을 기다려야 함)
    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
    }, 3000);
  }

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
});

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