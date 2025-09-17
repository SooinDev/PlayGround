package com.playground.interceptor;

import org.springframework.web.servlet.HandlerInterceptor;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

public class LoginCheckInterceptor implements HandlerInterceptor {

  @Override
  public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

    // 현재 요청의 세션 가져오기
    HttpSession session = request.getSession(false); // 세션이 없으면 새로 만들지 않음

    // 세션이 없거나, 세션에 "loginMember" 정보가 없는지 확인
    if (session == null || session.getAttribute("loginMember") == null) {
      response.sendRedirect(request.getContextPath() + "/member/login");

      return false;
    }

    // 로그인 상태이므로 true 반환
    return true;
  }
}
