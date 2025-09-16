package com.playground.service.admin;

import com.playground.vo.admin.AdminVO;

import javax.security.auth.login.AccountLockedException;
import javax.servlet.http.HttpServletRequest;
import java.util.Map;

public interface AdminService {

  AdminVO login(AdminVO adminVO, HttpServletRequest request) throws AccountLockedException;

  Map<String, Object> getMemberList(int page);
}
