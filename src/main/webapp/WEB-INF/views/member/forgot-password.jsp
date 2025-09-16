<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>비밀번호 찾기 - PlayGround</title>
  <link rel="stylesheet" href="<c:url value='/resources/css/member/forgot-password.css'/>">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
</head>
<body>
<div class="forgot-password-container">
  <!-- 왼쪽 일러스트레이션 영역 -->
  <div class="illustration-panel">
    <div class="illustration-content">
      <div class="main-illustration">
        <div class="security-mockup">
          <div class="lock-icon">
            <div class="lock-body"></div>
            <div class="lock-shackle"></div>
          </div>
          <div class="security-rings">
            <div class="ring ring-1"></div>
            <div class="ring ring-2"></div>
            <div class="ring ring-3"></div>
          </div>
          <div class="key-elements">
            <div class="key key-1"></div>
            <div class="key key-2"></div>
            <div class="key key-3"></div>
          </div>
        </div>
      </div>

      <div class="tagline">
        <h1>계정 보안을<br>복구하세요</h1>
        <p>안전하고 간편한 비밀번호 재설정</p>
      </div>
    </div>
  </div>

  <!-- 오른쪽 폼 영역 -->
  <div class="form-panel">
    <div class="form-content">
      <div class="brand-header">
        <div class="logo">PlayGround</div>
        <h2>비밀번호 찾기</h2>
        <p class="subtitle">등록된 이메일로 재설정 링크를 보내드립니다</p>
      </div>

      <c:if test="${not empty errorMessage}">
        <div class="error-message">
          <div class="error-icon">⚠</div>
          <div class="error-text">${errorMessage}</div>
        </div>
      </c:if>

      <c:if test="${not empty successMessage}">
        <div class="success-message">
          <div class="success-icon">✓</div>
          <div class="success-text">${successMessage}</div>
        </div>
      </c:if>

      <form action="<c:url value='/member/forgot-password'/>" method="post" id="forgotPasswordForm" class="forgot-password-form">
        <div class="form-group">
          <label for="email">이메일 주소</label>
          <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="등록된 이메일을 입력하세요"
                  value="${param.email}"
                  required
                  autocomplete="email"
          >
          <div class="validation-message" id="emailValidation"></div>
        </div>

        <button type="submit" class="reset-btn">
          <span class="btn-text">재설정 링크 전송</span>
          <span class="btn-loading">전송 중...</span>
        </button>
      </form>

      <div class="info-box">
        <div class="info-icon">💡</div>
        <div class="info-content">
          <h4>도움이 필요하신가요?</h4>
          <p>이메일을 받지 못하셨다면 스팸함을 확인해보세요. 계속 문제가 있다면 고객지원에 문의하세요.</p>
        </div>
      </div>

      <div class="back-links">
        <a href="<c:url value='/member/login'/>" class="back-link">
          ← 로그인으로 돌아가기
        </a>
        <a href="<c:url value='/member/register'/>" class="back-link">
          계정이 없으신가요? 회원가입
        </a>
      </div>
    </div>
  </div>
</div>

<script src="<c:url value='/resources/js/member/forgot-password.js'/>"></script>
</body>
</html>