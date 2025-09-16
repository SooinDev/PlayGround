package com.playground.controller.admin;

import com.playground.service.AdminService;
import com.playground.vo.admin.AdminVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
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
}
