package com.playground.service.impl;

import com.playground.exception.EmailDuplicateException;
import com.playground.exception.NicknameDuplicateException;
import com.playground.mapper.MemberMapper;
import com.playground.service.MemberService;
import com.playground.vo.LoginAttemptVO;
import com.playground.vo.MemberVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.mail.internet.MimeMessage;
import javax.security.auth.login.AccountLockedException;
import javax.servlet.http.HttpServletRequest;
import java.util.UUID;

@Service
public class MemberServiceImpl implements MemberService {

  @Autowired
  MemberMapper memberMapper;

  @Autowired
  PasswordEncoder passwordEncoder;

  @Autowired
  JavaMailSender mailSender;

  /**
   * 회원 가입
   * @param memberVO
   * @throws EmailDuplicateException
   * @throws NicknameDuplicateException
   */
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

  /**
   * 로그인
   * @param memberVO
   * @param request
   * @return
   * @throws AccountLockedException
   */
  @Override
  public MemberVO login(MemberVO memberVO, HttpServletRequest request) throws AccountLockedException {

    String email = memberVO.getEmail();
    String ipAddress = request.getRemoteAddr(); // IP 주소 미리 가져오기

    // 계정 잠김 여부 확인
    int failCount = memberMapper.countRecentLoginFailures(email);
    if (failCount >= 5) {
      throw new AccountLockedException("5회 이상 로그인에 실패하여 계정이 10분간 잠겼습니다.");
    }

    // 이메일로 회원 정보 조회
    MemberVO dbMember = memberMapper.selectMemberByEmail(email);

    // 로그인 성공/실패 처리
    if (dbMember != null && passwordEncoder.matches(memberVO.getPassword(), dbMember.getPassword())) {
      // 로그인 성공
      // 실패 기록 모두 삭제
      memberMapper.deleteLoginAttempts(email);

      return dbMember; // 로그인 성공한 회원 정보 반환
    } else {
      // --- 로그인 실패 ---
      // 실패 기록 DB에 추가
      LoginAttemptVO failAttempt = LoginAttemptVO.builder()
              .email(email)
              .ipAddress(ipAddress)
              .success(false)
              .attemptType("MEMBER")
              .build();
      memberMapper.insertLoginAttempt(failAttempt);

      return null; // 로그인 실패 시 null 반환
    }
  }

  /**
   * 비밀번호 찾기
   * @param email
   * @param encodedPassword
   */
  @Override
  public void forgotPassword(String email, String encodedPassword) {
    MemberVO dbMember = memberMapper.selectMemberByEmail(email);

    if (dbMember != null) {
      memberMapper.updatePassword(email, encodedPassword);
    }
  }

  /**
   * 임시 비밀번호 발급
   * @param email
   * @return
   */
  @Override
  public boolean issueTemporaryPassword(String email) {
    MemberVO member = memberMapper.selectMemberByEmail(email);

    if (member != null) {
      String tempPassword = UUID.randomUUID().toString().substring(0, 8);
      String encodedPassword = passwordEncoder.encode(tempPassword);
      memberMapper.updatePassword(email, encodedPassword);

      // 이메일 발송
      try {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");
        helper.setTo(email);
        helper.setSubject("[PlayGround] 임시 비밀번호 안내");
        // HTML 형식으로 메일 내용 작성
        String htmlContent = "<h3>임시 비밀번호 발급</h3>"
                + "<p>회원님의 임시 비밀번호는 <strong>" + tempPassword + "</strong> 입니다.</p>"
                + "<p>로그인 후 즉시 비밀번호를 변경해주세요.</p>";
        helper.setText(htmlContent, true);

        mailSender.send(mimeMessage);
        return true; // 이메일 발송 성공
      } catch (Exception e) {
        e.printStackTrace();
        return false; // 이메일 발송 실패
      }
    }
    return false; // 회원이 존재하지 않음
  }
}
