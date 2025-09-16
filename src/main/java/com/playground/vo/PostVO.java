package com.playground.vo;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PostVO {

  Long postId;
  Long memberId;
  String title;
  String content;
  int viewCount;
  LocalDateTime postCreatedAt;
  LocalDateTime postUpdatedAt;
}
