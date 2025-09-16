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
  // 코드 블록 하이라이팅 (추후 구현 가능)
  highlightCodeBlocks();

  // 외부 링크 새 창에서 열기
  setupExternalLinks();

  // 이미지 지연 로딩
  setupLazyLoading();

  // 읽기 시간 계산
  calculateReadingTime();

  // 목차 생성 (긴 글일 경우)
  generateTableOfContents();

  // 반응 상태 복원
  restoreReactionStates();
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

  // 공유 버튼 이벤트
  const shareBtn = document.querySelector('.share-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', function() {
      const postId = getPostIdFromUrl();
      sharePost(postId);
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
        updateReadingProgress();
        ticking = false;
      });
      ticking = true;
    }
  });
}

// 댓글 시스템 초기화
function initializeComments() {
  updateCommentCharCount();

  // 댓글 정렬 이벤트
  const sortSelect = document.querySelector('.comment-sort select');
  if (sortSelect) {
    sortSelect.addEventListener('change', function() {
      sortComments(this.value);
    });
  }
}

// 댓글 글자 수 업데이트
function updateCommentCharCount() {
  const textarea = document.querySelector('.comment-textarea');
  const charCountSpan = document.querySelector('.char-count');

  if (textarea && charCountSpan) {
    const currentLength = textarea.value.length;
    const maxLength = textarea.getAttribute('maxlength') || 500;

    charCountSpan.textContent = `${currentLength}/${maxLength}`;

    // 글자 수에 따른 색상 변경
    if (currentLength > maxLength * 0.9) {
      charCountSpan.style.color = '#ef4444';
    } else if (currentLength > maxLength * 0.7) {
      charCountSpan.style.color = '#f59e0b';
    } else {
      charCountSpan.style.color = '#64748b';
    }

    commentCharCount = currentLength;
  }
}

// 댓글 입력 키보드 이벤트
function handleCommentKeydown(e) {
  // Ctrl/Cmd + Enter로 댓글 제출
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    const form = e.target.closest('form');
    if (form) {
      submitComment({ target: form, preventDefault: () => {} });
    }
  }
}

// 반응 버튼 설정
function setupReactionButtons() {
  const likeBtn = document.querySelector('.like-btn');
  const bookmarkBtn = document.querySelector('.bookmark-btn');

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
}

// 스크롤 관련 요소 업데이트
function updateScrollElements() {
  const scrollTop = window.pageYOffset;
  const navbar = document.querySelector('.main-navbar');
  const scrollToTopBtn = document.querySelector('.scroll-to-top');
  const scrollToCommentsBtn = document.querySelector('.scroll-to-comments');

  // 네비게이션 바 투명도 조정
  if (navbar) {
    if (scrollTop > 100) {
      navbar.style.background = 'rgba(30, 41, 59, 0.98)';
    } else {
      navbar.style.background = 'rgba(30, 41, 59, 0.95)';
    }
  }

  // 플로팅 버튼들 표시/숨김
  if (scrollToTopBtn) {
    if (scrollTop > 500) {
      scrollToTopBtn.style.opacity = '1';
      scrollToTopBtn.style.visibility = 'visible';
    } else {
      scrollToTopBtn.style.opacity = '0';
      scrollToTopBtn.style.visibility = 'hidden';
    }
  }

  if (scrollToCommentsBtn) {
    const commentsSection = document.querySelector('.comments-section');
    if (commentsSection) {
      const commentsTop = commentsSection.offsetTop;
      if (scrollTop < commentsTop - 200) {
        scrollToCommentsBtn.style.opacity = '1';
        scrollToCommentsBtn.style.visibility = 'visible';
      } else {
        scrollToCommentsBtn.style.opacity = '0';
        scrollToCommentsBtn.style.visibility = 'hidden';
      }
    }
  }
}

// 읽기 진행률 업데이트
function updateReadingProgress() {
  const article = document.querySelector('.post-detail');
  if (!article) return;

  const articleTop = article.offsetTop;
  const articleHeight = article.offsetHeight;
  const windowHeight = window.innerHeight;
  const scrollTop = window.pageYOffset;

  const progress = Math.min(
      Math.max((scrollTop - articleTop + windowHeight) / articleHeight, 0),
      1
  );

  // 진행률 표시 (헤더에 프로그래스 바 추가 가능)
  updateProgressBar(progress);
}

// 진행률 바 업데이트
function updateProgressBar(progress) {
  let progressBar = document.querySelector('.reading-progress');

  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    Object.assign(progressBar.style, {
      position: 'fixed',
      top: '60px',
      left: '0',
      width: '0%',
      height: '3px',
      background: 'linear-gradient(90deg, #3b82f6, #06b6d4)',
      zIndex: '1001',
      transition: 'width 0.1s ease'
    });
    document.body.appendChild(progressBar);
  }

  progressBar.style.width = `${progress * 100}%`;
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
  const countSpan = likeBtn.querySelector('.reaction-count');
  const currentCount = parseInt(countSpan.textContent) || 0;

  // UI 즉시 업데이트
  if (isLiked) {
    icon.textContent = '🤍';
    countSpan.textContent = Math.max(0, currentCount - 1);
    likeBtn.classList.remove('active');
    isLiked = false;
    showNotification('좋아요를 취소했습니다.', 'info');
  } else {
    icon.textContent = '❤️';
    countSpan.textContent = currentCount + 1;
    likeBtn.classList.add('active');
    isLiked = true;
    showNotification('좋아요를 눌렀습니다!', 'success');
  }

  // 서버에 요청 (실제 구현에서)
  // fetch(`/api/posts/${postId}/like`, { method: 'POST' })
  //     .then(response => response.json())
  //     .then(data => {
  //         if (!data.success) {
  //             // 실패 시 원래 상태로 복원
  //             revertLikeState();
  //         }
  //     })
  //     .catch(error => {
  //         revertLikeState();
  //         showNotification('네트워크 오류가 발생했습니다.', 'error');
  //     });
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
  const deleteForm = document.querySelector(`form[action*="${postId}/delete"]`);
  if (deleteForm) {
    deleteForm.submit();
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

  // 실제 구현에서는 서버로 댓글 전송
  setTimeout(() => {
    showNotification('댓글이 작성되었습니다!', 'success');
    resetCommentForm();

    // 댓글 목록 새로고침 (실제로는 서버에서 새 댓글 데이터를 받아와 추가)
    addNewCommentToList({
      content: content,
      isSecret: isSecret,
      author: getCurrentUser().nickname,
      createdAt: new Date()
    });

    // 버튼 복원
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }, 1000);
}

// 댓글 폼 리셋
function resetCommentForm() {
  const form = document.querySelector('.comment-form');
  if (form) {
    const textarea = form.querySelector('.comment-textarea');
    const checkbox = form.querySelector('input[name="isSecret"]');

    if (textarea) textarea.value = '';
    if (checkbox) checkbox.checked = false;

    updateCommentCharCount();
  }
}

// 새 댓글을 목록에 추가
function addNewCommentToList(commentData) {
  const commentsList = document.querySelector('.comments-list');
  const emptyComments = document.querySelector('.empty-comments');

  if (emptyComments) {
    emptyComments.style.display = 'none';
  }

  // 새 댓글 HTML 생성 (실제로는 서버에서 렌더링된 HTML을 받아올 것)
  const newCommentHtml = createCommentHTML(commentData);

  if (commentsList) {
    commentsList.insertAdjacentHTML('afterbegin', newCommentHtml);

    // 댓글 수 업데이트
    const commentCount = document.querySelector('.comment-count');
    if (commentCount) {
      const currentCount = parseInt(commentCount.textContent) || 0;
      commentCount.textContent = currentCount + 1;
    }
  }
}

// 댓글 HTML 생성
function createCommentHTML(commentData) {
  const timeAgo = '방금 전';
  return `
        <div class="comment-item new-comment">
            <div class="comment-header">
                <div class="comment-author">
                    <div class="author-avatar">
                        <span class="avatar-text">${commentData.author.substring(0,1).toUpperCase()}</span>
                    </div>
                    <div class="author-info">
                        <span class="author-name">${commentData.author}</span>
                        <time class="comment-date">${timeAgo}</time>
                    </div>
                </div>
            </div>
            <div class="comment-content">
                <p>${commentData.content.replace(/\n/g, '<br>')}</p>
                ${commentData.isSecret ? '<span class="secret-badge">🔒 비밀댓글</span>' : ''}
            </div>
        </div>
    `;
}

// 댓글 정렬
function sortComments(sortType) {
  showNotification(`${getSortName(sortType)}으로 정렬 중...`, 'info');

  // 실제로는 서버에서 정렬된 댓글을 다시 가져올 것
  setTimeout(() => {
    showNotification('댓글이 정렬되었습니다.', 'success');
  }, 500);
}

// 정렬 이름 반환
function getSortName(sortType) {
  switch (sortType) {
    case 'latest': return '최신순';
    case 'oldest': return '오래된순';
    case 'likes': return '추천순';
    default: return '최신순';
  }
}

// 스크롤 기능들
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

function scrollToComments() {
  const commentsSection = document.querySelector('.comments-section');
  if (commentsSection) {
    commentsSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

    // 댓글 입력 필드에 포커스
    setTimeout(() => {
      const textarea = document.querySelector('.comment-textarea');
      if (textarea) {
        textarea.focus();
      }
    }, 500);
  }
}

// 유틸리티 함수들
function getPostIdFromUrl() {
  const pathParts = window.location.pathname.split('/');
  return pathParts[pathParts.length - 1];
}

function isLoggedIn() {
  return document.querySelector('.nav-user-info') !== null;
}

function getCurrentUser() {
  const userNameElement = document.querySelector('.user-name');
  return {
    nickname: userNameElement ? userNameElement.textContent : 'Anonymous'
  };
}

function restoreReactionStates() {
  // 실제로는 서버에서 사용자의 반응 상태를 가져올 것
  const likeBtn = document.querySelector('.like-btn');
  const bookmarkBtn = document.querySelector('.bookmark-btn');

  // 임시로 로컬 스토리지에서 상태 복원 (실제로는 서버 API 호출)
  const postId = getPostIdFromUrl();
  // isLiked = localStorage.getItem(`liked_${postId}`) === 'true';
  // isBookmarked = localStorage.getItem(`bookmarked_${postId}`) === 'true';

  if (isLiked && likeBtn) {
    likeBtn.classList.add('active');
    likeBtn.querySelector('.reaction-icon').textContent = '❤️';
  }

  if (isBookmarked && bookmarkBtn) {
    bookmarkBtn.classList.add('active');
    bookmarkBtn.querySelector('.reaction-icon').textContent = '📗';
  }
}

// 추가 기능들
function highlightCodeBlocks() {
  const codeBlocks = document.querySelectorAll('pre code');
  codeBlocks.forEach(block => {
    // 코드 하이라이팅 라이브러리 적용 가능
    block.classList.add('hljs');
  });
}

function setupExternalLinks() {
  const contentLinks = document.querySelectorAll('.content-body a[href^="http"]');
  contentLinks.forEach(link => {
    if (!link.href.includes(window.location.hostname)) {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.innerHTML += ' 🔗';
    }
  });
}

function setupLazyLoading() {
  const images = document.querySelectorAll('.content-body img');

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        }
      });
    });

    images.forEach(img => {
      if (img.dataset.src) {
        imageObserver.observe(img);
      }
    });
  }
}

function calculateReadingTime() {
  const content = document.querySelector('.content-body');
  if (content) {
    const text = content.textContent || content.innerText || '';
    const wordsPerMinute = 200; // 평균 읽기 속도
    const words = text.trim().split(/\s+/).length;
    const readingTime = Math.ceil(words / wordsPerMinute);

    // 읽기 시간 표시 요소가 있다면 업데이트
    const readingTimeElement = document.querySelector('.reading-time');
    if (readingTimeElement) {
      readingTimeElement.textContent = `약 ${readingTime}분 소요`;
    }
  }
}

function generateTableOfContents() {
  const headings = document.querySelectorAll('.content-body h1, .content-body h2, .content-body h3');

  if (headings.length >= 3) {
    // 목차 생성 로직 (필요시 구현)
    console.log('목차 생성 가능:', headings.length, '개의 제목');
  }
}

// 알림 표시 함수 (post-list.js와 동일)
function showNotification(message, type = 'info') {
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;

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

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);

  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

function getNotificationIcon(type) {
  switch (type) {
    case 'success': return '✅';
    case 'error': return '❌';
    case 'warning': return '⚠️';
    case 'info': return 'ℹ️';
    default: return 'ℹ️';
  }
}

function getNotificationColor(type) {
  switch (type) {
    case 'success': return 'rgba(34, 197, 94, 0.9)';
    case 'error': return 'rgba(239, 68, 68, 0.9)';
    case 'warning': return 'rgba(245, 158, 11, 0.9)';
    case 'info': return 'rgba(59, 130, 246, 0.9)';
    default: return 'rgba(59, 130, 246, 0.9)';
  }
}