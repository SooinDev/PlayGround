<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>마이페이지 - PlayGround</title>
  <link rel="stylesheet" href="<c:url value='/resources/css/mypage.css'/>">
</head>
<body>
<!-- 상단 네비게이션 -->
<nav class="top-navbar">
  <div class="nav-container">
    <a href="<c:url value='/'/>" class="brand-logo">PlayGround</a>
    <div class="nav-actions">
      <a href="<c:url value='/dashboard'/>" class="nav-link">대시보드</a>
      <a href="<c:url value='/'/>" class="nav-link">홈</a>
      <a href="<c:url value='/member/logout'/>" class="nav-link logout">로그아웃</a>
    </div>
  </div>
</nav>

<div class="profile-page">
  <!-- 프로필 헤더 -->
  <div class="profile-header">
    <div class="container">
      <div class="profile-info">
        <div class="avatar">
          <span class="avatar-text">${sessionScope.loginMember.nickname.substring(0,1).toUpperCase()}</span>
          <div class="avatar-edit">📷</div>
        </div>
        <div class="user-details">
          <h1 class="user-name">${sessionScope.loginMember.nickname}</h1>
          <p class="user-email">${sessionScope.loginMember.email}</p>
          <span class="user-badge">활성 회원</span>
        </div>
      </div>
    </div>
  </div>

  <!-- 메인 콘텐츠 -->
  <div class="container">
    <!-- 탭 네비게이션 -->
    <div class="tab-navigation">
      <button class="tab-btn active" data-tab="profile">개인정보</button>
      <button class="tab-btn" data-tab="security">보안설정</button>
      <button class="tab-btn" data-tab="preferences">환경설정</button>
      <button class="tab-btn" data-tab="account">계정관리</button>
    </div>

    <!-- 개인정보 탭 -->
    <div class="tab-content active" id="profile-tab">
      <div class="content-card">
        <h2 class="card-title">개인정보 수정</h2>

        <c:if test="${not empty successMessage}">
          <div class="alert success">
            <span class="alert-icon">✓</span>
              ${successMessage}
          </div>
        </c:if>

        <c:if test="${not empty errorMessage}">
          <div class="alert error">
            <span class="alert-icon">⚠</span>
              ${errorMessage}
          </div>
        </c:if>

        <form action="<c:url value='/member/mypage'/>" method="post" class="profile-form">
          <div class="form-row">
            <div class="form-group">
              <label for="nickname">닉네임 *</label>
              <input type="text" id="nickname" name="nickname" value="${sessionScope.loginMember.nickname}" required>
            </div>

            <div class="form-group">
              <label for="email">이메일 주소 *</label>
              <input type="email" id="email" name="email" value="${sessionScope.loginMember.email}" required>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="name">이름</label>
              <input type="text" id="name" name="name" value="${sessionScope.loginMember.name}" placeholder="홍길동">
            </div>

            <div class="form-group">
              <label for="phone">연락처</label>
              <div class="phone-input-container">
                <div class="phone-input-wrapper">
                  <select class="country-select" id="countrySelect">
                    <option value="KR" data-code="+82" data-format="000-0000-0000" selected>🇰🇷 한국 (+82)</option>
                    <option value="US" data-code="+1" data-format="(000) 000-0000">🇺🇸 미국 (+1)</option>
                    <option value="JP" data-code="+81" data-format="000-0000-0000">🇯🇵 일본 (+81)</option>
                    <option value="CN" data-code="+86" data-format="000 0000 0000">🇨🇳 중국 (+86)</option>
                    <option value="GB" data-code="+44" data-format="00000 000000">🇬🇧 영국 (+44)</option>
                    <option value="DE" data-code="+49" data-format="0000 00000000">🇩🇪 독일 (+49)</option>
                    <option value="FR" data-code="+33" data-format="00 00 00 00 00">🇫🇷 프랑스 (+33)</option>
                    <option value="AU" data-code="+61" data-format="0000 000 000">🇦🇺 호주 (+61)</option>
                    <option value="CA" data-code="+1" data-format="(000) 000-0000">🇨🇦 캐나다 (+1)</option>
                    <option value="IN" data-code="+91" data-format="00000 00000">🇮🇳 인도 (+91)</option>
                  </select>
                  <input type="tel" id="phone" name="phone" value="${sessionScope.loginMember.phone}" placeholder="010-1234-5678">
                </div>
                <div class="phone-validation" id="phoneValidation"></div>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="address">주소</label>
            <input type="text" id="address" name="address" value="${sessionScope.loginMember.address}" placeholder="서울특별시 강남구...">
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-secondary" onclick="resetForm()">취소</button>
            <button type="submit" class="btn btn-primary">저장하기</button>
          </div>
        </form>
      </div>
    </div>

    <!-- 보안설정 탭 -->
    <div class="tab-content" id="security-tab">
      <div class="content-card">
        <h2 class="card-title">보안 설정</h2>

        <div class="security-item">
          <div class="security-info">
            <h3>비밀번호</h3>
            <p>계정 보안을 위해 정기적으로 변경하세요</p>
          </div>
          <button class="btn btn-outline" onclick="togglePasswordForm()">변경</button>
        </div>

        <div class="security-item">
          <div class="security-info">
            <h3>2단계 인증</h3>
            <p>로그인 보안을 강화합니다</p>
          </div>
          <button class="btn btn-outline">설정</button>
        </div>

        <!-- 비밀번호 변경 폼 -->
        <div class="password-form" id="passwordForm" style="display: none;">
          <h3>비밀번호 변경</h3>
          <form action="<c:url value='/member/mypage/password/change'/>" method="post">
            <div class="form-group">
              <label for="currentPassword">현재 비밀번호</label>
              <input type="password" id="currentPassword" name="currentPassword" required>
            </div>

            <div class="form-group">
              <label for="newPassword">새 비밀번호</label>
              <input type="password" id="newPassword" name="newPassword" required minlength="8">
              <div class="password-hint">8자 이상, 영문+숫자+특수문자 조합</div>
            </div>

            <div class="form-group">
              <label for="confirmPassword">새 비밀번호 확인</label>
              <input type="password" id="confirmPassword" name="confirmPassword" required>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-secondary" onclick="togglePasswordForm()">취소</button>
              <button type="submit" class="btn btn-primary">변경하기</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 환경설정 탭 -->
    <div class="tab-content" id="preferences-tab">
      <div class="content-card">
        <h2 class="card-title">환경 설정</h2>

        <div class="preference-section">
          <h3>알림 설정</h3>
          <div class="preference-item">
            <span>이메일 알림</span>
            <label class="toggle">
              <input type="checkbox" checked>
              <span class="slider"></span>
            </label>
          </div>

          <div class="preference-item">
            <span>브라우저 알림</span>
            <label class="toggle">
              <input type="checkbox">
              <span class="slider"></span>
            </label>
          </div>
        </div>

        <div class="preference-section">
          <h3>테마 설정</h3>
          <div class="theme-selector">
            <div class="theme-option active" data-theme="light">
              <div class="theme-preview light"></div>
              <span>라이트</span>
            </div>
            <div class="theme-option" data-theme="dark">
              <div class="theme-preview dark"></div>
              <span>다크</span>
            </div>
            <div class="theme-option" data-theme="auto">
              <div class="theme-preview auto"></div>
              <span>자동</span>
            </div>
          </div>
        </div>

        <div class="preference-section">
          <h3>언어 설정</h3>
          <select class="language-select">
            <option value="ko" selected>한국어</option>
            <option value="en">English</option>
            <option value="ja">日本語</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 계정관리 탭 -->
    <div class="tab-content" id="account-tab">
      <div class="content-card">
        <h2 class="card-title">계정 관리</h2>

        <div class="danger-section">
          <div class="danger-item">
            <div class="danger-info">
              <h3>계정 비활성화</h3>
              <p>계정을 일시적으로 비활성화합니다</p>
            </div>
            <button class="btn btn-warning">비활성화</button>
          </div>

          <div class="danger-item">
            <div class="danger-info">
              <h3>계정 삭제</h3>
              <p>모든 데이터가 영구 삭제됩니다</p>
            </div>
            <button class="btn btn-danger" onclick="confirmDelete()">계정 삭제</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- 삭제 확인 모달 -->
<div class="modal" id="deleteModal">
  <div class="modal-content">
    <h3>계정 삭제 확인</h3>
    <p>정말로 계정을 삭제하시겠습니까?</p>
    <p class="warning">이 작업은 되돌릴 수 없습니다.</p>

    <div class="form-group">
      <label>확인을 위해 "DELETE"를 입력하세요:</label>
      <input type="text" id="deleteConfirm" placeholder="DELETE">
    </div>

    <div class="modal-actions">
      <button class="btn btn-secondary" onclick="closeModal()">취소</button>
      <button class="btn btn-danger" id="confirmDeleteBtn" disabled>삭제하기</button>
    </div>
  </div>
</div>

<script src="<c:url value='/resources/js/mypage.js'/>"></script>
</body>
</html>