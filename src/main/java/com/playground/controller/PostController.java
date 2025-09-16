package com.playground.controller;

import com.playground.service.PostService;
import com.playground.vo.member.MemberVO;
import com.playground.vo.PostVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpSession;
import java.util.Map;

@Controller
@RequestMapping("/posts")
public class PostController {

  @Autowired
  private PostService postService;

  /**
   * 게시글 목록 보기
   * @param page
   * @param model
   * @return
   */
  @GetMapping("")
  public String getPostList(@RequestParam(defaultValue = "1") int page, Model model) {
    try {
      Map<String, Object> result = postService.getPostList(page);
      model.addAttribute("postList", result.get("postList"));
      model.addAttribute("totalPages", result.get("totalPages"));
      model.addAttribute("currentPage", result.get("currentPage"));
      model.addAttribute("totalPosts", result.get("totalPosts"));
    } catch (Exception e) {
      e.printStackTrace();
    }
    return "post/post-list";
  }

  /**
   * 게시글 상세 보기
   * @param postId
   * @param model
   * @return
   */
  // postId가 숫자일 경우에만 이 메소드 호출
  @GetMapping("/{postId:[0-9]+}")
  public String getPost(@PathVariable("postId") Long postId, Model model) {
    try {
      PostVO post = postService.getPost(postId);
      model.addAttribute("post", post);
    } catch (Exception e) {
      e.printStackTrace();
    }
    return "post/post-detail";
  }

  /**
   * 게시글 작성폼
   * @return
   */
  @GetMapping("/new")
  public String showWriteForm() {
    // 이 주소는 인터셉터가 로그인 여부를 체크해야 합니다.
    return "post/post-form";
  }

  /**
   * 게시글 작성
   * @param post
   * @param session
   * @return
   */
  @PostMapping("/create")
  public String createPost(PostVO post, HttpSession session) {
    MemberVO loginMember = (MemberVO) session.getAttribute("loginMember");
    post.setMemberId(loginMember.getMemberId()); // 작성자 ID 설정
    postService.createPost(post);
    return "redirect:/posts";
  }

  /**
   * 게시글 수정폼
   * @param postId
   * @param session
   * @param model
   * @param rttr
   * @return
   */
  @GetMapping("/{postId}/edit")
  public String showEditForm(@PathVariable("postId") Long postId, HttpSession session, Model model, RedirectAttributes rttr) {
    PostVO post = postService.getPost(postId);
    MemberVO loginMember = (MemberVO) session.getAttribute("loginMember");

    // 글 작성자와 로그인한 사용자가 같은지 권한 확인
    if (post.getMemberId().equals(loginMember.getMemberId())) {
      model.addAttribute("post", post);
      return "post/post-form"; // 폼에 기존 데이터를 채워서 보여줌
    } else {
      rttr.addFlashAttribute("errorMessage", "수정 권한이 없습니다.");
      return "redirect:/posts";
    }
  }

  /**
   * 게시글 수정
   * @param post
   * @param session
   * @param rttr
   * @return
   */
  @PostMapping("/update")
  public String updatePost(PostVO post, HttpSession session, RedirectAttributes rttr) {
    MemberVO loginMember = (MemberVO) session.getAttribute("loginMember");
    try {
      postService.updatePost(post, loginMember.getMemberId());
    } catch (Exception e) {
      rttr.addFlashAttribute("errorMessage", e.getMessage());
    }
    return "redirect:/posts/" + post.getPostId();
  }

  /**
   * 게시글 삭제
   * @param postId
   * @param session
   * @param rttr
   * @return
   */
  @PostMapping("/{postId}/delete")
  public String deletePost(@PathVariable("postId") Long postId, HttpSession session, RedirectAttributes rttr) {
    MemberVO loginMember = (MemberVO) session.getAttribute("loginMember");
    try {
      postService.deletePost(postId, loginMember.getMemberId());
      rttr.addFlashAttribute("successMessage", "게시글이 삭제되었습니다.");
    } catch (Exception e) {
      rttr.addFlashAttribute("errorMessage", e.getMessage());
    }
    return "redirect:/posts";
  }
}