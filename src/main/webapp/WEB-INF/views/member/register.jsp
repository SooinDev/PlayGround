<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<html>
<head>
  <title>회원가입</title>
  <%-- <c:url> 태그는 '/resources' 경로를 올바르게 찾아줍니다. --%>
  <link rel="stylesheet" href="<c:url value='/resources/css/style.css'/>">
</head>
<body>
<div class="form-container">
  <h2>회원가입</h2>
  <%-- form의 action 경로는 컨트롤러가 받을 URL과 일치해야 합니다. --%>
  <c:if test="${not empty errorMessage}">
    <div class="error-message">${errorMessage}</div>
  </c:if>
  <form action="<c:url value='/member/register'/>" method="post">
    <div class="form-group">
      <label for="email">이메일</label>
      <input type="email" id="email" name="email" required>
    </div>
    <div class="form-group">
      <label for="password">비밀번호</label>
      <input type="password" id="password" name="password" required>
    </div>
    <div class="form-group">
      <label for="nickname">닉네임</label>
      <input type="text" id="nickname" name="nickname" required>
    </div>
    <div class="form-group">
      <label for="name">이름</label>
      <input type="text" id="name" name="name">
    </div>
    <div class="form-group">
      <label for="phone">연락처</label>
      <input type="tel" id="phone" name="phone">
    </div>
    <div class="form-group">
      <label for="address">주소</label>
      <input type="text" id="address" name="address">
    </div>
    <button type="submit" class="submit-btn">가입하기</button>
  </form>
</div>

<script src="<c:url value='/resources/js/register.js'/>"></script>
</body>
</html>