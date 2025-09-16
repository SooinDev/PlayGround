<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>게시판 - PlayGround</title>
  <link rel="stylesheet" href="<c:url value='/resources/css/post/post-list.css'/>">
</head>
<body>
<!-- 상단 네비게이션 바 -->
<nav class="main-navbar">
  <div class="nav-container">
    <div class="nav-brand">
      <a href="<c:url value='/'/>" class="brand-logo">⚡ PlayGround</a>
      <span class="page-title">게시판</span>
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
        <div class="nav-buttons">
          <a href="<c:url value='/member/mypage'/>" class="nav-btn nav-btn-secondary">마이페이지</a>
          <a href="<c:url value='/posts/new'/>" class="nav-btn nav-btn-primary">
            <span class="btn-icon">✏️</span>
            글쓰기
          </a>
          <a href="<c:url value='/member/logout'/>" class="nav-btn nav-btn-outline">로그아웃</a>
        </div>
      </c:if>
      <c:if test="${empty sessionScope.loginMember}">
        <div class="nav-buttons">
          <a href="<c:url value='/member/login'/>" class="nav-btn nav-btn-primary">로그인</a>
          <a href="<c:url value='/member/register'/>" class="nav-btn nav-btn-outline">회원가입</a>
        </div>
      </c:if>
    </div>
  </div>
</nav>

<!-- 메인 컨텐츠 -->
<main class="main-content">
  <div class="content-container">
    <!-- 헤더 섹션 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">게시판</h1>
        <p class="page-description">자유롭게 소통하고 정보를 공유해보세요</p>
      </div>
      <div class="header-actions">
        <button class="action-btn search-toggle" onclick="toggleSearch()" title="검색">
          <span class="action-icon">🔍</span>
        </button>
        <c:if test="${not empty sessionScope.loginMember}">
          <a href="<c:url value='/posts/new'/>" class="action-btn write-btn">
            <span class="action-icon">✏️</span>
            글쓰기
          </a>
        </c:if>
      </div>
    </div>

    <!-- 통계 및 정렬 -->
    <div class="list-controls">
      <div class="list-stats">
        총 <span class="stats-number">${totalPosts}</span>개의 게시글
      </div>
      <div class="sort-controls">
        <select class="sort-select" onchange="changeSortOrder(this.value)">
          <option value="latest">최신순</option>
          <option value="popular">인기순</option>
          <option value="views">조회순</option>
        </select>
      </div>
    </div>

    <!-- 검색 패널 (숨김) -->
    <div class="search-panel" id="searchPanel">
      <div class="search-content">
        <form class="search-form" action="<c:url value='/posts'/>" method="get">
          <div class="search-group">
            <select name="searchType" class="search-select">
              <option value="all">전체</option>
              <option value="title">제목</option>
              <option value="content">내용</option>
              <option value="author">작성자</option>
            </select>
            <input type="text" name="keyword" class="search-input"
                   placeholder="검색어를 입력하세요" value="${param.keyword}">
            <button type="submit" class="search-btn">
              <span class="search-icon">🔍</span>
              검색
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 게시글 목록 -->
    <div class="posts-container">
      <c:choose>
        <c:when test="${not empty postList}">
          <div class="posts-grid">
            <c:forEach items="${postList}" var="post" varStatus="status">
              <article class="post-card" data-post-id="${post.postId}">
                <div class="post-header">
                  <div class="post-meta">
                    <div class="post-author">
                      <div class="author-avatar">
                        <span class="avatar-text">${post.writerNickname.substring(0,1).toUpperCase()}</span>
                      </div>
                      <div class="author-info">
                        <span class="author-name">${post.writerNickname}</span>
                        <time class="post-date">
                            ${post.postCreatedAt.toString().replace('T', ' ').substring(0, 16)}
                        </time>
                      </div>
                    </div>
                    <div class="post-actions">
                      <button class="action-bookmark" onclick="toggleBookmark(${post.postId})" title="북마크">
                        <span class="bookmark-icon">📖</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div class="post-content" onclick="viewPost(${post.postId})">
                  <h2 class="post-title">${post.title}</h2>
                  <p class="post-excerpt">
                    <c:choose>
                      <c:when test="${fn:length(post.content) > 150}">
                        ${fn:substring(post.content, 0, 150)}...
                      </c:when>
                      <c:otherwise>
                        ${post.content}
                      </c:otherwise>
                    </c:choose>
                  </p>
                </div>

                <div class="post-footer">
                  <div class="post-stats">
                    <div class="stat-item">
                      <span class="stat-icon">👁️</span>
                      <span class="stat-number">${post.viewCount}</span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-icon">💬</span>
                      <span class="stat-number">0</span>
                    </div>
                    <div class="stat-item">
                      <span class="stat-icon">❤️</span>
                      <span class="stat-number">0</span>
                    </div>
                  </div>
                </div>
              </article>
            </c:forEach>
          </div>

          <!-- 페이지네이션 -->
          <div class="pagination-container">
            <nav class="pagination" aria-label="페이지 네비게이션">
              <c:if test="${currentPage > 1}">
                <a href="<c:url value='/posts?page=${currentPage - 1}'/>" class="page-btn prev-btn" title="이전 페이지">
                  <span class="page-icon">←</span>
                  이전
                </a>
              </c:if>

              <div class="page-numbers">
                <c:forEach var="pageNum" begin="1" end="${totalPages}">
                  <c:choose>
                    <c:when test="${pageNum == currentPage}">
                      <span class="page-number current">${pageNum}</span>
                    </c:when>
                    <c:otherwise>
                      <a href="<c:url value='/posts?page=${pageNum}'/>" class="page-number">${pageNum}</a>
                    </c:otherwise>
                  </c:choose>
                </c:forEach>
              </div>

              <c:if test="${currentPage < totalPages}">
                <a href="<c:url value='/posts?page=${currentPage + 1}'/>" class="page-btn next-btn" title="다음 페이지">
                  다음
                  <span class="page-icon">→</span>
                </a>
              </c:if>
            </nav>

            <div class="pagination-info">
                ${currentPage} / ${totalPages} 페이지 (총 ${totalPosts}개)
            </div>
          </div>
        </c:when>
        <c:otherwise>
          <div class="empty-state">
            <div class="empty-icon">📝</div>
            <h3 class="empty-title">아직 게시글이 없습니다</h3>
            <p class="empty-description">첫 번째 게시글을 작성해보세요!</p>
            <c:if test="${not empty sessionScope.loginMember}">
              <a href="<c:url value='/posts/new'/>" class="empty-action">글쓰기</a>
            </c:if>
          </div>
        </c:otherwise>
      </c:choose>
    </div>
  </div>
</main>

<!-- 플로팅 액션 버튼들 -->
<div class="floating-actions">
  <button class="float-btn scroll-to-top" onclick="scrollToTop()" title="맨 위로">
    <span class="float-icon">↑</span>
  </button>
  <c:if test="${not empty sessionScope.loginMember}">
    <a href="<c:url value='/posts/new'/>" class="float-btn write-post" title="글쓰기">
      <span class="float-icon">✏️</span>
    </a>
  </c:if>
</div>

<script src="<c:url value='/resources/js/post/post-list.js'/>"></script>
</body>
</html>