package com.playground.interceptor;

import org.springframework.web.servlet.HandlerInterceptor;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

public class AdminCheckInterceptor implements HandlerInterceptor {

  @Override
  public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
    HttpSession session = request.getSession(false);

    if (session == null || session.getAttribute("loginAdmin") == null) {

      // 1. AJAX 요청인지 확인 (X-Requested-With 헤더 확인)
      String ajaxHeader = request.getHeader("X-Requested-With");
      boolean isAjax = "XMLHttpRequest".equals(ajaxHeader);

      if (isAjax) {
        // 2. AJAX 요청이면, 401 Unauthorized 에러와 함께 JSON 응답
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401 상태 코드
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write("{\"error\": \"SESSION_EXPIRED\", \"message\": \"세션이 만료되었습니다. 다시 로그인해주세요.\"}");
        return false; // 컨트롤러 진행 중단
      } else {
        // 3. 일반 요청이면, 기존처럼 로그인 페이지로 리다이렉트
        response.sendRedirect(request.getContextPath() + "/admin/login");
        return false;
      }
    }

    return true; // 로그인 상태이면 통과
  }
}