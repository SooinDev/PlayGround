package com.playground.controller;

import com.playground.exception.EmailDuplicateException;
import com.playground.exception.NicknameDuplicateException;
import com.playground.service.MemberService;
import com.playground.vo.MemberVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpSession;

@Controller
@RequestMapping("/member")
public class MemberController {

  @Autowired
  MemberService memberService;

  @GetMapping("/register")
  public String register() {
    return "member/register";
  }

  @PostMapping("/register")
  public String register(MemberVO memberVO, RedirectAttributes rttr) {

    try {
      memberService.register(memberVO);
      return "redirect:/member/login";
    } catch (EmailDuplicateException | NicknameDuplicateException e) {
      rttr.addFlashAttribute("errorMessage", e.getMessage());
      return "redirect:/member/register";
    }
  }

  @GetMapping("/login")
  public String login() {
    return "member/login";
  }

  @PostMapping("/login")
  public String login(HttpSession session, MemberVO memberVO, RedirectAttributes rttr) {

    MemberVO loginMember = memberService.login(memberVO);

    if (loginMember != null) {
      session.setAttribute("loginMember", loginMember);
      return "redirect:/";
    } else {
      rttr.addFlashAttribute("errorMessage", "이메일 또는 비밀번호가 일치하지 않습니다.");
      return "redirect:/member/login";
    }
  }

  @GetMapping("/forgot-password")
  public String forgotPassword() {
    return "member/forgot-password";
  }

  @PostMapping("/forgot-password")
  public String forgotPassword(@RequestParam("email") String email, RedirectAttributes rttr) {

    boolean isSuccess = memberService.issueTemporaryPassword(email);

    if (isSuccess) {
      // 성공: 로그인 페이지로 리다이렉트하며 성공 메시지 전달
      rttr.addFlashAttribute("successMessage", "임시 비밀번호가 이메일로 발송되었습니다. 메일을 확인해주세요.");
      return "redirect:/member/login";
    } else {
      // 실패: 다시 비밀번호 찾기 폼으로 리다이렉트하며 실패 메시지 전달
      rttr.addFlashAttribute("errorMessage", "가입되지 않은 이메일이거나, 메일 발송 중 오류가 발생했습니다.");
      return "redirect:/member/forgot-password";
    }
  }

  @GetMapping("/logout")
  public String logout(HttpSession session) {
    session.invalidate();
    return "redirect:/";
  }
}
