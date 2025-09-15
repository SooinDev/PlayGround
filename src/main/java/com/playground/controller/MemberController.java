package com.playground.controller;

import com.playground.service.MemberService;
import com.playground.vo.MemberVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@Controller
@RequestMapping("/member")
public class MemberController {

  @Autowired
  MemberService memberService;

  /**
   * 회원 가입 페이지 로드
   * @return
   */
  @GetMapping("/register")
  public String showRegisterForm() {
    return "member/register";
  }

  @PostMapping("/register")
  public String register(MemberVO memberVO, RedirectAttributes rttr) {
    try {
      memberService.register(memberVO);
      rttr.addFlashAttribute("successMessage", "회원가입이 완료되었습니다. 로그인해주세요.");
      return "redirect:/member/login";
    } catch (Exception e) {
      rttr.addFlashAttribute("errorMessage", e.getMessage());
      return "redirect:/member/register";
    }
  }

  /**
   * 로그인 페이지 로드
   * @return
   */
  @GetMapping("/login")
  public String showLoginForm() {
    return "member/login";
  }

  @PostMapping("/login")
  public String login(MemberVO memberVO, HttpServletRequest request, HttpSession session, RedirectAttributes rttr) {
    try {
      MemberVO loginMember = memberService.login(memberVO, request);

      if (loginMember != null) {
        session.setAttribute("loginMember", loginMember);
        return "redirect:/";
      } else {
        rttr.addFlashAttribute("errorMessage", "이메일 또는 비밀번호가 일치하지 않습니다.");
        return "redirect:/member/login";
      }
    } catch (Exception e) {
      // 계정 잠김, DB 오류 등 모든 예외 처리
      rttr.addFlashAttribute("errorMessage", e.getMessage());
      return "redirect:/member/login";
    }
  }

  /**
   * 로그아웃
   * @param session
   * @return
   */
  @GetMapping("/logout")
  public String logout(HttpSession session) {
    session.invalidate();
    return "redirect:/";
  }

  /**
   * 비밀번호 찾기
   * @return
   */
  @GetMapping("/forgot-password")
  public String showForgotPasswordForm() {
    return "member/forgot-password";
  }

  @PostMapping("/forgot-password")
  public String forgotPassword(@RequestParam("email") String email, RedirectAttributes rttr) {
    boolean isSuccess = memberService.issueTemporaryPassword(email);
    if (isSuccess) {
      rttr.addFlashAttribute("successMessage", "임시 비밀번호가 이메일로 발송되었습니다. 메일을 확인해주세요.");
      return "redirect:/member/login";
    } else {
      rttr.addFlashAttribute("errorMessage", "가입되지 않은 이메일이거나, 메일 발송 중 오류가 발생했습니다.");
      return "redirect:/member/forgot-password";
    }
  }
}