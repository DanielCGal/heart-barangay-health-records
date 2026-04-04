package HEART.example.HEART.Controllers.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailOtpSender {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String fromEmail;

    @Value("${app.mail.fromName:HEART}")
    private String fromName;

    public MailOtpSender(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOtp(String toEmail, String code) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(fromEmail);
        msg.setTo(toEmail);
        msg.setSubject("Your verification code");
        msg.setText("""
                Hello,

                Your verification code is: %s

                This code expires in 10 minutes.
                If you did not request this, you can ignore this email.

                - %s
                """.formatted(code, fromName));

        mailSender.send(msg);
    }
}

