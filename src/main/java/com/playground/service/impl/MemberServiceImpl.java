package com.playground.service.impl;

import com.playground.exception.EmailDuplicateException;
import com.playground.exception.NicknameDuplicateException;
import com.playground.mapper.MemberMapper;
import com.playground.service.MemberService;
import com.playground.vo.MemberVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class MemberServiceImpl implements MemberService {

  @Autowired
  MemberMapper memberMapper;

  @Autowired
  PasswordEncoder passwordEncoder;

  @Override
  public void register(MemberVO memberVO) throws EmailDuplicateException, NicknameDuplicateException {

    // 1. 이메일 중복 체크
    if (memberMapper.isEmailDuplicated(memberVO.getEmail())) {
      throw new EmailDuplicateException("이미 사용 중인 이메일입니다.");
    }

    // 2. 닉네임 중복 체크
    if (memberMapper.isNicknameDuplicated(memberVO.getNickname())) {
      throw new NicknameDuplicateException("이미 사용 중인 닉네임입니다.");
    }

    // 3. 비밀번호 암호화
    String rawPassword = memberVO.getPassword();
    String encodedPassword = passwordEncoder.encode(rawPassword);
    memberVO.setPassword(encodedPassword);

    // 4. DB에 저장
    memberMapper.insertMember(memberVO);
  }

  @Override
  public MemberVO login(MemberVO memberVO) {
    MemberVO dbMember = memberMapper.selectMemberByEmail(memberVO.getEmail());

    if (dbMember != null) {
      String rawPassword = memberVO.getPassword();      // 사용자가 입력한 순수 비밀번호
      String encodedPassword = dbMember.getPassword();  // DB에 저장된 암호화된 비밀번호

      if (passwordEncoder.matches(rawPassword, encodedPassword)) {
        return dbMember;
      }
    }

    // 이메일이 없거나 비밀번호가 틀린 경우, null 반환
    return null;
  }
}
