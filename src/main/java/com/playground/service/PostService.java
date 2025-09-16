package com.playground.service;

import com.playground.vo.PostVO;

import java.util.Map;

public interface PostService {

  Map<String, Object> getPostList(int page);

  PostVO getPost(Long postId);

  void createPost(PostVO post);

  void updatePost(PostVO post, Long loginMemberId) throws Exception;

  void deletePost(Long postId, Long loginMemberId) throws Exception;
}
