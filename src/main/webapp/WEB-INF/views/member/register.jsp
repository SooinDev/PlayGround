<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>회원가입 - PlayGround</title>
  <link rel="stylesheet" href="<c:url value='/resources/css/style.css'/>">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
</head>
<body>
<div class="form-container">
  <h2>계정 만들기</h2>
  <p class="subtitle">PlayGround에 오신 것을 환영합니다</p>

  <c:if test="${not empty errorMessage}">
    <div class="error-message">
      <strong>오류:</strong> ${errorMessage}
    </div>
  </c:if>

  <c:if test="${not empty successMessage}">
    <div class="success-message">
      <strong>성공:</strong> ${successMessage}
    </div>
  </c:if>

  <form action="<c:url value='/member/register'/>" method="post" id="registerForm">
    <div class="form-group">
      <label for="email">이메일 주소</label>
      <input
              type="email"
              id="email"
              name="email"
              placeholder="your@email.com"
              value="${param.email}"
              required
              autocomplete="email"
      >
    </div>

    <div class="form-group">
      <label for="password">비밀번호</label>
      <input
              type="password"
              id="password"
              name="password"
              placeholder="최소 8자리 이상"
              required
              autocomplete="new-password"
              minlength="8"
      >
    </div>

    <div class="form-group">
      <label for="confirmPassword">비밀번호 확인</label>
      <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="비밀번호를 다시 입력하세요"
              required
              autocomplete="new-password"
      >
    </div>

    <div class="form-group">
      <label for="nickname">닉네임</label>
      <input
              type="text"
              id="nickname"
              name="nickname"
              placeholder="다른 사용자에게 표시될 이름"
              value="${param.nickname}"
              required
              autocomplete="username"
      >
    </div>

    <div class="form-group">
      <label for="name">실명 (선택사항)</label>
      <input
              type="text"
              id="name"
              name="name"
              placeholder="홍길동"
              value="${param.name}"
              autocomplete="name"
      >
    </div>

    <div class="form-group">
      <label for="phone">연락처 (선택사항)</label>
      <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="010-1234-5678"
              value="${param.phone}"
              autocomplete="tel"
      >
    </div>

    <div class="form-group">
      <label for="address">주소 (선택사항)</label>
      <input
              type="text"
              id="address"
              name="address"
              placeholder="서울특별시 강남구..."
              value="${param.address}"
              autocomplete="address-line1"
      >
    </div>

    <button type="submit" class="submit-btn">
      계정 만들기
    </button>
  </form>

  <div style="text-align: center; margin-top: 24px; padding-top: 24px; border-top: 1px solid rgba(0, 0, 0, 0.1);">
    <p style="font-size: 15px; color: #86868b;">
      이미 계정이 있으신가요?
      <a href="<c:url value='/member/login'/>" style="color: #007aff; text-decoration: none; font-weight: 500;">
        로그인하기
      </a>
    </p>
  </div>
</div>

<script src="<c:url value='/resources/js/register.js'/>"></script>
</body>
</html>