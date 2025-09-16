package com.playground.service.admin;

import com.playground.mapper.admin.AdminMapper;
import com.playground.mapper.member.MemberMapper;
import com.playground.vo.admin.AdminVO;
import com.playground.vo.LoginAttemptVO;
import com.playground.vo.member.MemberVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.security.auth.login.AccountLockedException;
import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminServiceImpl implements AdminService {

  @Autowired
  AdminMapper adminMapper;

  @Autowired
  MemberMapper memberMapper;

  @Autowired
  PasswordEncoder passwordEncoder;

  @Override
  public AdminVO login(AdminVO adminVO, HttpServletRequest request) throws AccountLockedException {

    String email = adminVO.getAdminEmail();
    String ipAddress = request.getRemoteAddr(); // IP 주소 미리 가져오기

    // 계정 잠김 여부 확인
    int failCount = adminMapper.countRecentLoginFailures(email);
    if (failCount >= 5) {
      throw new AccountLockedException("5회 이상 로그인에 실패하여 계정이 10분간 잠겼습니다.");
    }

    // 이메일로 회원 정보 조회
    AdminVO dbAdmin = adminMapper.selectAdminByEmail(email);

    // 로그인 성공/실패 처리
    if (dbAdmin != null && passwordEncoder.matches(adminVO.getAdminPassword(), dbAdmin.getAdminPassword())) {
      // 로그인 성공 시
      // 실패 기록 모두 삭제
      adminMapper.deleteLoginAttempts(email);

      return dbAdmin; // 로그인 성공한 회원 정보 반환
    } else {
      // 로그인 실패 시
      // 실패 기록 DB에 추가
      LoginAttemptVO failAttempt = LoginAttemptVO.builder()
              .email(email)
              .ipAddress(ipAddress)
              .success(false)
              .attemptType("MEMBER")
              .build();
      adminMapper.insertLoginAttempt(failAttempt);

      return null; // 로그인 실패 시 null 반환
    }
  }

  /**
   * 회원 목록을 페이지에 맞게 가져오는 메서드
   * @param page
   * @return
   */
  @Override
  public Map<String, Object> getMemberList(int page) {

    int pageSize = 10;
    int offset = (page - 1) * pageSize;

    // 현재 페이지의 회원 목록 조회
    List<MemberVO> memberVOList = memberMapper.selectAllMembers(pageSize, offset);

    // 전체 회원 수 조회
    int totalMembers = memberMapper.countAllMembers();

    // 전체 페이지 수 계산
    int totalPages = (int) Math.ceil((double) totalMembers / (double) pageSize);

    // 결과를 Map에 담아 반환
    Map<String, Object> result = new HashMap<>();
    result.put("memberList", memberVOList);
    result.put("totalPages", totalPages);
    result.put("currentPage", page);

    return result;
  }
}
