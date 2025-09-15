package com.playground.service.impl;

import com.playground.service.MemberService;
import com.playground.vo.MemberVO;

public class MemberServiceImpl implements MemberService {

  public int register(MemberVO memberVO) {
    if (memberVO == null) {
      return 0;
    }
    return 1;
  }
}
