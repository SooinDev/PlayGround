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

import javax.servlet.http.HttpSession;

@Controller
@RequestMapping("/member")
public class MypageController {

  @Autowired
  private MemberService memberService;

  /**
   * 마이페이지 로드
   * @return
   */
  @GetMapping("/mypage")
  public String mypage() {
    return "member/mypage";
  }

  /**
   * 프로필 수정
   * @param memberVO
   * @param session
   * @param rttr
   * @return
   */
  @PostMapping("/mypage")
  public String updateProfile(MemberVO memberVO, HttpSession session, RedirectAttributes rttr) {
    System.out.println("=== 프로필 업데이트 시작 ===");
    System.out.println("받은 데이터 - 닉네임: " + memberVO.getNickname());
    System.out.println("받은 데이터 - 이메일: " + memberVO.getEmail());
    System.out.println("받은 데이터 - 이름: " + memberVO.getName());

    try {
      MemberVO loginMember = (MemberVO) session.getAttribute("loginMember");
      String email = loginMember.getEmail();
      String oldNickname = loginMember.getNickname();

      System.out.println("기존 닉네임: " + oldNickname);
      System.out.println("새 닉네임: " + memberVO.getNickname());

      // VO에 email 정보 추가
      memberVO.setEmail(email);

      // 닉네임이 변경되었는지 확인
      if (!oldNickname.equals(memberVO.getNickname())) {
        System.out.println("닉네임 변경 감지 - changeNickname 호출");
        // 닉네임 변경 시 changeNickname 서비스 호출
        memberService.changeNickname(email, memberVO.getNickname());
        System.out.println("changeNickname 완료");
      } else {
        System.out.println("닉네임 변경 없음");
      }

      System.out.println("updateInfo 호출 중...");
      MemberVO updatedMember = memberService.updateInfo(memberVO);
      System.out.println("updateInfo 완료");

      // 세션 정보도 최신으로 갱신합니다.
      session.setAttribute("loginMember", updatedMember);
      rttr.addFlashAttribute("successMessage", "회원 정보가 성공적으로 수정되었습니다.");
      System.out.println("=== 프로필 업데이트 성공 ===");

    } catch (Exception e) {
      System.err.println("=== 프로필 업데이트 실패 ===");
      System.err.println("에러 메시지: " + e.getMessage());
      e.printStackTrace(); // 전체 스택 트레이스 출력
      rttr.addFlashAttribute("errorMessage", e.getMessage());
    }
    return "redirect:/member/mypage";
  }

  /**
   * 비밀번호 변경
   * @param currentPassword
   * @param newPassword
   * @param confirmPassword
   * @param session
   * @param rttr
   * @return
   */
  @PostMapping("/password/change")
  public String changePassword(@RequestParam("currentPassword") String currentPassword,
                               @RequestParam("newPassword") String newPassword,
                               @RequestParam("confirmPassword") String confirmPassword,
                               HttpSession session,
                               RedirectAttributes rttr) {

    if (!newPassword.equals(confirmPassword)) {
      rttr.addFlashAttribute("errorMessage", "새 비밀번호가 일치하지 않습니다.");
      return "redirect:/mypage";
    }

    MemberVO loginMember = (MemberVO) session.getAttribute("loginMember");
    String email = loginMember.getEmail();

    try {
      memberService.changePassword(email, currentPassword, newPassword);

      // 보안을 위해 비밀번호 변경 후 로그아웃 시키고 재로그인 유도
      session.invalidate();
      rttr.addFlashAttribute("successMessage", "비밀번호가 성공적으로 변경되었습니다. 다시 로그인해주세요.");
      return "redirect:/member/login";

    } catch (Exception e) {
      rttr.addFlashAttribute("errorMessage", e.getMessage());
      return "redirect:/mypage";
    }
  }
}