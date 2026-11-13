package com.tournax.application;

import com.tournax.application.exception.EmailDeliveryException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

@Component
public class RegistrationEmailSender {

    private static final Logger log = LoggerFactory.getLogger(RegistrationEmailSender.class);

    private final JavaMailSender mailSender;
    private final ResendEmailClient resend;
    private final BrevoEmailClient brevo;
    private final boolean smtpEnabled;
    private final String brevoSmtpKey;
    private final String fromAddress;
    private final String deliveryMode;

    public RegistrationEmailSender(
        ObjectProvider<JavaMailSender> mailSender,
        ResendEmailClient resend,
        BrevoEmailClient brevo,
        @Value("${tournax.mail.enabled:false}") boolean smtpEnabled,
        @Value("${BREVO_SMTP_KEY:}") String brevoSmtpKey,
        @Value("${tournax.mail.from:TOURNAX <noreply@tournax.local>}") String fromAddress,
        @Value("${tournax.mail.delivery:auto}") String deliveryMode
    ) {
        this.mailSender = mailSender.getIfAvailable();
        this.resend = resend;
        this.brevo = brevo;
        this.smtpEnabled = smtpEnabled;
        this.brevoSmtpKey = brevoSmtpKey == null ? "" : brevoSmtpKey.trim();
        this.fromAddress = fromAddress;
        this.deliveryMode = deliveryMode == null ? "auto" : deliveryMode.trim().toLowerCase();
    }

    public void sendVerificationCode(String toEmail, String code, int expiryMinutes) {
        String subject = RegistrationOtpEmailTemplate.subject();
        String plainText = RegistrationOtpEmailTemplate.plainText(code, expiryMinutes);
        String html = buildHtmlSafely(code, expiryMinutes);

        if (useConsoleOnly()) {
            log.warn(
                "MAIL_DELIVERY=console — OTP for {}: {} (set BREVO_SMTP_* or RESEND_API_KEY for real email)",
                maskEmail(toEmail),
                code
            );
            return;
        }

        if (resend.isConfigured()) {
            resend.sendMultipart(fromAddress, toEmail, subject, plainText, html);
            log.info("OTP email sent via Resend to {}", maskEmail(toEmail));
            return;
        }

        if (brevo.isConfigured()) {
            brevo.sendMultipart(fromAddress, toEmail, subject, plainText, html);
            log.info("OTP email sent via Brevo API to {}", maskEmail(toEmail));
            return;
        }

        if (smtpConfigured() && mailSender != null) {
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
                helper.setFrom(parseFrom(fromAddress));
                helper.setTo(toEmail);
                helper.setSubject(subject);
                helper.setText(plainText, html);
                mailSender.send(message);
                log.info("OTP email sent via SMTP to {}", maskEmail(toEmail));
            } catch (Exception ex) {
                log.error("SMTP send failed for {}: {}", maskEmail(toEmail), ex.getMessage());
                throw new EmailDeliveryException(
                    "We could not send the verification email. Try again shortly.",
                    ex
                );
            }
            return;
        }

        throw new EmailDeliveryException(
            "Email delivery is not configured. Set BREVO_API_KEY (recommended on Railway), RESEND_API_KEY, or BREVO_SMTP_*."
        );
    }

    private static String buildHtmlSafely(String code, int expiryMinutes) {
        try {
            if (code == null || code.length() != OtpCodeFormat.LENGTH) {
                return null;
            }
            return RegistrationOtpEmailTemplate.html(code, expiryMinutes);
        } catch (Exception ex) {
            log.warn("HTML OTP template failed, using plain text only: {}", ex.getMessage());
            return "<p>Your TOURNAX code: <strong>" + code + "</strong></p>";
        }
    }

    private static InternetAddress parseFrom(String raw) throws Exception {
        InternetAddress[] parsed = InternetAddress.parse(raw, false);
        return parsed[0];
    }

    private boolean smtpConfigured() {
        return smtpEnabled || !brevoSmtpKey.isEmpty();
    }

    /** auto = live when Resend or SMTP is configured; live = always send; console = dev log only. */
    private boolean useConsoleOnly() {
        if ("console".equals(deliveryMode)) {
            return true;
        }
        if ("live".equals(deliveryMode)) {
            return false;
        }
        return !resend.isConfigured()
            && !brevo.isConfigured()
            && !(smtpConfigured() && mailSender != null);
    }

    private static String maskEmail(String email) {
        if (email == null || !email.contains("@")) {
            return "***";
        }
        int at = email.indexOf('@');
        String local = email.substring(0, at);
        String maskedLocal = local.length() <= 2 ? "**" : local.charAt(0) + "***";
        return maskedLocal + email.substring(at);
    }
}
