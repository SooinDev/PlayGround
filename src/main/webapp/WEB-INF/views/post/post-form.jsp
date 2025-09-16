<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>
    <c:choose>
      <c:when test="${not empty post}">게시글 수정</c:when>
      <c:otherwise>새 게시글 작성</c:otherwise>
    </c:choose>
    - PlayGround
  </title>
  <link rel="stylesheet" href="<c:url value='/resources/css/post/post-form.css'/>">
</head>
<body>
<!-- 상단 네비게이션 바 -->
<nav class="main-navbar">
  <div class="nav-container">
    <div class="nav-brand">
      <a href="<c:url value='/'/>" class="brand-logo">⚡ PlayGround</a>
      <span class="page-title">
                    <c:choose>
                      <c:when test="${not empty post}">게시글 수정</c:when>
                      <c:otherwise>글쓰기</c:otherwise>
                    </c:choose>
                </span>
    </div>
    <div class="nav-menu">
      <c:if test="${not empty sessionScope.loginMember}">
        <div class="nav-user-info">
          <div class="user-avatar">
            <span class="avatar-text">${sessionScope.loginMember.nickname.substring(0,1).toUpperCase()}</span>
          </div>
          <div class="user-details">
            <span class="user-name">${sessionScope.loginMember.nickname}</span>
            <span class="user-role">회원</span>
          </div>
        </div>
      </c:if>
      <div class="nav-buttons">
        <a href="<c:url value='/posts'/>" class="nav-btn nav-btn-secondary">
          <span class="btn-icon">📋</span>
          목록으로
        </a>
        <button type="button" class="nav-btn nav-btn-outline" onclick="togglePreview()">
          <span class="btn-icon">👁️</span>
          미리보기
        </button>
      </div>
    </div>
  </div>
</nav>

<!-- 메인 컨텐츠 -->
<main class="main-content">
  <div class="content-container">
    <!-- 헤더 섹션 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">
          <c:choose>
            <c:when test="${not empty post}">게시글 수정</c:when>
            <c:otherwise>새 게시글 작성</c:otherwise>
          </c:choose>
        </h1>
        <p class="page-description">
          <c:choose>
            <c:when test="${not empty post}">게시글을 수정하고 있습니다</c:when>
            <c:otherwise>다른 회원들이 쉽게 이해할 수 있도록 명확하고 구체적으로 작성해주세요</c:otherwise>
          </c:choose>
        </p>
      </div>
    </div>

    <!-- 게시글 작성 폼 -->
    <div class="form-section">
      <form id="postForm" action="<c:choose><c:when test='${not empty post}'><c:url value='/posts/update'/></c:when><c:otherwise><c:url value='/posts/create'/></c:otherwise></c:choose>" method="post">
        <c:if test="${not empty post}">
          <input type="hidden" name="postId" value="${post.postId}">
        </c:if>

        <!-- 제목 입력 -->
        <div class="form-group">
          <label for="title" class="form-label">
            <span class="label-text">제목</span>
            <span class="label-required">*</span>
          </label>
          <input type="text" id="title" name="title" class="form-input title-input"
                 placeholder="게시글 제목을 입력해주세요" required maxlength="100"
                 value="<c:if test='${not empty post}'>${post.title}</c:if>">
          <div class="input-info">
            <span class="char-count">0/100</span>
          </div>
        </div>

        <!-- 내용 입력 -->
        <div class="form-group content-group">
          <label for="content" class="form-label">
            <span class="label-text">내용</span>
            <span class="label-required">*</span>
          </label>
          <div class="editor-toolbar">
            <button type="button" class="toolbar-btn" onclick="formatText('bold')" title="굵게">
              <span class="toolbar-icon">🅱️</span>
            </button>
            <button type="button" class="toolbar-btn" onclick="formatText('italic')" title="기울임">
              <span class="toolbar-icon">🔤</span>
            </button>
            <button type="button" class="toolbar-btn" onclick="formatText('underline')" title="밑줄">
              <span class="toolbar-icon">📑</span>
            </button>
            <div class="toolbar-divider"></div>
            <button type="button" class="toolbar-btn" onclick="insertList()" title="목록">
              <span class="toolbar-icon">📋</span>
            </button>
            <button type="button" class="toolbar-btn" onclick="insertLink()" title="링크">
              <span class="toolbar-icon">🔗</span>
            </button>
            <div class="toolbar-divider"></div>
            <button type="button" class="toolbar-btn" onclick="insertEmoji()" title="이모지">
              <span class="toolbar-icon">😊</span>
            </button>
          </div>
          <textarea id="content" name="content" class="form-textarea content-textarea"
                    placeholder="게시글 내용을 입력해주세요&#10;&#10;• 다른 회원들이 이해하기 쉽도록 구체적으로 작성해주세요&#10;• 적절한 문단 구분을 통해 가독성을 높여주세요&#10;• 관련 링크나 참고자료가 있다면 함께 공유해주세요"
                    required maxlength="10000" rows="15"></textarea>
          <div class="input-info">
            <div class="content-tips">
              <span class="tip-icon">💡</span>
              <span class="tip-text">Shift + Enter로 줄바꿈, Enter로 문단 구분</span>
            </div>
            <span class="char-count">0/10000</span>
          </div>
        </div>

        <!-- 옵션 설정 -->
        <div class="form-group options-group">
          <div class="option-item">
            <input type="checkbox" id="allowComments" name="allowComments" checked>
            <label for="allowComments" class="checkbox-label">
              <span class="checkbox-text">댓글 허용</span>
            </label>
          </div>
          <div class="option-item">
            <input type="checkbox" id="isPrivate" name="isPrivate">
            <label for="isPrivate" class="checkbox-label">
              <span class="checkbox-text">비공개 게시글</span>
            </label>
          </div>
        </div>

        <!-- 제출 버튼 -->
        <div class="form-actions">
          <button type="button" class="btn btn-secondary" onclick="cancelPost()">
            <span class="btn-icon">❌</span>
            취소
          </button>
          <button type="submit" class="btn btn-primary">
            <span class="btn-icon">📝</span>
            <c:choose>
              <c:when test="${not empty post}">수정 완료</c:when>
              <c:otherwise>게시글 작성</c:otherwise>
            </c:choose>
          </button>
        </div>
      </form>
    </div>

    <!-- 미리보기 패널 (숨김) -->
    <div class="preview-panel" id="previewPanel">
      <div class="preview-header">
        <h3 class="preview-title">미리보기</h3>
        <button type="button" class="preview-close" onclick="togglePreview()">&times;</button>
      </div>
      <div class="preview-content" id="previewContent">
        <div class="preview-post">
          <div class="preview-post-header">
            <h2 class="preview-post-title">제목을 입력해주세요</h2>
            <div class="preview-post-meta">
              <span class="preview-author">${sessionScope.loginMember.nickname}</span>
              <span class="preview-date">방금 전</span>
            </div>
          </div>
          <div class="preview-post-body">
            <p class="preview-placeholder">내용을 입력하면 여기에 미리보기가 표시됩니다.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>

<script src="<c:url value='/resources/js/post/post-form.js'/>"></script>
</body>
</html>