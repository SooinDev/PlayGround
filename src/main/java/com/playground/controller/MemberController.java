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
    System.out.println("========= POST /member/register 요청 발생 =========");
    System.out.println("전달받은 MemberVO: " + memberVO.toString());

    try {
      memberService.register(memberVO);
      return "redirect:/login";
    } catch (EmailDuplicateException | NicknameDuplicateException e) {
      rttr.addFlashAttribute("errorMessage", e.getMessage());
      return "redirect:/member/register";
    }

  }
}
