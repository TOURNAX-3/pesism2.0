package com.tournax.application;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.tournax.application.exception.EmailDeliveryException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

@Component
public class ResendEmailClient {

    private static final Logger log = LoggerFactory.getLogger(ResendEmailClient.class);

    private final RestClient client;
    private final String apiKey;

    public ResendEmailClient(@Value("${tournax.mail.resend-api-key:}") String apiKey) {
        this.apiKey = apiKey == null ? "" : apiKey.trim();
        this.client = RestClient.builder().baseUrl("https://api.resend.com").build();
    }

    public boolean isConfigured() {
        return !apiKey.isEmpty();
    }

    public void sendMultipart(String from, String toEmail, String subject, String text, String html) {
        if (!isConfigured()) {
            throw new IllegalStateException("RESEND_API_KEY is not set");
        }
        var payload = new SendEmailRequest(from, new String[] { toEmail }, subject, text, html);
        try {
            client.post()
                .uri("/emails")
                .header("Authorization", "Bearer " + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(payload)
                .retrieve()
                .toBodilessEntity();
        } catch (RestClientResponseException ex) {
            log.warn("Resend API error {}: {}", ex.getStatusCode().value(), ex.getResponseBodyAsString());
            throw new EmailDeliveryException(
                "We could not send the verification email. Check the address or try again shortly.",
                ex
            );
        } catch (Exception ex) {
            throw new EmailDeliveryException(
                "We could not send the verification email. Try again shortly.",
                ex
            );
        }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private record SendEmailRequest(String from, String[] to, String subject, String text, String html) {}
}
