<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>회원 관리 - PlayGround Admin</title>
  <link rel="stylesheet" href="<c:url value='/resources/css/member/member-list.css'/>">
</head>
<body>
<!-- 상단 네비게이션 바 -->
<nav class="admin-navbar">
  <div class="nav-container">
    <div class="nav-brand">
      <span class="brand-logo">⚡ PlayGround Admin</span>
      <span class="page-title">회원 관리</span>
    </div>
    <div class="nav-menu">
      <div class="nav-user-info">
        <div class="admin-avatar">
          <span class="avatar-text">${sessionScope.loginAdmin.adminEmail.substring(0,1).toUpperCase()}</span>
        </div>
        <div class="user-details">
          <span class="admin-name">${sessionScope.loginAdmin.adminEmail}</span>
          <span class="admin-role">시스템 관리자</span>
        </div>
      </div>
      <div class="nav-buttons">
        <a href="<c:url value='/admin/admin-dashboard'/>" class="nav-btn nav-btn-secondary">
          <span class="btn-icon">대시보드</span>
        </a>
        <a href="<c:url value='/admin/settings'/>" class="nav-btn nav-btn-secondary">
          <span class="btn-icon">설정</span>
        </a>
        <a href="<c:url value='/admin/logout'/>" class="nav-btn nav-btn-logout">
          <span class="btn-icon">로그아웃</span>
        </a>
      </div>
    </div>
  </div>
</nav>

<!-- 메인 컨텐츠 -->
<main class="main-content">
  <div class="content-container">
    <!-- 페이지 헤더 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">회원 관리</h1>
        <p class="page-subtitle">등록된 회원들의 정보를 확인하고 관리할 수 있습니다.</p>
      </div>
      <div class="header-actions">
        <button class="action-btn search-btn" onclick="toggleSearchPanel()">
          <span class="btn-icon">검색</span>
        </button>
        <button class="action-btn refresh-btn" onclick="refreshMemberList()">
          <span class="btn-icon">새로고침</span>
        </button>
      </div>
    </div>

    <!-- 통계 카드 -->
    <div class="stats-section">
      <div class="stat-card primary">
        <div class="stat-icon">👥</div>
        <div class="stat-content">
          <h3 class="stat-title">전체 회원수</h3>
          <p class="stat-value">${totalPages * 10}</p>
          <span class="stat-description">등록된 총 회원수</span>
        </div>
      </div>

      <div class="stat-card success">
        <div class="stat-icon">✅</div>
        <div class="stat-content">
          <h3 class="stat-title">현재 페이지</h3>
          <p class="stat-value">${currentPage}</p>
          <span class="stat-description">총 ${totalPages}페이지 중</span>
        </div>
      </div>

      <div class="stat-card info">
        <div class="stat-icon">📄</div>
        <div class="stat-content">
          <h3 class="stat-title">페이지당 회원수</h3>
          <p class="stat-value">10</p>
          <span class="stat-description">명씩 표시</span>
        </div>
      </div>
    </div>

    <!-- 검색 패널 (숨김) -->
    <div class="search-panel" id="searchPanel">
      <div class="search-content">
        <div class="search-form">
          <div class="form-group">
            <label for="searchType">검색 조건</label>
            <select id="searchType" class="form-select">
              <option value="all">전체</option>
              <option value="nickname">닉네임</option>
              <option value="email">이메일</option>
            </select>
          </div>
          <div class="form-group">
            <label for="searchKeyword">검색어</label>
            <input type="text" id="searchKeyword" class="form-input" placeholder="검색어를 입력하세요">
          </div>
          <div class="search-buttons">
            <button class="btn btn-primary" onclick="performSearch()">검색</button>
            <button class="btn btn-secondary" onclick="resetSearch()">초기화</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 회원 목록 테이블 -->
    <div class="table-section">
      <div class="table-header">
        <h2 class="section-title">회원 목록</h2>
        <div class="table-info">
          총 <span class="highlight">${memberList.size()}</span>명의 회원이 표시됩니다.
        </div>
      </div>

      <div class="table-container">
        <c:choose>
          <c:when test="${not empty memberList}">
            <table class="member-table">
              <thead>
              <tr>
                <th class="th-id">ID</th>
                <th class="th-avatar">프로필</th>
                <th class="th-nickname">닉네임</th>
                <th class="th-email">이메일</th>
                <th class="th-date">가입일</th>
                <th class="th-status">상태</th>
                <th class="th-actions">관리</th>
              </tr>
              </thead>
              <tbody>
              <c:forEach var="member" items="${memberList}" varStatus="status">
                <tr class="member-row" data-member-id="${member.memberId}">
                  <td class="td-id">${member.memberId}</td>
                  <td class="td-avatar">
                    <div class="member-avatar">
                      <span class="avatar-text">${member.nickname.substring(0,1).toUpperCase()}</span>
                    </div>
                  </td>
                  <td class="td-nickname">
                    <div class="member-info">
                      <span class="member-name">${member.nickname}</span>
                    </div>
                  </td>
                  <td class="td-email">
                    <span class="member-email">${member.email}</span>
                  </td>
                  <td class="td-date">
                      ${member.memberCreatedAt.toString().substring(0, 10)}
                  </td>
                  <td class="td-status">
                    <span class="status-badge active">활성</span>
                  </td>
                  <td class="td-actions">
                    <div class="action-buttons">
                      <button class="btn-action btn-view" onclick="viewMember(${member.memberId})" title="상세보기">
                        <span class="action-icon">👁️</span>
                      </button>
                      <button class="btn-action btn-edit" onclick="editMember(${member.memberId})" title="편집">
                        <span class="action-icon">✏️</span>
                      </button>
                      <button class="btn-action btn-delete" onclick="deleteMember(${member.memberId})" title="삭제">
                        <span class="action-icon">🗑️</span>
                      </button>
                    </div>
                  </td>
                </tr>
              </c:forEach>
              </tbody>
            </table>
          </c:when>
          <c:otherwise>
            <div class="empty-state">
              <div class="empty-icon">📭</div>
              <h3 class="empty-title">등록된 회원이 없습니다</h3>
              <p class="empty-description">아직 가입한 회원이 없거나 조건에 맞는 회원이 없습니다.</p>
            </div>
          </c:otherwise>
        </c:choose>
      </div>
    </div>

    <!-- 페이지네이션 -->
    <c:if test="${totalPages > 1}">
      <div class="pagination-section">
        <div class="pagination">
          <!-- 이전 페이지 -->
          <c:if test="${currentPage > 1}">
            <a href="<c:url value='/admin/members?page=${currentPage - 1}'/>" class="page-btn prev-btn">
              <span class="btn-icon">‹</span>
              이전
            </a>
          </c:if>

          <!-- 페이지 번호들 -->
          <div class="page-numbers">
            <c:set var="startPage" value="${currentPage - 2 < 1 ? 1 : currentPage - 2}"/>
            <c:set var="endPage" value="${currentPage + 2 > totalPages ? totalPages : currentPage + 2}"/>

            <c:forEach var="pageNum" begin="${startPage}" end="${endPage}">
              <c:choose>
                <c:when test="${pageNum == currentPage}">
                  <span class="page-number active">${pageNum}</span>
                </c:when>
                <c:otherwise>
                  <a href="<c:url value='/admin/members?page=${pageNum}'/>" class="page-number">${pageNum}</a>
                </c:otherwise>
              </c:choose>
            </c:forEach>
          </div>

          <!-- 다음 페이지 -->
          <c:if test="${currentPage < totalPages}">
            <a href="<c:url value='/admin/members?page=${currentPage + 1}'/>" class="page-btn next-btn">
              다음
              <span class="btn-icon">›</span>
            </a>
          </c:if>
        </div>

        <div class="pagination-info">
          페이지 ${currentPage} / ${totalPages}
        </div>
      </div>
    </c:if>
  </div>
</main>

<!-- 회원 상세 정보 모달 (숨김) -->
<div class="modal-overlay" id="memberModal">
  <div class="modal-content">
    <div class="modal-header">
      <h3 class="modal-title">회원 상세 정보</h3>
      <button class="modal-close" onclick="closeMemberModal()">&times;</button>
    </div>
    <div class="modal-body" id="modalBody">
      <!-- 동적으로 회원 정보가 들어갈 공간 -->
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeMemberModal()">닫기</button>
    </div>
  </div>
</div>

<script src="<c:url value='/resources/js/admin/member-list.js'/>"></script>
</body>
</html>