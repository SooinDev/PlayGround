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
}
