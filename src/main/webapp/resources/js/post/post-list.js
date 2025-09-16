// 전역 변수
let isSearchVisible = false;
let currentSort = 'latest';

// DOM 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', function() {
  initializePostList();
  setupEventListeners();
  setupScrollEvents();
});

// 게시글 목록 초기화
function initializePostList() {
  // 현재 정렬 상태 복원
  const urlParams = new URLSearchParams(window.location.search);
  currentSort = urlParams.get('sort') || 'latest';

  // 정렬 선택박스 설정
  const sortSelect = document.querySelector('.sort-select');
  if (sortSelect) {
    sortSelect.value = currentSort;
  }

  // 검색 키워드가 있다면 검색 패널 표시
  const keyword = urlParams.get('keyword');
  if (keyword) {
    toggleSearch(true);
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
      searchInput.value = keyword;
    }
  }

  // 게시글 카드 애니메이션
  animatePostCards();
}

// 이벤트 리스너 설정
function setupEventListeners() {
  // 게시글 카드 클릭 이벤트
  document.querySelectorAll('.post-card').forEach(card => {
    card.addEventListener('click', function(e) {
      // 북마크 버튼 클릭 시 이벤트 버블링 방지
      if (e.target.closest('.action-bookmark')) {
        e.stopPropagation();
        return;
      }

      const postId = this.dataset.postId;
      if (postId) {
        viewPost(postId);
      }
    });

    // 호버 효과
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-4px)';
    });

    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });

  // 검색 폼 이벤트
  const searchForm = document.querySelector('.search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      performSearch();
    });
  }

  // 검색 입력 필드 엔터 키 이벤트
  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        performSearch();
      }
    });

    // 실시간 검색 (디바운싱)
    let searchTimeout;
    searchInput.addEventListener('input', function() {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        // 여기에 실시간 검색 로직 추가 가능
      }, 500);
    });
  }
}

// 스크롤 이벤트 설정
function setupScrollEvents() {
  let ticking = false;

  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(function() {
        updateScrollElements();
        ticking = false;
      });
      ticking = true;
    }
  });
}

// 스크롤 관련 요소 업데이트
function updateScrollElements() {
  const scrollTop = window.pageYOffset;
  const navbar = document.querySelector('.main-navbar');
  const scrollToTopBtn = document.querySelector('.scroll-to-top');

  // 네비게이션 바 투명도 조정
  if (navbar) {
    if (scrollTop > 100) {
      navbar.style.background = 'rgba(30, 41, 59, 0.98)';
    } else {
      navbar.style.background = 'rgba(30, 41, 59, 0.95)';
    }
  }

  // 맨 위로 버튼 표시/숨김
  if (scrollToTopBtn) {
    if (scrollTop > 500) {
      scrollToTopBtn.style.opacity = '1';
      scrollToTopBtn.style.visibility = 'visible';
    } else {
      scrollToTopBtn.style.opacity = '0';
      scrollToTopBtn.style.visibility = 'hidden';
    }
  }
}

// 게시글 카드 애니메이션
function animatePostCards() {
  const cards = document.querySelectorAll('.post-card');

  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';

    setTimeout(() => {
      card.style.transition = 'all 0.6s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, index * 100);
  });
}

// 검색 패널 토글
function toggleSearch(forceShow = false) {
  const searchPanel = document.getElementById('searchPanel');
  const searchToggle = document.querySelector('.search-toggle');

  if (!searchPanel) return;

  if (forceShow || !isSearchVisible) {
    searchPanel.classList.add('active');
    isSearchVisible = true;

    if (searchToggle) {
      searchToggle.style.background = 'rgba(59, 130, 246, 0.2)';
      searchToggle.style.color = '#3b82f6';
    }

    // 검색 입력 필드에 포커스
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
      setTimeout(() => searchInput.focus(), 300);
    }
  } else {
    searchPanel.classList.remove('active');
    isSearchVisible = false;

    if (searchToggle) {
      searchToggle.style.background = 'rgba(148, 163, 184, 0.1)';
      searchToggle.style.color = '#94a3b8';
    }
  }
}

// 검색 수행
function performSearch() {
  const searchForm = document.querySelector('.search-form');
  const searchType = document.querySelector('select[name="searchType"]')?.value || 'all';
  const keyword = document.querySelector('input[name="keyword"]')?.value?.trim();

  if (!keyword) {
    showNotification('검색어를 입력해주세요.', 'warning');
    return;
  }

  // URL 파라미터 구성
  const params = new URLSearchParams();
  params.set('searchType', searchType);
  params.set('keyword', keyword);
  params.set('page', '1'); // 검색 시 첫 페이지로

  // 기존 정렬 유지
  if (currentSort && currentSort !== 'latest') {
    params.set('sort', currentSort);
  }

  // 페이지 이동
  window.location.href = `/posts?${params.toString()}`;
}

// 정렬 순서 변경
function changeSortOrder(sortType) {
  if (sortType === currentSort) return;

  currentSort = sortType;

  // URL 파라미터 구성
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set('sort', sortType);
  urlParams.set('page', '1'); // 정렬 변경 시 첫 페이지로

  // 페이지 이동
  window.location.href = `/posts?${urlParams.toString()}`;
}

// 게시글 보기
function viewPost(postId) {
  if (!postId) return;

  // 로딩 표시
  showNotification('게시글을 로드하는 중...', 'info');

  // 게시글 상세 페이지로 이동
  window.location.href = `/posts/${postId}`;
}

// 북마크 토글
function toggleBookmark(postId) {
  if (!postId) return;

  // 로그인 확인
  if (!isLoggedIn()) {
    showNotification('로그인이 필요한 기능입니다.', 'warning');
    return;
  }

  const bookmarkBtn = document.querySelector(`[data-post-id="${postId}"] .action-bookmark`);
  if (!bookmarkBtn) return;

  const icon = bookmarkBtn.querySelector('.bookmark-icon');
  const isBookmarked = icon.textContent === '📗';

  // UI 즉시 업데이트
  icon.textContent = isBookmarked ? '📖' : '📗';
  bookmarkBtn.style.color = isBookmarked ? '#94a3b8' : '#3b82f6';

  // 서버에 요청 (실제 구현에서)
  // fetch(`/api/posts/${postId}/bookmark`, { method: 'POST' })
  //     .then(response => response.json())
  //     .then(data => {
  //         if (!data.success) {
  //             // 실패 시 원래 상태로 복원
  //             icon.textContent = isBookmarked ? '📗' : '📖';
  //             bookmarkBtn.style.color = isBookmarked ? '#3b82f6' : '#94a3b8';
  //             showNotification('북마크 처리에 실패했습니다.', 'error');
  //         }
  //     })
  //     .catch(error => {
  //         // 오류 시 원래 상태로 복원
  //         icon.textContent = isBookmarked ? '📗' : '📖';
  //         bookmarkBtn.style.color = isBookmarked ? '#3b82f6' : '#94a3b8';
  //         showNotification('네트워크 오류가 발생했습니다.', 'error');
  //     });

  showNotification(
      isBookmarked ? '북마크가 해제되었습니다.' : '북마크에 추가되었습니다.',
      'success'
  );
}

// 맨 위로 스크롤
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// 로그인 상태 확인
function isLoggedIn() {
  // 실제 구현에서는 세션 체크 등을 수행
  return document.querySelector('.nav-user-info') !== null;
}

// 알림 표시
function showNotification(message, type = 'info') {
  // 기존 알림 제거
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  // 알림 요소 생성
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;

  // 스타일 적용
  Object.assign(notification.style, {
    position: 'fixed',
    top: '80px',
    right: '20px',
    padding: '12px 20px',
    background: getNotificationColor(type),
    color: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    zIndex: '10000',
    transform: 'translateX(100%)',
    transition: 'transform 0.3s ease',
    backdropFilter: 'blur(8px)'
  });

  // DOM에 추가
  document.body.appendChild(notification);

  // 애니메이션으로 표시
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);

  // 자동 제거
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// 알림 아이콘 반환
function getNotificationIcon(type) {
  switch (type) {
    case 'success': return '✅';
    case 'error': return '❌';
    case 'warning': return '⚠️';
    case 'info': return 'ℹ️';
    default: return 'ℹ️';
  }
}

// 알림 색상 반환
function getNotificationColor(type) {
  switch (type) {
    case 'success': return 'rgba(34, 197, 94, 0.9)';
    case 'error': return 'rgba(239, 68, 68, 0.9)';
    case 'warning': return 'rgba(245, 158, 11, 0.9)';
    case 'info': return 'rgba(59, 130, 246, 0.9)';
    default: return 'rgba(59, 130, 246, 0.9)';
  }
}

// 디바운스 유틸리티 함수
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// 스로틀 유틸리티 함수
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// 에러 처리
window.addEventListener('error', function(e) {
  console.error('JavaScript Error:', e.error);
});

// 모바일 환경 체크
function isMobile() {
  return window.innerWidth <= 768;
}

// 반응형 처리
window.addEventListener('resize', debounce(function() {
  // 모바일/데스크톱 전환 시 처리할 로직
  if (isMobile() && isSearchVisible) {
    // 모바일에서는 검색 패널을 전체 화면으로
    const searchPanel = document.getElementById('searchPanel');
    if (searchPanel) {
      searchPanel.style.position = 'fixed';
      searchPanel.style.top = '60px';
      searchPanel.style.left = '0';
      searchPanel.style.right = '0';
      searchPanel.style.zIndex = '1001';
    }
  }
}, 250));