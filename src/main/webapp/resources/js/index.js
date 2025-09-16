// Apple-style 메인 페이지 스크립트
console.log("PlayGround 메인 페이지 로드 완료.");

document.addEventListener('DOMContentLoaded', function() {
  // 네비게이션 도트 기능
  initNavigationDots();

  // 스크롤 이벤트 리스너
  initScrollEffects();

  // 페이지 로드 애니메이션
  initLoadAnimations();

  // 기능 카드 스크롤 애니메이션
  initFeatureCardsAnimation();

  // 버튼 인터랙션 효과
  initButtonEffects();

  // 환영 메시지 자동 닫기
  initWelcomeMessage();

  // 상단 네비게이션 기능
  initTopNavigation();

  // 빠른 액션 카드 애니메이션
  initQuickActions();

  // 게시판 버튼 특별 처리
  initPostsButtons();
});

// 게시판 버튼 특별 처리
function initPostsButtons() {
  const postsButtons = document.querySelectorAll('a[href*="/posts"]');

  postsButtons.forEach(button => {
    // 게시판 버튼에 특별한 스타일 적용
    if (button.classList.contains('btn-primary')) {
      button.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      button.style.boxShadow = '0 4px 20px rgba(16, 185, 129, 0.3)';
    }

    // 클릭 시 로딩 효과
    button.addEventListener('click', function(e) {
      // 로딩 상태 표시
      const originalText = this.innerHTML;
      this.innerHTML = '<span class="btn-icon">📝</span> 게시판 로딩 중...';
      this.style.pointerEvents = 'none';

      // 약간의 딜레이 후 이동 (UX 개선)
      setTimeout(() => {
        window.location.href = this.href;
      }, 300);
    });

    // 호버 시 추가 효과
    button.addEventListener('mouseenter', function() {
      if (this.classList.contains('btn-primary')) {
        this.style.transform = 'translateY(-3px) scale(1.02)';
        this.style.boxShadow = '0 8px 30px rgba(16, 185, 129, 0.4)';
      }
    });

    button.addEventListener('mouseleave', function() {
      if (this.classList.contains('btn-primary')) {
        this.style.transform = 'translateY(-2px) scale(1)';
        this.style.boxShadow = '0 4px 20px rgba(16, 185, 129, 0.3)';
      }
    });
  });

  // 게시판 액션 카드 특별 처리
  const postsActionCard = document.querySelector('.action-card[data-href*="/posts"]');
  if (postsActionCard) {
    postsActionCard.addEventListener('mouseenter', function() {
      this.style.background = 'rgba(16, 185, 129, 0.1)';
      this.style.borderColor = 'rgba(16, 185, 129, 0.4)';
      this.style.transform = 'translateY(-6px) scale(1.02)';
    });

    postsActionCard.addEventListener('mouseleave', function() {
      this.style.background = 'rgba(255, 255, 255, 0.05)';
      this.style.borderColor = 'rgba(255, 255, 255, 0.1)';
      this.style.transform = 'translateY(0) scale(1)';
    });
  }
}

// 환영 메시지 관리
function initWelcomeMessage() {
  const welcomeMessage = document.getElementById('welcomeMessage');
  if (welcomeMessage) {
    // 5초 후 자동으로 닫기
    setTimeout(() => {
      closeWelcomeMessage();
    }, 5000);
  }
}

// 환영 메시지 닫기 함수 (전역 함수로 선언)
function closeWelcomeMessage() {
  const welcomeMessage = document.getElementById('welcomeMessage');
  if (welcomeMessage) {
    welcomeMessage.classList.add('fade-out');
    setTimeout(() => {
      welcomeMessage.remove();
    }, 300);
  }
}

// 상단 네비게이션 초기화
function initTopNavigation() {
  const navbar = document.querySelector('.top-navbar');
  if (!navbar) return;

  // 스크롤에 따른 네비게이션 바 스타일 변경
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', function() {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 50) {
      navbar.style.background = 'rgba(0, 0, 0, 0.98)';
      navbar.style.borderBottomColor = 'rgba(255, 255, 255, 0.2)';
    } else {
      navbar.style.background = 'rgba(0, 0, 0, 0.95)';
      navbar.style.borderBottomColor = 'rgba(255, 255, 255, 0.1)';
    }

    // 스크롤 방향에 따른 네비게이션 바 숨김/표시
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      // 아래로 스크롤 - 네비게이션 바 숨김
      navbar.style.transform = 'translateY(-100%)';
    } else {
      // 위로 스크롤 - 네비게이션 바 표시
      navbar.style.transform = 'translateY(0)';
    }

    lastScrollY = currentScrollY;
  });

  // 네비게이션 버튼 클릭 효과
  const navButtons = document.querySelectorAll('.nav-btn');
  navButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      // 로그아웃 버튼 클릭 시 확인 대화상자
      if (this.classList.contains('nav-btn-logout')) {
        if (!confirm('정말 로그아웃하시겠습니까?')) {
          e.preventDefault();
          return false;
        }
      }

      // 게시판 버튼 클릭 시 특별 처리
      if (this.classList.contains('nav-btn-posts')) {
        const originalText = this.innerHTML;
        this.innerHTML = '<span class="btn-icon">📝</span> 이동 중...';
        this.style.pointerEvents = 'none';

        setTimeout(() => {
          window.location.href = this.href;
        }, 200);

        e.preventDefault();
        return false;
      }

      // 클릭 애니메이션
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = '';
      }, 150);
    });
  });
}

// 빠른 액션 카드 애니메이션
function initQuickActions() {
  const actionCards = document.querySelectorAll('.action-card');

  if (actionCards.length === 0) return;

  // 카드 호버 효과 개선
  actionCards.forEach((card, index) => {
    // 초기 애니메이션
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease';

    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 800 + (index * 200));

    // 마우스 이벤트
    card.addEventListener('mouseenter', function() {
      if (this.dataset.href && this.dataset.href.includes('/posts')) {
        this.style.transform = 'translateY(-8px) scale(1.02)';
        this.style.background = 'rgba(16, 185, 129, 0.1)';
        this.style.borderColor = 'rgba(16, 185, 129, 0.4)';
      } else {
        this.style.transform = 'translateY(-8px) scale(1.02)';
      }
    });

    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
      if (this.dataset.href && this.dataset.href.includes('/posts')) {
        this.style.background = 'rgba(255, 255, 255, 0.05)';
        this.style.borderColor = 'rgba(255, 255, 255, 0.1)';
      }
    });

    // 카드 클릭 시 해당 링크로 이동
    card.addEventListener('click', function(e) {
      // 링크 클릭이 아닌 카드 자체 클릭일 때만 처리
      if (e.target === this || e.target.closest('.action-card') === this) {
        const actionLink = this.querySelector('.action-link');
        if (actionLink) {
          e.preventDefault();

          // 게시판 카드 클릭 시 특별 효과
          if (this.dataset.href && this.dataset.href.includes('/posts')) {
            this.style.background = 'rgba(16, 185, 129, 0.2)';
            this.style.transform = 'scale(0.98)';

            setTimeout(() => {
              if (actionLink.getAttribute('href').startsWith('#')) {
                // 앵커 링크인 경우 부드러운 스크롤
                const targetId = actionLink.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                  targetElement.scrollIntoView({ behavior: 'smooth' });
                }
              } else {
                // 일반 링크인 경우 페이지 이동
                showNotification('게시판으로 이동 중...', 'info', 1000);
                setTimeout(() => {
                  window.location.href = actionLink.getAttribute('href');
                }, 200);
              }
            }, 150);
          } else {
            // 다른 카드들의 일반적인 처리
            if (actionLink.getAttribute('href').startsWith('#')) {
              const targetId = actionLink.getAttribute('href').substring(1);
              const targetElement = document.getElementById(targetId);
              if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
              }
            } else {
              window.location.href = actionLink.getAttribute('href');
            }
          }
        }
      }
    });
  });
}

// 네비게이션 도트 초기화
function initNavigationDots() {
  const navDots = document.querySelectorAll('.nav-dot');

  navDots.forEach(dot => {
    dot.addEventListener('click', function() {
      const sectionId = this.dataset.section;
      const section = document.getElementById(sectionId);

      if (section) {
        section.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// 스크롤 효과 초기화
function initScrollEffects() {
  window.addEventListener('scroll', throttle(function() {
    updateNavigationDots();
    addParallaxEffect();
  }, 16));
}

// 네비게이션 도트 업데이트
function updateNavigationDots() {
  const heroSection = document.getElementById('hero');
  const featuresSection = document.getElementById('features');
  const scrollPosition = window.scrollY + window.innerHeight / 2;

  const dots = document.querySelectorAll('.nav-dot');
  dots.forEach(dot => dot.classList.remove('active'));

  if (scrollPosition < featuresSection.offsetTop) {
    const heroDot = document.querySelector('[data-section="hero"]');
    if (heroDot) heroDot.classList.add('active');
  } else {
    const featuresDot = document.querySelector('[data-section="features"]');
    if (featuresDot) featuresDot.classList.add('active');
  }
}

// 패럴랙스 효과
function addParallaxEffect() {
  const scrolled = window.pageYOffset;
  const heroSection = document.querySelector('.hero-section');

  if (heroSection) {
    const rate = scrolled * -0.3;
    heroSection.style.transform = `translateY(${rate}px)`;
  }
}

// 페이지 로드 애니메이션 초기화
function initLoadAnimations() {
  // 초기 애니메이션을 위한 CSS 설정
  const elements = document.querySelectorAll('.logo, .tagline, .subtitle, .cta-buttons');
  elements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.8s ease';
  });

  // 페이지 로드 후 애니메이션 실행
  window.addEventListener('load', function() {
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, index * 200);
    });
  });
}

// 기능 카드 스크롤 애니메이션
function initFeatureCardsAnimation() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  document.querySelectorAll('.feature-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px)';
    card.style.transition = `all 0.8s ease ${index * 0.2}s`;
    observer.observe(card);
  });
}

// 버튼 인터랙션 효과
function initButtonEffects() {
  const buttons = document.querySelectorAll('.btn');

  buttons.forEach(button => {
    // 마우스 엔터 효과
    button.addEventListener('mouseenter', function() {
      if (this.href && this.href.includes('/posts')) {
        this.style.transform = 'translateY(-3px) scale(1.02)';
        this.style.boxShadow = '0 8px 30px rgba(16, 185, 129, 0.4)';
      } else {
        this.style.transform = 'translateY(-2px) scale(1.02)';
      }
    });

    // 마우스 리브 효과
    button.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
      if (this.href && this.href.includes('/posts')) {
        this.style.boxShadow = '0 4px 20px rgba(16, 185, 129, 0.3)';
      }
    });

    // 클릭 효과
    button.addEventListener('mousedown', function() {
      this.style.transform = 'translateY(0) scale(0.98)';
    });

    button.addEventListener('mouseup', function() {
      if (this.href && this.href.includes('/posts')) {
        this.style.transform = 'translateY(-3px) scale(1.02)';
      } else {
        this.style.transform = 'translateY(-2px) scale(1.02)';
      }
    });
  });
}

// 키보드 네비게이션 지원
document.addEventListener('keydown', function(e) {
  // P 키로 게시판 바로가기
  if (e.key === 'p' || e.key === 'P') {
    if (!e.target.closest('input, textarea')) {
      e.preventDefault();
      showNotification('게시판으로 이동합니다...', 'info', 1000);
      setTimeout(() => {
        window.location.href = '/posts';
      }, 300);
    }
  }

  // 스페이스바로 스크롤
  if (e.code === 'Space' && !e.target.closest('input, textarea')) {
    e.preventDefault();
    window.scrollBy(0, window.innerHeight * 0.8);
  }

  // 화살표 키로 섹션 이동
  if (e.code === 'ArrowDown') {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  if (e.code === 'ArrowUp') {
    const heroSection = document.getElementById('hero');
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // ESC 키로 환영 메시지 닫기
  if (e.code === 'Escape') {
    closeWelcomeMessage();
  }
});

// 모바일 터치 제스처 지원
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', function(e) {
  touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', function(e) {
  touchEndY = e.changedTouches[0].screenY;
  handleSwipe();
});

function handleSwipe() {
  const swipeThreshold = 50;
  const diff = touchStartY - touchEndY;

  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      // 위로 스와이프 - 다음 섹션
      const featuresSection = document.getElementById('features');
      if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // 아래로 스와이프 - 이전 섹션
      const heroSection = document.getElementById('hero');
      if (heroSection) {
        heroSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
}

// 성능 최적화: throttle 함수
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

// 알림 메시지 표시 함수
function showNotification(message, type = 'info', duration = 3000) {
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
      notification.style.background = 'linear-gradient(135deg, #10b981, #059669)';
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

// 사용자 인터랙션 추적 (분석용)
function trackUserInteraction(action, element) {
  console.log(`User Action: ${action} on ${element}`);
  // 여기에 실제 분석 코드를 추가할 수 있습니다.
}

// 초기화 완료 후 실행
window.addEventListener('load', function() {
  console.log("페이지 로드 및 최적화 완료");

  // 사용자에게 환영 메시지 표시 (로그인하지 않은 경우)
  const isLoggedIn = document.querySelector('.top-navbar');
  if (!isLoggedIn) {
    setTimeout(() => {
      showNotification('PlayGround에 오신 것을 환영합니다! 🎉\nP키를 눌러 게시판으로 바로 이동하세요!', 'info', 5000);
    }, 2000);
  } else {
    // 로그인한 사용자에게 단축키 안내
    setTimeout(() => {
      showNotification('P키를 눌러 게시판으로 빠르게 이동할 수 있습니다! 📝', 'info', 4000);
    }, 3000);
  }
});