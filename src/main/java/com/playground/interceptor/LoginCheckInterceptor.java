package com.playground.interceptor;

import com.playground.vo.MemberStatus;
import com.playground.vo.member.MemberVO;
import org.springframework.web.servlet.HandlerInterceptor;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

public class LoginCheckInterceptor implements HandlerInterceptor {

  @Override
  public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
    HttpSession session = request.getSession(false);

    // 1. 기존 로그인 확인 로직
    if (session == null || session.getAttribute("loginMember") == null) {
      response.sendRedirect(request.getContextPath() + "/member/login");
      return false;
    }

    // 2. 권한 확인 로직 추가
    // 세션에서 회원 정보를 가져온다.
    MemberVO loginMember = (MemberVO) session.getAttribute("loginMember");
    MemberStatus status = loginMember.getStatus();

    // 회원의 상태가 'ACTIVE'(활성)가 아닌지 확인
    if (status != MemberStatus.ACTIVE) {
      // '정지' 또는 '비활성' 상태라면,
      // 에러 메시지를 세션에 잠시 담고 메인 페이지로 리다이렉트
      session.setAttribute("authErrorMessage", "계정이 비활성 또는 정지 상태이므로 이 작업을 수행할 수 없습니다.");
      response.sendRedirect(request.getContextPath() + "/"); // 메인 페이지로 이동
      return false; // 컨트롤러 진행 중단
    }

    // 3. 모든 검사를 통과한 경우
    return true;
  }
}
