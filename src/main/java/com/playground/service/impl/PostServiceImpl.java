package com.playground.service.impl;

import com.playground.mapper.PostMapper;
import com.playground.service.PostService;
import com.playground.vo.PostVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PostServiceImpl implements PostService {

  @Autowired
  PostMapper postMapper;

  /**
   * 게시물 목록 조회
   * @param page
   * @return
   */
  @Override
  public Map<String, Object> getPostList(int page) {

    // 페이징 계산에 필요한 변수 설정
    int pageSize = 10; // 한 페이지에 보여줄 게시물 수
    int offset = (page - 1) * pageSize; // DB 조회 시작 위치 계산

    // DB에서 현재 페이지에 해당하는 게시물 목록을 가져오기 (결과는 List 타입)
    List<PostVO> postList = postMapper.selectAllPosts(pageSize, offset);

    // DB에서 전체 게시물 수를 가져오기
    int totalPosts = postMapper.countAllPosts();

    // 전체 페이지 수 계산
    int totalPages = (int) Math.ceil((double) totalPosts / pageSize);

    // 컨트롤러에 전달할 결과 데이터를 Map에 담는다.
    Map<String, Object> result = new HashMap<>();
    result.put("postList", postList);       // 게시물 목록
    result.put("totalPages", totalPages);   // 전체 페이지 수
    result.put("currentPage", page);        // 현재 페이지 번호
    result.put("totalPosts", totalPosts);   // 총 게시물 수

    // 모든 정보가 담긴 Map 반환
    return result;
  }

  /**
   * 게시물 조회
   * @param postId
   * @return
   */
  @Override
  public PostVO getPost(Long postId) {

    // DB에서 게시글 가져오기 전, 조회수 1 증가
    postMapper.incrementViewCount(postId);

    // 게시물 정보 반환
    return postMapper.selectPostById(postId);
  }

  /**
   * 게시물 작성
   * @param post
   */
  @Override
  public void createPost(PostVO post) {

    postMapper.insertPost(post);
  }

  /**
   * 게시물 수정
   * @param post
   * @param loginMemberId
   * @throws Exception
   */
  @Override
  @Transactional
  public void updatePost(PostVO post, Long loginMemberId) throws Exception {
    PostVO originalPost = postMapper.selectPostById(post.getPostId());

    // 게시물이 존재하고, 게시물의 작성자 ID와 현재 로그인한 사용자의 ID가 일치하는지 확인
    if (originalPost != null && originalPost.getMemberId().equals(loginMemberId)) {
      // 권한이 있으면 수정
      postMapper.updatePost(post);
    } else {
      // 게시물이 없거나, 권한이 없으면 예외 발생
      throw new Exception("수정 권한이 없거나 존재하지 않는 게시물입니다.");
    }
  }

  /**
   * 게시물 삭제
   * @param postId
   * @param loginMemberId
   * @throws Exception
   */
  @Override
  @Transactional
  public void deletePost(Long postId, Long loginMemberId) throws Exception {
    PostVO originalPost = postMapper.selectPostById(postId);

    // 게시물이 존재하고, 게시물의 작성자 ID와 현재 로그인한 사용자의 ID가 일치하는지 확인
    if (originalPost != null && originalPost.getMemberId().equals(loginMemberId)) {
      // 권한이 있으면 삭제
      postMapper.deletePost(postId);
    } else {
      // 게시물이 없거나, 권한이 없으면 예외 발생
      throw new Exception("삭제 권한이 없거나 존재하지 않는 게시물입니다.");
    }
  }
}
