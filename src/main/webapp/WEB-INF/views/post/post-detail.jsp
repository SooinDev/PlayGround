<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${post.title} - PlayGround</title>
  <link rel="stylesheet" href="<c:url value='/resources/css/post/post-detail.css'/>">
  <meta name="description" content="${fn:substring(post.content, 0, 160)}">
</head>
<body>
<!-- 상단 네비게이션 바 -->
<nav class="main-navbar">
  <div class="nav-container">
    <div class="nav-brand">
      <a href="<c:url value='/'/>" class="brand-logo">⚡ PlayGround</a>
      <span class="page-title">게시글</span>
    </div>
    <div class="nav-menu">
      <c:if test="${not empty sessionScope.loginMember}">
        <div class="nav-user-info">
          <div class="user-avatar">
            <span class="avatar-text">${fn:substring(sessionScope.loginMember.nickname, 0, 1)}</span>
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
        <c:if test="${not empty sessionScope.loginMember}">
          <a href="<c:url value='/posts/new'/>" class="nav-btn nav-btn-primary">
            <span class="btn-icon">✏️</span>
            글쓰기
          </a>
        </c:if>
      </div>
    </div>
  </div>
</nav>

<!-- 메인 컨텐츠 -->
<main class="main-content">
  <div class="content-container">
    <!-- 브레드크럼 -->
    <nav class="breadcrumb">
      <a href="<c:url value='/'/>" class="breadcrumb-link">홈</a>
      <span class="breadcrumb-separator">></span>
      <a href="<c:url value='/posts'/>" class="breadcrumb-link">게시판</a>
      <span class="breadcrumb-separator">></span>
      <span class="breadcrumb-current">${post.title}</span>
    </nav>

    <!-- 게시글 상세 -->
    <article class="post-detail">
      <!-- 게시글 헤더 -->
      <header class="post-header">
        <h1 class="post-title">${post.title}</h1>
        <div class="post-meta-section">
          <div class="author-section">
            <div class="author-avatar">
              <span class="avatar-text">${fn:substring(post.writerNickname, 0, 1)}</span>
            </div>
            <div class="author-info">
              <div class="author-name">${post.writerNickname}</div>
              <time class="post-date">
                <c:choose>
                  <c:when test="${not empty post.postCreatedAt}">
                    ${post.postCreatedAt.toString().replace('T', ' ').substring(0, 16)}
                  </c:when>
                  <c:otherwise>
                    ${fn:substring(post.postCreatedAt, 0, 16)}
                  </c:otherwise>
                </c:choose>
              </time>
            </div>
          </div>
          <div class="post-stats">
            <div class="stat-item">
              <span class="stat-icon">👁️</span>
              <span class="stat-label">조회</span>
              <span class="stat-number">${post.viewCount}</span>
            </div>
            <div class="stat-item">
              <span class="stat-icon">💬</span>
              <span class="stat-label">댓글</span>
              <span class="stat-number">0</span>
            </div>
          </div>
          <c:if test="${not empty sessionScope.loginMember && sessionScope.loginMember.memberId == post.memberId}">
            <div class="post-actions">
              <a href="<c:url value='/posts/${post.postId}/edit'/>" class="action-btn edit-btn">
                <span class="btn-icon">✏️</span>
                수정
              </a>
              <button type="button" class="action-btn delete-btn" onclick="deletePost(${post.postId})">
                <span class="btn-icon">🗑️</span>
                삭제
              </button>
            </div>
          </c:if>
        </div>
      </header>

      <!-- 게시글 본문 -->
      <div class="post-body">
        <div class="content-body">
          <%-- 1. JSP 내에서 사용할 수 있도록 줄바꿈 문자(\n)를 변수로 만듭니다. --%>
          <c:set var="newLineChar" value="<%= \"\\n\" %>" />

          <%-- 2. fn:replace를 사용해 변수(newLineChar)에 담긴 줄바꿈 문자를 <br> 태그로 바꿉니다. --%>
          ${fn:replace(post.content, newLineChar, '<br>')}
        </div>
      </div>

      <!-- 게시글 푸터 (반응 버튼) -->
      <footer class="post-footer">
        <div class="post-reactions">
          <button class="reaction-btn like-btn" onclick="toggleLike(${post.postId})">
            <span class="reaction-icon">🤍</span>
            <span>좋아요</span>
          </button>
          <button class="reaction-btn bookmark-btn" onclick="toggleBookmark(${post.postId})">
            <span class="reaction-icon">📖</span>
            <span>북마크</span>
          </button>
          <button class="reaction-btn share-btn" onclick="sharePost(${post.postId})">
            <span class="reaction-icon">📤</span>
            <span>공유</span>
          </button>
        </div>
      </footer>
    </article>

    <!-- 댓글 섹션 -->
    <section class="comments-section">
      <header class="comments-header">
        <h2 class="comments-title">댓글</h2>
        <span class="comment-count">0</span>
      </header>

      <!-- 댓글 작성 폼 (로그인 시에만 표시) -->
      <c:if test="${not empty sessionScope.loginMember}">
        <div class="comment-form-container">
          <form class="comment-form" onsubmit="submitComment(event)">
            <div class="comment-input-section">
              <div class="commenter-avatar">
                <span class="avatar-text">${fn:substring(sessionScope.loginMember.nickname, 0, 1)}</span>
              </div>
              <div class="comment-input-wrapper">
                <textarea
                        class="comment-textarea"
                        placeholder="댓글을 입력하세요..."
                        maxlength="500"
                        rows="3"
                        required></textarea>
              </div>
            </div>
            <div class="comment-actions">
              <div class="comment-options">
                <label class="checkbox-label">
                  <input type="checkbox" name="isSecret">
                  <span class="checkbox-text">비밀댓글</span>
                </label>
              </div>
              <div class="comment-buttons">
                <span class="char-count">0/500</span>
                <button type="button" class="btn btn-secondary" onclick="resetCommentForm()">취소</button>
                <button type="submit" class="btn btn-primary">댓글 작성</button>
              </div>
            </div>
          </form>
        </div>
      </c:if>

      <!-- 댓글 목록 -->
      <div class="comments-list">
        <div class="empty-comments">
          <div class="empty-icon">💬</div>
          <h3 class="empty-title">아직 댓글이 없습니다</h3>
          <p class="empty-description">첫 번째 댓글을 작성해보세요!</p>
        </div>
      </div>
    </section>

    <!-- 하단 네비게이션 -->
    <nav class="bottom-navigation">
      <c:if test="${not empty prevPost}">
        <a href="<c:url value='/posts/${prevPost.postId}'/>" class="nav-post prev-post">
          <div class="nav-direction">이전글</div>
          <div class="nav-title">${prevPost.title}</div>
        </a>
      </c:if>
      <c:if test="${not empty nextPost}">
        <a href="<c:url value='/posts/${nextPost.postId}'/>" class="nav-post next-post">
          <div class="nav-direction">다음글</div>
          <div class="nav-title">${nextPost.title}</div>
        </a>
      </c:if>
    </nav>
  </div>
</main>

<!-- 플로팅 액션 버튼들 -->
<div class="floating-actions">
  <button class="float-btn scroll-to-top" onclick="scrollToTop()" title="맨 위로">
    <span class="float-icon">↑</span>
  </button>
  <button class="float-btn scroll-to-comments" onclick="scrollToComments()" title="댓글로">
    <span class="float-icon">💬</span>
  </button>
</div>

<!-- 숨겨진 삭제 폼 -->
<form id="deleteForm" method="post" action="<c:url value='/posts/${post.postId}/delete'/>" style="display: none;">
  <input type="hidden" name="_method" value="DELETE">
</form>

<script src="<c:url value='/resources/js/post/post-detail.js'/>"></script>
</body>
</html>