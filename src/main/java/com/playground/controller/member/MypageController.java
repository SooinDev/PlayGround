package com.playground.controller.member;

import com.playground.service.MemberService;
import com.playground.vo.member.MemberVO;
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
   * 프로필 수정 (닉네임, 이메일, 기타 정보)
   * @param formVO
   * @param session
   * @param rttr
   * @return
   */
  @PostMapping("/mypage")
  public String updateProfile(MemberVO formVO, HttpSession session, RedirectAttributes rttr) {
    try {
      MemberVO loginMember = (MemberVO) session.getAttribute("loginMember");
      formVO.setMemberId(loginMember.getMemberId());

      // 수정 명령 (이 메소드가 끝나면 DB에 완전히 COMMIT)
      memberService.updateInfo(formVO);

      // 수정이 끝난 후, 완전히 새로운 트랜잭션으로 최신 정보를 다시 조회
      MemberVO updatedMember = memberService.getMemberById(loginMember.getMemberId());

      // 최신 정보로 세션 갱신
      session.setAttribute("loginMember", updatedMember);
      rttr.addFlashAttribute("successMessage", "회원 정보가 성공적으로 수정되었습니다.");

    } catch (Exception e) {
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
      return "redirect:/member/mypage";
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
      return "redirect:/member/mypage";
    }
  }
}