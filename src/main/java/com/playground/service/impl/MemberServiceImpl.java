package com.playground.service.impl;

import com.playground.exception.EmailDuplicateException;
import com.playground.exception.NicknameDuplicateException;
import com.playground.mapper.MemberMapper;
import com.playground.service.MemberService;
import com.playground.vo.MemberVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.mail.internet.MimeMessage;
import java.util.UUID;

@Service
public class MemberServiceImpl implements MemberService {

  @Autowired
  MemberMapper memberMapper;

  @Autowired
  PasswordEncoder passwordEncoder;

  @Autowired
  JavaMailSender mailSender;

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
