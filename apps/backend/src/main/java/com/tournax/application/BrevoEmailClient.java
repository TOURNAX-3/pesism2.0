package com.tournax.application;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.tournax.application.exception.EmailDeliveryException;
import jakarta.mail.internet.AddressException;
import jakarta.mail.internet.InternetAddress;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

/**
 * Brevo transactional email over HTTPS — use on Railway/Vercel-style hosts that block outbound SMTP.
 * API key from Brevo → SMTP &amp; API → API keys ({@code xkeysib-…}), not the SMTP password alone.
 */
@Component
public class BrevoEmailClient {

    private static final Logger log = LoggerFactory.getLogger(BrevoEmailClient.class);

    private final RestClient client;
    private final String apiKey;

    public BrevoEmailClient(@Value("${BREVO_API_KEY:}") String apiKey) {
        this.apiKey = apiKey == null ? "" : apiKey.trim();
        this.client = RestClient.builder().baseUrl("https://api.brevo.com").build();
    }

    public boolean isConfigured() {
        return !apiKey.isEmpty();
    }

    public void sendMultipart(String from, String toEmail, String subject, String text, String html) {
        if (!isConfigured()) {
            throw new IllegalStateException("BREVO_API_KEY is not set");
        }
        Sender sender = parseSender(from);
        var payload =
            new SendSmtpEmailRequest(
                sender,
                List.of(new Recipient(toEmail)),
                subject,
                html,
                text
            );
        try {
            client.post()
                .uri("/v3/smtp/email")
                .header("api-key", apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(payload)
                .retrieve()
                .toBodilessEntity();
        } catch (RestClientResponseException ex) {
            log.warn("Brevo API error {}: {}", ex.getStatusCode().value(), ex.getResponseBodyAsString());
            throw new EmailDeliveryException(
                "We could not send the verification email. Check the address or try again shortly.",
                ex
            );
        } catch (Exception ex) {
            throw new EmailDeliveryException("We could not send the verification email. Try again shortly.", ex);
        }
    }

    private static Sender parseSender(String raw) {
        try {
            InternetAddress parsed = InternetAddress.parse(raw, false)[0];
            String email = parsed.getAddress();
            String name = parsed.getPersonal();
            if (name == null || name.isBlank()) {
                name = "TOURNAX";
            }
            return new Sender(name.trim(), email);
        } catch (AddressException ex) {
            throw new EmailDeliveryException("Invalid MAIL_FROM address.", ex);
        }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private record SendSmtpEmailRequest(
        Sender sender,
        List<Recipient> to,
        String subject,
        String htmlContent,
        String textContent
    ) {}

    private record Sender(String name, String email) {}

    private record Recipient(String email) {}
}
