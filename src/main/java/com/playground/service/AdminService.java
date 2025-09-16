package com.playground.service;

import com.playground.vo.AdminVO;

import javax.security.auth.login.AccountLockedException;
import javax.servlet.http.HttpServletRequest;
import java.util.Map;

public interface AdminService {

  AdminVO login(AdminVO adminVO, HttpServletRequest request) throws AccountLockedException;

  Map<String, Object> getMemberList(int page);
}
