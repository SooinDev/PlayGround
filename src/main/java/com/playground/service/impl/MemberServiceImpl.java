package com.playground.service.impl;

import com.playground.exception.EmailDuplicateException;
import com.playground.exception.NicknameDuplicateException;
import com.playground.mapper.MemberMapper;
import com.playground.service.MemberService;
import com.playground.vo.MemberVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MemberServiceImpl implements MemberService {

  @Autowired
  MemberMapper memberMapper;

  @Override
  public void register(MemberVO memberVO) throws EmailDuplicateException, NicknameDuplicateException {

    // 1. 이메일 중복 체크
    if (memberMapper.isEmailDuplicated(memberVO.getEmail())) {
      // "이메일 중복"이라는 명확한 원인을 담아 예외를 발생시킴
      throw new EmailDuplicateException("이미 사용 중인 이메일입니다.");
    }

    // 2. 닉네임 중복 체크
    if (memberMapper.isNicknameDuplicated(memberVO.getNickname())) {
      // "닉네임 중복"이라는 명확한 원인을 담아 예외를 발생시킴
      throw new NicknameDuplicateException("이미 사용 중인 닉네임입니다.");
    }

    // 3. 모든 검사를 통과하면 DB에 저장
    memberMapper.insertMember(memberVO);
  }
}
