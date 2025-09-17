package com.playground.controller.admin;

import com.playground.service.admin.AdminService;
import com.playground.vo.MemberStatus;
import com.playground.vo.admin.AdminVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/admin")
public class AdminController {

  @Autowired
  AdminService adminService;

  /**
   * 로그인 페이지 로드
   * @return
   */
  @GetMapping("/login")
  public String showLoginForm() {
    return "admin/admin-login";
  }

  @PostMapping("/login")
  public String login(AdminVO adminVO, HttpServletRequest request, HttpSession session, RedirectAttributes rttr) {
    try {
      AdminVO loginAdmin = adminService.login(adminVO, request);

      if (loginAdmin != null) {
        session.setAttribute("loginAdmin", loginAdmin);
        return "redirect:/admin/admin-dashboard";
      } else {
        rttr.addFlashAttribute("errorMessage", "이메일 또는 비밀번호가 일치하지 않습니다.");
        return "redirect:/admin/login";
      }
    } catch (Exception e) {
      // 계정 잠김, DB 오류 등 모든 예외 처리
      rttr.addFlashAttribute("errorMessage", e.getMessage());
      return "redirect:/admin/login";
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

  @GetMapping("/admin-dashboard")
  public String dashboard() {
    return "admin/admin-dashboard";
  }

  @GetMapping("/members")
  public String members(@RequestParam(defaultValue = "1") int page, Model model) {

    try {
      // 회원 목록과 페이징 정보 받음
      Map<String, Object> result = adminService.getMemberList(page);

      // 받은 데이터를 Model에 담아 JSP로 전달
      model.addAttribute("memberList", result.get("memberList"));
      model.addAttribute("totalPages", result.get("totalPages"));
      model.addAttribute("currentPage", result.get("currentPage"));

    } catch (Exception e) {
      e.printStackTrace();
    }

    return "admin/member-list";
  }

//  @PostMapping("/members/update-status")
//  public String updateMemberStatus(@RequestParam("memberId") Long memberId,
//                                   @RequestParam("status") MemberStatus status,
//                                   RedirectAttributes rttr) {
//    try {
//      adminService.changeMemberStatus(memberId, status);
//      rttr.addFlashAttribute("successMessage", "회원 상태가 성공적으로 변경되었습니다.");
//    } catch (Exception e) {
//      rttr.addFlashAttribute("errorMessage", "상태 변경 중 오류가 발생했습니다.");
//      e.printStackTrace();
//    }
//
//    return "redirect:/admin/members";
//  }

  /**
   * 회원 상태 변경 API (RESTful)
   * @param memberId URL 경로에서 추출한 회원 ID
   * @param payload JavaScript가 보낸 JSON 데이터 (예: {"status": "SUSPENDED"})
   * @return 처리 결과를 담은 JSON
   */
  @PutMapping("/members/{memberId}/status")
  @ResponseBody // 이 메소드는 뷰(JSP)가 아닌 JSON 데이터를 반환
  public ResponseEntity<Map<String, Object>> updateMemberStatusREST(@PathVariable("memberId") Long memberId,
                                                                    @RequestBody Map<String, String> payload) {
    Map<String, Object> response = new HashMap<>();
    try {
      // payload에서 'status' 값을 꺼내 MemberStatus enum으로 변환
      MemberStatus status = MemberStatus.valueOf(payload.get("status"));

      adminService.changeMemberStatus(memberId, status);

      // 성공 응답
      response.put("success", true);
      response.put("message", "회원 상태가 성공적으로 변경되었습니다.");
      return ResponseEntity.ok(response);

    } catch (Exception e) {
      // 실패 응답
      response.put("success", false);
      response.put("message", "상태 변경 중 오류가 발생했습니다.");
      e.printStackTrace();
      return ResponseEntity.internalServerError().body(response);
    }
  }
}
