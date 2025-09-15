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
});

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
  window.addEventListener('scroll', function() {
    updateNavigationDots();
    addParallaxEffect();
  });
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
    const rate = scrolled * -0.5;
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
      this.style.transform = 'translateY(-2px) scale(1.02)';
    });

    // 마우스 리브 효과
    button.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });

    // 클릭 효과
    button.addEventListener('mousedown', function() {
      this.style.transform = 'translateY(0) scale(0.98)';
    });

    button.addEventListener('mouseup', function() {
      this.style.transform = 'translateY(-2px) scale(1.02)';
    });
  });
}

// 스크롤 진행률 표시 (선택사항)
function initScrollProgress() {
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #007aff, #5ac8fa);
        z-index: 1000;
        transition: width 0.1s ease;
    `;
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', function() {
    const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    progressBar.style.width = scrolled + '%';
  });
}

// 키보드 네비게이션 지원
document.addEventListener('keydown', function(e) {
  // 스페이스바로 스크롤
  if (e.code === 'Space' && !e.target.closest('input, textarea')) {
    e.preventDefault();
    window.scrollBy(0, window.innerHeight * 0.8);
  }

  // 화살표 키로 섹션 이동
  if (e.code === 'ArrowDown') {
    const featuresSection = document.getElementById('features');
    featuresSection.scrollIntoView({ behavior: 'smooth' });
  }

  if (e.code === 'ArrowUp') {
    const heroSection = document.getElementById('hero');
    heroSection.scrollIntoView({ behavior: 'smooth' });
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

// 성능 최적화: 스크롤 이벤트 throttling
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

// 애니메이션 성능 최적화
function optimizeAnimations() {
  // 스크롤 이벤트 최적화
  const throttledScrollHandler = throttle(function() {
    updateNavigationDots();
    addParallaxEffect();
  }, 16); // 60fps

  window.addEventListener('scroll', throttledScrollHandler);
}

// 초기화 완료 후 성능 최적화 적용
window.addEventListener('load', function() {
  optimizeAnimations();
  console.log("페이지 로드 및 최적화 완료");
});