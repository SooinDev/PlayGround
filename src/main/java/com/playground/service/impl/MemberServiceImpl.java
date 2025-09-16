package com.playground.service.impl;

import com.playground.mapper.member.MemberMapper;
import com.playground.service.MemberService;
import com.playground.vo.LoginAttemptVO;
import com.playground.vo.member.MemberVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.mail.internet.MimeMessage;
import javax.security.auth.login.AccountLockedException;
import javax.servlet.http.HttpServletRequest;
import java.time.Duration;
import java.time.LocalDateTime;
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
   * @throws Exception
   */
  @Override
  public void register(MemberVO memberVO) throws Exception {

    // 1. 이메일 중복 체크
    if (memberMapper.isEmailDuplicated(memberVO.getEmail())) {
      // 사용자 정의 예외 대신 일반 Exception 사용
      throw new Exception("이미 사용 중인 이메일입니다.");
    }

    // 2. 닉네임 중복 체크
    if (memberMapper.isNicknameDuplicated(memberVO.getNickname())) {
      // 일반 Exception 사용
      throw new Exception("이미 사용 중인 닉네임입니다.");
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
      // 로그인 성공 시
      // 실패 기록 모두 삭제
      memberMapper.deleteLoginAttempts(email);

      return dbMember; // 로그인 성공한 회원 정보 반환
    } else {
      // 로그인 실패 시
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

  /**
   * 닉네임 변경 (7일)
   * @param email
   * @param nickname
   * @return
   * @throws Exception
   */
  @Override
  public MemberVO changeNickname(String email, String nickname) throws Exception {
    MemberVO member = memberMapper.selectMemberByEmail(email);

    // 멤버가 null일 경우
    if (member == null) {
      throw new Exception("존재하지 않는 회원입니다.");
    }

    // 마지막 닉네임 변경 일자
    LocalDateTime nicknameChangedAt = member.getNicknameChangedAt();

    if (nicknameChangedAt != null) {
      LocalDateTime now = LocalDateTime.now();
      System.out.println("현재 시간: " + now);

      // 마지막 변경 일자 - 현재 시간 차이 계산
      Duration duration = Duration.between(nicknameChangedAt, now);
      long daysDiff = duration.toDays();
//      long hoursDiff = duration.toHours();
//      long minutesDiff = duration.toMinutes();

      if (daysDiff < 7) {
        long daysLeft = 7 - daysDiff;
        throw new Exception("닉네임은 7일에 한 번만 변경할 수 있습니다. (" + daysLeft + "일 남음)");
      }
    }

    // 모든 조건 충족 시
    memberMapper.updateNickname(email, nickname);

    // 변경 후 멤버 정보 다시 조회해서 반환
    return memberMapper.selectMemberByEmail(email);
  }

  /**
   * 회원 정보 수정
   * @param formVO
   * @return
   * @throws Exception
   */
  @Override
  public void updateInfo(MemberVO formVO) throws Exception {

    // DB에서 현재 정보를 ID를 기준으로 조회 (가장 안전)
    MemberVO currentMember = memberMapper.selectMemberById(formVO.getMemberId());

    if (!currentMember.getEmail().equals(formVO.getEmail())) {
      if (memberMapper.isEmailDuplicated(formVO.getEmail())) {
        throw new Exception("이미 사용 중인 이메일입니다.");
      }
    }

    if (!currentMember.getNickname().equals(formVO.getNickname())) {
      LocalDateTime lastChange = currentMember.getNicknameChangedAt();
      if (lastChange != null) {
        Duration diff = Duration.between(lastChange, LocalDateTime.now());
        if (diff.toDays() < 7) {
          long daysLeft = 7 - diff.toDays();
          throw new Exception("닉네임은 7일에 한 번만 변경할 수 있습니다. (" + daysLeft + "일 남음)");
        }
      }
    }

    // 이메일 업데이트 (필요한 경우)
    if (!currentMember.getEmail().equals(formVO.getEmail())) {
      memberMapper.updateEmail(currentMember.getEmail(), formVO.getEmail());
    }

    // 닉네임 업데이트 (필요한 경우)
    if (!currentMember.getNickname().equals(formVO.getNickname())) {
      // 이메일은 변경되었을 수 있으므로, 최신 이메일인 formVO.getEmail() 사용
      memberMapper.updateNickname(formVO.getEmail(), formVO.getNickname());
    }

    // 나머지 정보(이름, 연락처, 주소) 업데이트
    memberMapper.updateInfo(formVO);
  }

  @Override
  public void changePassword(String email, String currentPassword, String newPassword) throws Exception {

    MemberVO memberVO = memberMapper.selectMemberByEmail(email);

    // 조회된 멤버의 비밀번호와 입력된 비밀번호가 같을 때
    if (passwordEncoder.matches(currentPassword, memberVO.getPassword())) {

      // 새 비밀번호가 기존 비밀번호와 같을 때
      if (currentPassword.equals(newPassword)) {
        throw new Exception("이미 사용 중인 비밀번호입니다.");
      }

      // 입력된 비밀번호를 인코딩해서 업데이트
      String encodedPassword = passwordEncoder.encode(newPassword);

      memberMapper.updatePassword(email, encodedPassword);
    }
  }

  @Override
  public boolean isEmailDuplicated(String email) {
    return memberMapper.isEmailDuplicated(email);
  }

  @Override
  public boolean isNicknameDuplicated(String nickname) {
    return memberMapper.isNicknameDuplicated(nickname);
  }

  private void changeEmail(String currentEmail, String newEmail) throws Exception {
    if (currentEmail.equals(newEmail)) {
      return; // 변경 사항이 없으면 아무것도 하지 않음
    }
    if (memberMapper.isEmailDuplicated(newEmail)) {
      throw new Exception("이미 사용 중인 이메일입니다.");
    }
    memberMapper.updateEmail(currentEmail, newEmail);
  }

  @Override
  public MemberVO getMemberById(Long memberId) {
    return memberMapper.selectMemberById(memberId);
  }
}
