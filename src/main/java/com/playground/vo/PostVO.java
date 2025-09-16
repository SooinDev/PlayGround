package com.playground.vo;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PostVO {

  /** 게시글 고유 번호 */
  private Long postId;

  /** 회원 고유 번호 */
  private Long memberId;

  /** 게시글 제목 */
  private String title;

  /** 게시글 내용 */
  private String content;

  /** 게시글 조회수 */
  private int viewCount;

  /** 게시글 작성 일시 */
  private LocalDateTime postCreatedAt;

  /** 게시글 수정 일시 */
  private LocalDateTime postUpdatedAt;

  private String writerNickname;
}
