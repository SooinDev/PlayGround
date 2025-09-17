// 전역 변수
let isLiked = false;
let isBookmarked = false;
let commentCharCount = 0;

// DOM 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', function() {
  initializePostDetail();
  setupEventListeners();
  setupScrollEvents();
  initializeComments();
});

// 게시글 상세 페이지 초기화
function initializePostDetail() {
  // 코드 블록 하이라이팅
  highlightCodeBlocks();

  // 외부 링크 새 창에서 열기
  setupExternalLinks();

  // 이미지 지연 로딩
  setupLazyLoading();

  // 반응 상태 복원
  restoreReactionStates();

  // 페이지 애니메이션
  animatePageLoad();
}

// 이벤트 리스너 설정
function setupEventListeners() {
  // 댓글 입력 필드 이벤트
  const commentTextarea = document.querySelector('.comment-textarea');
  if (commentTextarea) {
    commentTextarea.addEventListener('input', updateCommentCharCount);
    commentTextarea.addEventListener('keydown', handleCommentKeydown);
  }

  // 반응 버튼 이벤트
  setupReactionButtons();

  // 삭제 버튼 이벤트
  const deleteBtn = document.querySelector('.delete-btn');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const postId = getPostIdFromUrl();
      confirmDeletePost(postId);
    });
  }

  // 댓글 폼 이벤트
  const commentForm = document.querySelector('.comment-form');
  if (commentForm) {
    commentForm.addEventListener('submit', submitComment);
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

// 댓글 시스템 초기화
function initializeComments() {
  updateCommentCharCount();
}

// 반응 버튼 설정
function setupReactionButtons() {
  const likeBtn = document.querySelector('.like-btn');
  const bookmarkBtn = document.querySelector('.bookmark-btn');
  const shareBtn = document.querySelector('.share-btn');

  if (likeBtn) {
    likeBtn.addEventListener('click', function() {
      const postId = getPostIdFromUrl();
      toggleLike(postId);
    });
  }

  if (bookmarkBtn) {
    bookmarkBtn.addEventListener('click', function() {
      const postId = getPostIdFromUrl();
      toggleBookmark(postId);
    });
  }

  if (shareBtn) {
    shareBtn.addEventListener('click', function() {
      const postId = getPostIdFromUrl();
      sharePost(postId);
    });
  }
}

// URL에서 게시글 ID 추출
function getPostIdFromUrl() {
  const path = window.location.pathname;
  const matches = path.match(/\/posts\/(\d+)/);
  return matches ? parseInt(matches[1]) : null;
}

// 로그인 상태 확인
function isLoggedIn() {
  return document.querySelector('.nav-user-info') !== null ||
      document.querySelector('.comment-form-container') !== null;
}

// 댓글 글자 수 업데이트
function updateCommentCharCount() {
  const textarea = document.querySelector('.comment-textarea');
  const charCount = document.querySelector('.char-count');

  if (textarea && charCount) {
    const count = textarea.value.length;
    commentCharCount = count;
    charCount.textContent = `${count}/500`;

    // 글자 수에 따른 색상 변경
    if (count > 450) {
      charCount.style.color = '#ff3b30';
    } else if (count > 400) {
      charCount.style.color = '#ffcc00';
    } else {
      charCount.style.color = '#86868b';
    }
  }
}

// 댓글 입력 키보드 이벤트
function handleCommentKeydown(event) {
  // Ctrl+Enter 또는 Cmd+Enter로 댓글 제출
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
    event.preventDefault();
    const form = event.target.closest('.comment-form');
    if (form) {
      submitComment({ target: form, preventDefault: () => {} });
    }
  }
}

// 스크롤 관련 요소 업데이트
function updateScrollElements() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollToTopBtn = document.querySelector('.scroll-to-top');

  if (scrollToTopBtn) {
    if (scrollTop > 300) {
      scrollToTopBtn.style.opacity = '1';
      scrollToTopBtn.style.pointerEvents = 'auto';
    } else {
      scrollToTopBtn.style.opacity = '0.6';
      scrollToTopBtn.style.pointerEvents = 'auto';
    }
  }
}

// 코드 블록 하이라이팅
function highlightCodeBlocks() {
  const codeBlocks = document.querySelectorAll('pre code');
  codeBlocks.forEach(block => {
    block.classList.add('highlighted');
  });
}

// 외부 링크 설정
function setupExternalLinks() {
  const links = document.querySelectorAll('.content-body a[href^="http"]');
  links.forEach(link => {
    if (!link.hostname.includes(window.location.hostname)) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
      link.setAttribute('title', '외부 링크');
    }
  });
}

// 이미지 지연 로딩 설정
function setupLazyLoading() {
  const images = document.querySelectorAll('.content-body img[data-src]');

  if ('IntersectionObserver' in window && images.length > 0) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        }
      });
    });

    images.forEach(img => {
      imageObserver.observe(img);
    });
  }
}

// 반응 상태 복원
function restoreReactionStates() {
  const postId = getPostIdFromUrl();
  if (postId && isLoggedIn()) {
    // 실제 구현에서는 서버 API 호출로 사용자의 반응 상태 복원
    // fetch(`/api/posts/${postId}/reactions`)
    //   .then(response => response.json())
    //   .then(data => {
    //     if (data.liked) toggleLikeUI(true);
    //     if (data.bookmarked) toggleBookmarkUI(true);
    //   });
  }
}

// 페이지 로드 애니메이션
function animatePageLoad() {
  const postDetail = document.querySelector('.post-detail');
  const commentsSection = document.querySelector('.comments-section');

  if (postDetail) {
    postDetail.style.opacity = '0';
    postDetail.style.transform = 'translateY(20px)';

    setTimeout(() => {
      postDetail.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      postDetail.style.opacity = '1';
      postDetail.style.transform = 'translateY(0)';
    }, 100);
  }

  if (commentsSection) {
    commentsSection.style.opacity = '0';
    commentsSection.style.transform = 'translateY(20px)';

    setTimeout(() => {
      commentsSection.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      commentsSection.style.opacity = '1';
      commentsSection.style.transform = 'translateY(0)';
    }, 300);
  }
}

// 좋아요 토글
function toggleLike(postId) {
  if (!postId) return;

  if (!isLoggedIn()) {
    showNotification('로그인이 필요한 기능입니다.', 'warning');
    return;
  }

  const likeBtn = document.querySelector('.like-btn');
  if (!likeBtn) return;

  const icon = likeBtn.querySelector('.reaction-icon');

  // UI 즉시 업데이트
  if (isLiked) {
    icon.textContent = '🤍';
    likeBtn.classList.remove('active');
    isLiked = false;
    showNotification('좋아요를 취소했습니다.', 'info');
  } else {
    icon.textContent = '❤️';
    likeBtn.classList.add('active');
    isLiked = true;
    showNotification('좋아요를 눌렀습니다!', 'success');
  }

  // 실제 구현에서 서버에 요청
  /*
  fetch(`/api/posts/${postId}/like`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  .then(response => response.json())
  .then(data => {
    if (!data.success) {
      // 실패 시 원래 상태로 복원
      toggleLike(postId);
      showNotification('좋아요 처리에 실패했습니다.', 'error');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    showNotification('네트워크 오류가 발생했습니다.', 'error');
  });
  */
}

// 북마크 토글
function toggleBookmark(postId) {
  if (!postId) return;

  if (!isLoggedIn()) {
    showNotification('로그인이 필요한 기능입니다.', 'warning');
    return;
  }

  const bookmarkBtn = document.querySelector('.bookmark-btn');
  if (!bookmarkBtn) return;

  const icon = bookmarkBtn.querySelector('.reaction-icon');

  // UI 즉시 업데이트
  if (isBookmarked) {
    icon.textContent = '📖';
    bookmarkBtn.classList.remove('active');
    isBookmarked = false;
    showNotification('북마크가 해제되었습니다.', 'info');
  } else {
    icon.textContent = '📗';
    bookmarkBtn.classList.add('active');
    isBookmarked = true;
    showNotification('북마크에 추가되었습니다.', 'success');
  }
}

// 게시글 공유
function sharePost(postId) {
  const url = window.location.href;
  const title = document.querySelector('.post-title')?.textContent || '게시글';

  if (navigator.share) {
    // Web Share API 사용 (모바일)
    navigator.share({
      title: title,
      url: url
    }).then(() => {
      showNotification('공유되었습니다!', 'success');
    }).catch(err => {
      if (err.name !== 'AbortError') {
        copyToClipboard(url);
      }
    });
  } else {
    // 클립보드에 복사
    copyToClipboard(url);
  }
}

// 클립보드에 복사
function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      showNotification('링크가 클립보드에 복사되었습니다!', 'success');
    }).catch(err => {
      fallbackCopyToClipboard(text);
    });
  } else {
    fallbackCopyToClipboard(text);
  }
}

// 클립보드 복사 폴백
function fallbackCopyToClipboard(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand('copy');
    showNotification('링크가 클립보드에 복사되었습니다!', 'success');
  } catch (err) {
    showNotification('복사에 실패했습니다. 수동으로 복사해주세요.', 'error');
  }

  document.body.removeChild(textArea);
}

// 게시글 삭제 확인
function confirmDeletePost(postId) {
  if (!postId) return;

  const confirmed = confirm('정말로 이 게시글을 삭제하시겠습니까?\n삭제된 게시글은 복구할 수 없습니다.');

  if (confirmed) {
    deletePost(postId);
  }
}

// 게시글 삭제
function deletePost(postId) {
  showNotification('게시글을 삭제하는 중...', 'info');

  // 실제 삭제 폼 제출
  const deleteForm = document.querySelector('#deleteForm');
  if (deleteForm) {
    deleteForm.submit();
  } else {
    // 폼이 없다면 직접 POST 요청
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = `/posts/${postId}/delete`;
    form.style.display = 'none';
    document.body.appendChild(form);
    form.submit();
  }
}

// 댓글 제출
function submitComment(event) {
  event.preventDefault();

  const form = event.target;
  const textarea = form.querySelector('.comment-textarea');
  const isSecret = form.querySelector('input[name="isSecret"]')?.checked || false;
  const content = textarea.value.trim();

  if (!content) {
    showNotification('댓글 내용을 입력해주세요.', 'warning');
    textarea.focus();
    return;
  }

  if (content.length < 2) {
    showNotification('댓글은 2자 이상 입력해주세요.', 'warning');
    textarea.focus();
    return;
  }

  if (!isLoggedIn()) {
    showNotification('로그인이 필요한 기능입니다.', 'warning');
    return;
  }

  // 제출 버튼 비활성화
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = '작성 중...';

  // 실제 구현에서는 서버에 댓글 전송
  setTimeout(() => {
    showNotification('댓글이 작성되었습니다!', 'success');
    resetCommentForm();

    // 제출 버튼 복원
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;

    // 댓글 개수 업데이트
    updateCommentCount();
  }, 1000);
}

// 댓글 폼 초기화
function resetCommentForm() {
  const textarea = document.querySelector('.comment-textarea');
  const isSecretCheckbox = document.querySelector('input[name="isSecret"]');
  const charCount = document.querySelector('.char-count');

  if (textarea) {
    textarea.value = '';
  }
  if (isSecretCheckbox) {
    isSecretCheckbox.checked = false;
  }
  if (charCount) {
    charCount.textContent = '0/500';
    charCount.style.color = '#86868b';
  }

  commentCharCount = 0;
}

// 댓글 개수 업데이트
function updateCommentCount() {
  const commentCountElement = document.querySelector('.comment-count');
  const statNumberElement = document.querySelector('.stat-item .stat-number');

  if (commentCountElement) {
    let currentCount = parseInt(commentCountElement.textContent) || 0;
    commentCountElement.textContent = currentCount + 1;
  }

  if (statNumberElement && statNumberElement.parentElement.querySelector('.stat-icon')?.textContent === '💬') {
    let currentCount = parseInt(statNumberElement.textContent) || 0;
    statNumberElement.textContent = currentCount + 1;
  }
}

// 날짜 포맷팅
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;

  // 1분 미만
  if (diff < 60000) {
    return '방금 전';
  }
  // 1시간 미만
  if (diff < 3600000) {
    return `${Math.floor(diff / 60000)}분 전`;
  }
  // 24시간 미만
  if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)}시간 전`;
  }
  // 그 외
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// 맨 위로 스크롤
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// 댓글로 스크롤
function scrollToComments() {
  const commentsSection = document.querySelector('.comments-section');
  if (commentsSection) {
    commentsSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}

// 알림 표시
function showNotification(message, type = 'info') {
  // 기존 알림 제거
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  // 새 알림 생성
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  document.body.appendChild(notification);

  // 3초 후 자동 제거
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 3000);
}