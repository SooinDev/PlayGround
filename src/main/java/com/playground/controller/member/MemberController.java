package com.playground.controller.member;

import com.playground.service.member.MemberService;
import com.playground.vo.member.MemberVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

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
   * 이메일 중복확인 API - 호환성 수정
   */
  @PostMapping("/check-email")
  @ResponseBody
  public Map<String, Object> checkEmailDuplicate(@RequestParam("email") String email) {
    Map<String, Object> response = new HashMap<>();

    try {
      // 이메일 형식 검증
      if (email == null || email.trim().isEmpty()) {
        response.put("success", false);
        response.put("message", "이메일을 입력해주세요.");
        return response;
      }

      // 이메일 형식 정규표현식 검증
      String emailRegex = "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$";
      if (!email.matches(emailRegex)) {
        response.put("success", false);
        response.put("message", "올바른 이메일 형식을 입력해주세요.");
        return response;
      }

      // DB에서 중복 확인
      boolean isDuplicated = memberService.isEmailDuplicated(email);

      if (isDuplicated) {
        response.put("success", false);
        response.put("message", "이미 사용중인 이메일입니다.");
      } else {
        response.put("success", true);
        response.put("message", "사용 가능한 이메일입니다.");
      }

      return response;

    } catch (Exception e) {
      response.put("success", false);
      response.put("message", "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      return response;
    }
  }

  /**
   * 닉네임 중복확인 API - 호환성 수정
   */
  @PostMapping("/check-nickname")
  @ResponseBody
  public Map<String, Object> checkNicknameDuplicate(@RequestParam("nickname") String nickname) {
    Map<String, Object> response = new HashMap<>();

    try {
      System.out.println("=== 닉네임 중복확인 시작 ===");
      System.out.println("입력된 닉네임: [" + nickname + "]");

      // 닉네임 형식 검증
      if (nickname == null || nickname.trim().isEmpty()) {
        System.out.println("닉네임이 null이거나 빈 문자열");
        response.put("success", false);
        response.put("message", "닉네임을 입력해주세요.");
        return response;
      }

      // 닉네임 길이 및 형식 검증
      String nicknameRegex = "^[a-zA-Z0-9가-힣_]{2,20}$";
      if (!nickname.matches(nicknameRegex)) {
        System.out.println("닉네임 형식 검증 실패: " + nickname);
        response.put("success", false);
        response.put("message", "닉네임은 2-20자의 영문, 한글, 숫자, 언더스코어만 사용 가능합니다.");
        return response;
      }

      System.out.println("닉네임 형식 검증 통과");

      // DB에서 중복 확인
      boolean isDuplicated = memberService.isNicknameDuplicated(nickname);

      System.out.println("DB 중복 확인 결과: " + isDuplicated);

      if (isDuplicated) {
        response.put("success", false);
        response.put("message", "이미 사용중인 닉네임입니다.");
      } else {
        response.put("success", true);
        response.put("message", "사용 가능한 닉네임입니다.");
      }

      System.out.println("=== 닉네임 중복확인 완료 ===");
      return response;

    } catch (Exception e) {
      System.out.println("=== 닉네임 중복확인 에러 발생 ===");
      System.out.println("에러 클래스: " + e.getClass().getName());
      System.out.println("에러 메시지: " + e.getMessage());
      e.printStackTrace();

      response.put("success", false);
      response.put("message", "서버 오류가 발생했습니다: " + e.getMessage());
      return response;
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