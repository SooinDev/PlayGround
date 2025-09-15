package com.playground.service;

import com.playground.exception.EmailDuplicateException;
import com.playground.exception.NicknameDuplicateException;
import com.playground.vo.MemberVO;

public interface MemberService {

  void register(MemberVO memberVO) throws EmailDuplicateException, NicknameDuplicateException;

  MemberVO login(MemberVO memberVO);
}
