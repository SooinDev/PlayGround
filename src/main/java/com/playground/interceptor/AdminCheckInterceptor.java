package com.playground.interceptor;

import org.springframework.web.servlet.HandlerInterceptor;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

public class AdminCheckInterceptor implements HandlerInterceptor {

  @Override
  public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

    HttpSession session = request.getSession(false);

    // 세션에 "loginAdmin" 정보가 없으면
    if (session == null || session.getAttribute("loginAdmin") == null) {
      // 관리자 로그인 페이지로 리다이렉트
      response.sendRedirect(request.getContextPath() + "/admin/login");
      return false; // 컨트롤러 진행 중단
    }

    // "loginAdmin" 정보가 있으면 통과
    return true;
  }
}