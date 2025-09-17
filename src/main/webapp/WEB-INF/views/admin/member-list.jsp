<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>회원 관리 - 관리자 페이지</title>
  <link rel="stylesheet" href="<c:url value='/resources/css/admin/member-list.css'/>">
</head>
<body>
<!-- 상단 네비게이션 -->
<nav class="admin-navbar">
  <div class="nav-container">
    <div class="nav-brand">
      <h1 class="brand-title">⚡ PlayGround Admin</h1>
      <span class="page-title">회원 관리</span>
    </div>
    <div class="nav-menu">
      <div class="nav-user-info">
        <span class="admin-name">${sessionScope.adminUser.name}</span>
        <span class="admin-role">관리자</span>
      </div>
      <div class="nav-buttons">
        <a href="<c:url value='/admin/dashboard'/>" class="nav-btn nav-btn-secondary">
          <span class="btn-icon">📊</span>
          대시보드
        </a>
        <a href="<c:url value='/admin/logout'/>" class="nav-btn nav-btn-logout">
          <span class="btn-icon">🚪</span>
          로그아웃
        </a>
      </div>
    </div>
  </div>
</nav>

<!-- 메인 컨텐츠 -->
<main class="main-content">
  <div class="content-container">

    <!-- 페이지 헤더 -->
    <header class="page-header">
      <div class="header-info">
        <h2 class="page-title">회원 목록</h2>
        <p class="page-description">등록된 회원들을 관리하고 상태를 변경할 수 있습니다.</p>
      </div>
      <div class="header-actions">
        <button type="button" class="action-btn search-btn" onclick="toggleSearchPanel()">
          <span class="btn-icon">🔍</span>
          검색
        </button>
        <button type="button" class="action-btn refresh-btn" onclick="refreshMemberList()">
          <span class="btn-icon">🔄</span>
          새로고침
        </button>
      </div>
    </header>

    <!-- 검색 패널 -->
    <div id="searchPanel" class="search-panel">
      <form class="search-form" onsubmit="performSearch(); return false;">
        <div class="search-fields">
          <select id="searchType" name="searchType" class="search-type">
            <option value="all">전체</option>
            <option value="nickname">닉네임</option>
            <option value="email">이메일</option>
          </select>
          <input type="text" id="searchKeyword" name="searchKeyword"
                 class="search-input" placeholder="검색어를 입력하세요">
          <button type="submit" class="btn btn-primary">검색</button>
          <button type="button" class="btn btn-secondary" onclick="resetSearch()">초기화</button>
        </div>
      </form>
    </div>

    <!-- 상태 필터 -->
    <div class="filter-section">
      <div class="filter-buttons">
        <button type="button" class="filter-btn active" data-status="all" onclick="filterByStatus('all')">
          전체 <span class="filter-count">${fn:length(memberList)}</span>
        </button>
        <button type="button" class="filter-btn" data-status="ACTIVE" onclick="filterByStatus('ACTIVE')">
          활성 <span class="filter-count" id="activeCount">0</span>
        </button>
        <button type="button" class="filter-btn" data-status="INACTIVE" onclick="filterByStatus('INACTIVE')">
          비활성 <span class="filter-count" id="inactiveCount">0</span>
        </button>
        <button type="button" class="filter-btn" data-status="SUSPENDED" onclick="filterByStatus('SUSPENDED')">
          정지 <span class="filter-count" id="suspendedCount">0</span>
        </button>
      </div>
    </div>

    <!-- 일괄 작업 바 -->
    <div class="bulk-actions" style="display: none;">
      <div class="bulk-info">
        <span class="selected-count">0명 선택됨</span>
      </div>
      <div class="bulk-buttons">
        <button type="button" class="bulk-btn" onclick="bulkChangeStatus('ACTIVE')">
          <span class="btn-icon">✅</span>
          활성화
        </button>
        <button type="button" class="bulk-btn" onclick="bulkChangeStatus('INACTIVE')">
          <span class="btn-icon">⏸️</span>
          비활성화
        </button>
        <button type="button" class="bulk-btn danger" onclick="bulkChangeStatus('SUSPENDED')">
          <span class="btn-icon">🚫</span>
          정지
        </button>
        <button type="button" class="bulk-btn secondary" onclick="clearMemberSelection()">
          <span class="btn-icon">✖️</span>
          선택 해제
        </button>
      </div>
    </div>

    <!-- 회원 테이블 -->
    <div class="table-container">
      <div class="table-info">
        총 <span class="highlight">${fn:length(memberList)}</span>명의 회원이 표시됩니다.
      </div>

      <div class="table-wrapper">
        <table class="member-table">
          <thead>
          <tr>
            <th class="th-checkbox">
              <input type="checkbox" id="selectAll" class="table-checkbox">
            </th>
            <th class="th-id">ID</th>
            <th class="th-name">닉네임</th>
            <th class="th-email">이메일</th>
            <th class="th-status">상태</th>
            <th class="th-date">가입일</th>
            <th class="th-actions">작업</th>
          </tr>
          </thead>
          <tbody>
          <c:choose>
            <c:when test="${not empty memberList}">
              <c:forEach items="${memberList}" var="member" varStatus="status">
                <tr class="member-row status-${fn:toLowerCase(member.status)}" data-member-id="${member.memberId}">
                  <td class="td-checkbox">
                    <input type="checkbox" class="member-checkbox table-checkbox"
                           data-member-id="${member.memberId}">
                  </td>
                  <td class="td-id">
                    <span class="member-id">${member.memberId}</span>
                  </td>
                  <td class="td-name">
                    <div class="member-profile">
                      <div class="member-avatar">
                        <span class="avatar-text">${fn:substring(member.nickname, 0, 1)}</span>
                      </div>
                      <span class="member-name">${member.nickname}</span>
                    </div>
                  </td>
                  <td class="td-email">
                    <span class="member-email">${member.email}</span>
                  </td>
                  <td class="td-status">
                    <select name="status" class="status-select"
                            data-member-id="${member.memberId}"
                            data-original-status="${member.status}">
                      <option value="ACTIVE" ${member.status.toString() == 'ACTIVE' ? 'selected' : ''}>활성</option>
                      <option value="INACTIVE" ${member.status.toString() == 'INACTIVE' ? 'selected' : ''}>비활성</option>
                      <option value="SUSPENDED" ${member.status.toString() == 'SUSPENDED' ? 'selected' : ''}>정지</option>
                    </select>
                  </td>
                  <td class="td-date">
                      ${member.memberCreatedAt.toString().substring(0, 10)}
                  </td>
                  <td class="td-actions">
                    <div class="action-buttons">
                      <button type="button" class="action-btn btn-view"
                              onclick="viewMember(${member.memberId})" title="상세보기">
                        <span class="btn-icon">👁️</span>
                      </button>
                      <button type="button" class="action-btn btn-edit"
                              onclick="editMember(${member.memberId})" title="편집">
                        <span class="btn-icon">✏️</span>
                      </button>
                      <button type="button" class="action-btn btn-delete"
                              onclick="deleteMember(${member.memberId})" title="삭제">
                        <span class="btn-icon">🗑️</span>
                      </button>
                    </div>
                  </td>
                </tr>
              </c:forEach>
            </c:when>
            <c:otherwise>
              <tr>
                <td colspan="7" class="empty-message">
                  <div class="empty-state">
                    <div class="empty-icon">👥</div>
                    <h3 class="empty-title">등록된 회원이 없습니다</h3>
                    <p class="empty-description">아직 가입한 회원이 없습니다.</p>
                  </div>
                </td>
              </tr>
            </c:otherwise>
          </c:choose>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 페이지네이션 -->
    <c:if test="${not empty memberList and totalPages > 1}">
      <nav class="pagination">
        <div class="pagination-info">
          <span>총 ${totalMembers}명 중 ${(currentPage-1)*pageSize + 1}-${fn:length(memberList) + (currentPage-1)*pageSize}명 표시</span>
        </div>
        <div class="pagination-controls">
          <c:if test="${currentPage > 1}">
            <a href="?page=${currentPage-1}" class="page-btn page-prev">
              <span class="btn-icon">←</span>
              이전
            </a>
          </c:if>

          <c:forEach begin="${startPage}" end="${endPage}" var="pageNum">
            <c:choose>
              <c:when test="${pageNum == currentPage}">
                <span class="page-btn page-current">${pageNum}</span>
              </c:when>
              <c:otherwise>
                <a href="?page=${pageNum}" class="page-btn">${pageNum}</a>
              </c:otherwise>
            </c:choose>
          </c:forEach>

          <c:if test="${currentPage < totalPages}">
            <a href="?page=${currentPage+1}" class="page-btn page-next">
              다음
              <span class="btn-icon">→</span>
            </a>
          </c:if>
        </div>
      </nav>
    </c:if>
  </div>
</main>

<!-- 회원 상세 모달 -->
<div id="memberModal" class="modal">
  <div class="modal-content">
    <div class="modal-header">
      <h3 class="modal-title">회원 상세 정보</h3>
      <button type="button" class="modal-close" onclick="closeMemberModal()">
        <span class="close-icon">✖️</span>
      </button>
    </div>
    <div class="modal-body" id="modalBody">
      <!-- 동적으로 생성되는 내용 -->
    </div>
  </div>
</div>

<!-- 상태별 카운트 스크립트 -->
<script>
  document.addEventListener('DOMContentLoaded', function() {
    // 상태별 개수 계산 및 표시
    updateStatusCounts();
  });

  function updateStatusCounts() {
    const rows = document.querySelectorAll('.member-row');
    let activeCount = 0;
    let inactiveCount = 0;
    let suspendedCount = 0;

    rows.forEach(row => {
      const statusSelect = row.querySelector('.status-select');
      if (statusSelect) {
        const status = statusSelect.value;
        switch(status) {
          case 'ACTIVE':
            activeCount++;
            break;
          case 'INACTIVE':
            inactiveCount++;
            break;
          case 'SUSPENDED':
            suspendedCount++;
            break;
        }
      }
    });

    // 카운트 업데이트
    const activeCountEl = document.getElementById('activeCount');
    const inactiveCountEl = document.getElementById('inactiveCount');
    const suspendedCountEl = document.getElementById('suspendedCount');

    if (activeCountEl) activeCountEl.textContent = activeCount;
    if (inactiveCountEl) inactiveCountEl.textContent = inactiveCount;
    if (suspendedCountEl) suspendedCountEl.textContent = suspendedCount;
  }

  // 전역으로 함수 노출
  window.updateStatusCounts = updateStatusCounts;
</script>

<script src="<c:url value='/resources/js/admin/member-list.js'/>"></script>
</body>
</html>