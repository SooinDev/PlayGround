package com.playground.mapper;

import com.playground.vo.PostVO;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface PostMapper {

  /**
   * 게시물 작성
   * @param post
   */
  void insertPost(PostVO post);

  /**
   * 게시물 고유 번호로 게시물 조회
   * @param postId
   * @return
   */
  PostVO selectPostById(Long postId);

  /**
   * 전체 게시물 조회
   * @param limit
   * @param offset
   * @return
   */
  List<PostVO> selectAllPosts(@Param("limit") int limit, @Param("offset") int offset);

  /**
   * 전체 게시물 수 반환
   * @return
   */
  int countAllPosts();

  /**
   * 게시물 수정
   * @param post
   */
  void updatePost(PostVO post);

  /**
   * 게시물 삭제
   * @param postId
   */
  void deletePost(Long postId);

  /**
   * 조회수 증가
   * @param postId
   */
  void incrementViewCount(Long postId);
}
