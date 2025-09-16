// 전역 변수
let isPreviewVisible = false;
let autoSaveTimer = null;
let isDirty = false;
let lastSavedContent = '';

// DOM 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', function() {
  initializeForm();
  setupEventListeners();
  setupAutoSave();
  restoreFormData();
});

// 폼 초기화
function initializeForm() {
  updateCharCounts();
  setupFormValidation();
  setupEditorToolbar();

  // 페이지 이탈 경고 설정
  window.addEventListener('beforeunload', function(e) {
    if (isDirty) {
      e.preventDefault();
      e.returnValue = '작성 중인 내용이 있습니다. 정말 페이지를 떠나시겠습니까?';
    }
  });
}

// 이벤트 리스너 설정
function setupEventListeners() {
  // 제목 입력 필드
  const titleInput = document.getElementById('title');
  if (titleInput) {
    titleInput.addEventListener('input', function() {
      updateCharCount(this, '.title-input + .input-info .char-count');
      updatePreview();
      markAsDirty();
    });

    titleInput.addEventListener('blur', validateTitle);
  }

  // 내용 입력 필드
  const contentTextarea = document.getElementById('content');
  if (contentTextarea) {
    contentTextarea.addEventListener('input', function() {
      updateCharCount(this, '.content-group .char-count');
      updatePreview();
      markAsDirty();
      autoResize(this);
    });

    contentTextarea.addEventListener('blur', validateContent);
    contentTextarea.addEventListener('keydown', handleEditorKeydown);

    // 드래그 앤 드롭 이벤트
    setupDragAndDrop(contentTextarea);
  }

  // 폼 제출 이벤트
  const postForm = document.getElementById('postForm');
  if (postForm) {
    postForm.addEventListener('submit', handleFormSubmit);
  }

  // 취소 버튼
  const cancelBtn = document.querySelector('.btn-secondary');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', cancelPost);
  }

  // 옵션 체크박스들
  setupOptionEventListeners();
}

// 글자 수 업데이트
function updateCharCount(element, selectorPath) {
  const charCountElement = document.querySelector(selectorPath);
  if (charCountElement) {
    const currentLength = element.value.length;
    const maxLength = element.getAttribute('maxlength');

    charCountElement.textContent = `${currentLength}/${maxLength}`;

    // 색상 변경
    if (currentLength > maxLength * 0.9) {
      charCountElement.style.color = '#ef4444';
    } else if (currentLength > maxLength * 0.7) {
      charCountElement.style.color = '#f59e0b';
    } else {
      charCountElement.style.color = '#64748b';
    }
  }
}

// 모든 글자 수 업데이트
function updateCharCounts() {
  const titleInput = document.getElementById('title');
  const contentTextarea = document.getElementById('content');

  if (titleInput) {
    updateCharCount(titleInput, '.title-input + .input-info .char-count');
  }

  if (contentTextarea) {
    updateCharCount(contentTextarea, '.content-group .char-count');
  }
}

// 에디터 키보드 이벤트 처리
function handleEditorKeydown(e) {
  const textarea = e.target;

  // Ctrl/Cmd + Enter로 저장
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    const form = textarea.closest('form');
    if (form && validateForm()) {
      form.submit();
    }
  }

  // Tab 키 처리 (4칸 들여쓰기)
  if (e.key === 'Tab') {
    e.preventDefault();
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    textarea.value = textarea.value.substring(0, start) + '    ' + textarea.value.substring(end);
    textarea.selectionStart = textarea.selectionEnd = start + 4;

    updateCharCount(textarea, '.content-group .char-count');
    updatePreview();
  }
}

// 에디터 툴바 설정
function setupEditorToolbar() {
  const toolbarBtns = document.querySelectorAll('.toolbar-btn');

  toolbarBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();

      // 버튼 활성화 상태 토글
      this.classList.toggle('active');

      // 포커스를 텍스트 영역으로 복원
      const contentTextarea = document.getElementById('content');
      if (contentTextarea) {
        contentTextarea.focus();
      }
    });
  });
}

// 텍스트 포맷팅
function formatText(format) {
  const textarea = document.getElementById('content');
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = textarea.value.substring(start, end);
  const beforeText = textarea.value.substring(0, start);
  const afterText = textarea.value.substring(end);

  let formattedText = '';
  let newCursorPos = start;

  switch (format) {
    case 'bold':
      if (selectedText) {
        formattedText = `**${selectedText}**`;
        newCursorPos = start + formattedText.length;
      } else {
        formattedText = '**굵은 텍스트**';
        newCursorPos = start + 2;
      }
      break;

    case 'italic':
      if (selectedText) {
        formattedText = `*${selectedText}*`;
        newCursorPos = start + formattedText.length;
      } else {
        formattedText = '*기울임 텍스트*';
        newCursorPos = start + 1;
      }
      break;

    case 'underline':
      if (selectedText) {
        formattedText = `<u>${selectedText}</u>`;
        newCursorPos = start + formattedText.length;
      } else {
        formattedText = '<u>밑줄 텍스트</u>';
        newCursorPos = start + 3;
      }
      break;
  }

  textarea.value = beforeText + formattedText + afterText;
  textarea.selectionStart = textarea.selectionEnd = newCursorPos;

  updateCharCount(textarea, '.content-group .char-count');
  updatePreview();
  markAsDirty();
}

// 목록 삽입
function insertList() {
  const textarea = document.getElementById('content');
  if (!textarea) return;

  const start = textarea.selectionStart;
  const beforeText = textarea.value.substring(0, start);
  const afterText = textarea.value.substring(start);

  const listText = '\n• 항목 1\n• 항목 2\n• 항목 3\n';

  textarea.value = beforeText + listText + afterText;
  textarea.selectionStart = textarea.selectionEnd = start + 3;

  updateCharCount(textarea, '.content-group .char-count');
  updatePreview();
  markAsDirty();
  textarea.focus();
}

// 링크 삽입
function insertLink() {
  const textarea = document.getElementById('content');
  if (!textarea) return;

  const url = prompt('링크 URL을 입력하세요:');
  if (!url) return;

  const linkText = prompt('링크 텍스트를 입력하세요:', url);
  if (!linkText) return;

  const start = textarea.selectionStart;
  const beforeText = textarea.value.substring(0, start);
  const afterText = textarea.value.substring(start);

  const linkMarkdown = `[${linkText}](${url})`;

  textarea.value = beforeText + linkMarkdown + afterText;
  textarea.selectionStart = textarea.selectionEnd = start + linkMarkdown.length;

  updateCharCount(textarea, '.content-group .char-count');
  updatePreview();
  markAsDirty();
  textarea.focus();
}

// 이모지 삽입
function insertEmoji() {
  const emojis = ['😊', '😂', '😍', '🤔', '😢', '😡', '👍', '👎', '❤️', '🔥', '⭐', '🎉'];
  const emojiPanel = createEmojiPanel(emojis);

  document.body.appendChild(emojiPanel);

  // 클릭 시 제거
  setTimeout(() => {
    document.addEventListener('click', function removePanel(e) {
      if (!emojiPanel.contains(e.target)) {
        emojiPanel.remove();
        document.removeEventListener('click', removePanel);
      }
    });
  }, 100);
}

// 이모지 패널 생성
function createEmojiPanel(emojis) {
  const panel = document.createElement('div');
  panel.className = 'emoji-panel';
  panel.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(30, 41, 59, 0.95);
        backdrop-filter: blur(12px);
        border-radius: 12px;
        padding: 20px;
        border: 1px solid rgba(148, 163, 184, 0.2);
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: 10px;
        z-index: 10000;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
    `;

  emojis.forEach(emoji => {
    const btn = document.createElement('button');
    btn.textContent = emoji;
    btn.style.cssText = `
            background: transparent;
            border: none;
            font-size: 24px;
            padding: 8px;
            border-radius: 6px;
            cursor: pointer;
            transition: background 0.2s;
        `;

    btn.addEventListener('mouseenter', () => {
      btn.style.background = 'rgba(148, 163, 184, 0.2)';
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.background = 'transparent';
    });

    btn.addEventListener('click', () => {
      insertTextAtCursor(emoji);
      panel.remove();
    });

    panel.appendChild(btn);
  });

  return panel;
}

// 커서 위치에 텍스트 삽입
function insertTextAtCursor(text) {
  const textarea = document.getElementById('content');
  if (!textarea) return;

  const start = textarea.selectionStart;
  const beforeText = textarea.value.substring(0, start);
  const afterText = textarea.value.substring(textarea.selectionEnd);

  textarea.value = beforeText + text + afterText;
  textarea.selectionStart = textarea.selectionEnd = start + text.length;

  updateCharCount(textarea, '.content-group .char-count');
  updatePreview();
  markAsDirty();
  textarea.focus();
}

// 텍스트 영역 자동 리사이즈
function autoResize(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = Math.min(textarea.scrollHeight, 600) + 'px';
}

// 드래그 앤 드롭 설정
function setupDragAndDrop(textarea) {
  const dropOverlay = document.createElement('div');
  dropOverlay.className = 'drop-overlay';
  dropOverlay.textContent = '파일을 여기에 드롭하세요';
  textarea.parentNode.appendChild(dropOverlay);

  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    textarea.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ['dragenter', 'dragover'].forEach(eventName => {
    textarea.addEventListener(eventName, highlight, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    textarea.addEventListener(eventName, unhighlight, false);
  });

  function highlight() {
    textarea.classList.add('dragover');
    dropOverlay.classList.add('active');
  }

  function unhighlight() {
    textarea.classList.remove('dragover');
    dropOverlay.classList.remove('active');
  }

  textarea.addEventListener('drop', handleDrop, false);

  function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;

    handleFiles(files);
  }
}

// 파일 처리
function handleFiles(files) {
  Array.from(files).forEach(file => {
    if (file.type.startsWith('image/')) {
      handleImageFile(file);
    } else {
      showNotification('이미지 파일만 업로드 가능합니다.', 'warning');
    }
  });
}

// 이미지 파일 처리
function handleImageFile(file) {
  const reader = new FileReader();
  reader.onload = function(e) {
    const imageMarkdown = `![${file.name}](${e.target.result})`;
    insertTextAtCursor(imageMarkdown);
    showNotification('이미지가 추가되었습니다.', 'success');
  };
  reader.readAsDataURL(file);
}

// 미리보기 토글
function togglePreview() {
  const previewPanel = document.getElementById('previewPanel');
  if (!previewPanel) return;

  isPreviewVisible = !isPreviewVisible;

  if (isPreviewVisible) {
    previewPanel.classList.add('active');
    updatePreview();
  } else {
    previewPanel.classList.remove('active');
  }

  // 버튼 텍스트 변경
  const previewBtn = document.querySelector('.nav-btn-outline');
  if (previewBtn) {
    const btnText = previewBtn.querySelector('span:not(.btn-icon)');
    if (btnText) {
      btnText.textContent = isPreviewVisible ? '편집' : '미리보기';
    }
  }
}

// 미리보기 업데이트
function updatePreview() {
  if (!isPreviewVisible) return;

  const titleInput = document.getElementById('title');
  const contentTextarea = document.getElementById('content');
  const previewTitle = document.querySelector('.preview-post-title');
  const previewBody = document.querySelector('.preview-post-body');

  if (previewTitle && titleInput) {
    previewTitle.textContent = titleInput.value || '제목을 입력해주세요';
  }

  if (previewBody && contentTextarea) {
    const content = contentTextarea.value;
    if (content.trim()) {
      // 간단한 마크다운 변환
      const htmlContent = convertMarkdownToHtml(content);
      previewBody.innerHTML = htmlContent;
    } else {
      previewBody.innerHTML = '<p class="preview-placeholder">내용을 입력하면 여기에 미리보기가 표시됩니다.</p>';
    }
  }
}

// 간단한 마크다운 변환
function convertMarkdownToHtml(markdown) {
  return markdown
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
      .replace(/^• (.+)/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
      .replace(/\n/g, '<br>');
}

// 폼 검증
function validateForm() {
  const titleInput = document.getElementById('title');
  const contentTextarea = document.getElementById('content');

  let isValid = true;

  // 제목 검증
  if (!validateTitle()) {
    isValid = false;
  }

  // 내용 검증
  if (!validateContent()) {
    isValid = false;
  }

  return isValid;
}

// 제목 검증
function validateTitle() {
  const titleInput = document.getElementById('title');
  const title = titleInput.value.trim();

  removeError(titleInput);

  if (!title) {
    showError(titleInput, '제목을 입력해주세요.');
    return false;
  }

  if (title.length < 2) {
    showError(titleInput, '제목은 2자 이상 입력해주세요.');
    return false;
  }

  if (title.length > 100) {
    showError(titleInput, '제목은 100자를 초과할 수 없습니다.');
    return false;
  }

  return true;
}

// 내용 검증
function validateContent() {
  const contentTextarea = document.getElementById('content');
  const content = contentTextarea.value.trim();

  removeError(contentTextarea);

  if (!content) {
    showError(contentTextarea, '내용을 입력해주세요.');
    return false;
  }

  if (content.length < 10) {
    showError(contentTextarea, '내용은 10자 이상 입력해주세요.');
    return false;
  }

  return true;
}

// 에러 표시
function showError(element, message) {
  element.classList.add('error');

  // 기존 에러 메시지 제거
  const existingError = element.parentNode.querySelector('.error-message');
  if (existingError) {
    existingError.remove();
  }

  // 새 에러 메시지 추가
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.innerHTML = `❌ ${message}`;

  element.parentNode.appendChild(errorDiv);
}

// 에러 제거
function removeError(element) {
  element.classList.remove('error');

  const errorMessage = element.parentNode.querySelector('.error-message');
  if (errorMessage) {
    errorMessage.remove();
  }
}

// 폼 제출 처리
function handleFormSubmit(e) {
  if (!validateForm()) {
    e.preventDefault();
    showNotification('입력 내용을 확인해주세요.', 'error');
    return false;
  }

  // 제출 버튼 비활성화
  const submitBtn = e.target.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="btn-icon">⏳</span> 저장 중...';
  }

  // 더티 플래그 제거 (페이지 이탈 경고 방지)
  isDirty = false;

  showNotification('게시글을 저장하는 중...', 'info');

  return true;
}

// 옵션 이벤트 리스너 설정
function setupOptionEventListeners() {
  const checkboxes = document.querySelectorAll('.option-item input[type="checkbox"]');

  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      markAsDirty();

      // 체크박스 상태에 따른 추가 로직
      if (this.name === 'isPrivate' && this.checked) {
        showNotification('비공개 게시글로 설정되었습니다.', 'info');
      }
    });
  });
}

// 폼 검증 설정
function setupFormValidation() {
  const inputs = document.querySelectorAll('input, textarea');

  inputs.forEach(input => {
    // 실시간 검증
    input.addEventListener('input', function() {
      if (this.classList.contains('error')) {
        // 에러 상태인 경우에만 실시간 검증
        setTimeout(() => {
          if (this.id === 'title') {
            validateTitle();
          } else if (this.id === 'content') {
            validateContent();
          }
        }, 500);
      }
    });
  });
}

// 자동 저장 설정
function setupAutoSave() {
  const autoSaveInterval = 30000; // 30초마다

  setInterval(() => {
    if (isDirty) {
      autoSaveContent();
    }
  }, autoSaveInterval);
}

// 자동 저장 수행
function autoSaveContent() {
  const titleInput = document.getElementById('title');
  const contentTextarea = document.getElementById('content');

  if (!titleInput || !contentTextarea) return;

  const currentContent = {
    title: titleInput.value,
    content: contentTextarea.value
  };

  const contentString = JSON.stringify(currentContent);

  if (contentString === lastSavedContent) return;

  // 로컬 스토리지에 임시 저장
  localStorage.setItem('post_draft', contentString);
  lastSavedContent = contentString;

  showAutoSaveStatus('자동 저장됨', 'success');
}

// 폼 데이터 복원
function restoreFormData() {
  const savedDraft = localStorage.getItem('post_draft');

  if (savedDraft) {
    try {
      const draftData = JSON.parse(savedDraft);
      const titleInput = document.getElementById('title');
      const contentTextarea = document.getElementById('content');

      // 기존 내용이 있으면 복원하지 않음
      if (titleInput && !titleInput.value && draftData.title) {
        titleInput.value = draftData.title;
      }

      if (contentTextarea && !contentTextarea.value && draftData.content) {
        contentTextarea.value = draftData.content;
      }

      updateCharCounts();
      updatePreview();

      if (draftData.title || draftData.content) {
        showNotification('임시 저장된 내용을 복원했습니다.', 'info');
      }
    } catch (e) {
      console.log('임시 저장 데이터 복원 실패:', e);
    }
  }
}

// 더티 플래그 설정
function markAsDirty() {
  isDirty = true;
}

// 자동 저장 상태 표시
function showAutoSaveStatus(message, type) {
  let statusElement = document.querySelector('.auto-save-status');

  if (!statusElement) {
    statusElement = document.createElement('div');
    statusElement.className = 'auto-save-status';
    document.body.appendChild(statusElement);
  }

  statusElement.textContent = message;
  statusElement.className = `auto-save-status ${type} show`;

  setTimeout(() => {
    statusElement.classList.remove('show');
  }, 2000);
}

// 취소 처리
function cancelPost() {
  if (isDirty) {
    const confirmed = confirm('작성 중인 내용이 있습니다. 정말 취소하시겠습니까?');
    if (!confirmed) {
      return;
    }
  }

  // 임시 저장 데이터 제거
  localStorage.removeItem('post_draft');

  // 이전 페이지로 이동
  if (document.referrer && document.referrer.includes(window.location.origin)) {
    history.back();
  } else {
    window.location.href = '/posts';
  }
}

// 알림 표시 함수
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