package com.tournax.application;

/** Branded TOURNAX / PESISM 2.0 OTP email (purple theme + per-digit table layout). */
public final class RegistrationOtpEmailTemplate {

    private static final String CODE_COLOR = "#FFF566";
    private static final String CODE_BORDER = "#DED002";

    private RegistrationOtpEmailTemplate() {}

    public static String subject() {
        return "Your TOURNAX Season 3 verification code";
    }

    public static String plainText(String code, int expiryMinutes) {
        return """
            TOURNAX — PESISM 2.0 · Season 3

            Your verification code: %s

            Enter this in the registration window to finish signing up. The code expires in %d minutes.

            If you did not register, you can ignore this email.
            """
            .formatted(code, expiryMinutes)
            .trim();
    }

    public static String html(String code, int expiryMinutes) {
        if (code == null || code.length() != OtpCodeFormat.LENGTH) {
            throw new IllegalArgumentException("OTP must be " + OtpCodeFormat.LENGTH + " digits");
        }
        return """
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="utf-8"/>
              <meta name="viewport" content="width=device-width, initial-scale=1"/>
              <meta name="color-scheme" content="dark"/>
              <title>TOURNAX verification</title>
            </head>
            <body style="margin:0;padding:0;background-color:#14051a;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;">
              <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="background-color:#14051a;padding:32px 16px;">
                <tr>
                  <td align="center">
                    <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="max-width:440px;background-color:#27092f;background:linear-gradient(165deg,#27092f 0%%,#1e0825 100%%);border-radius:16px;border:1px solid rgba(222,208,2,0.35);overflow:hidden;">
                      <tr>
                        <td style="padding:28px 28px 8px;text-align:center;">
                          <p style="margin:0;font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:#ded002;font-weight:700;">TOURNAX</p>
                          <p style="margin:6px 0 0;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(245,240,248,0.55);">PESISM 2.0 · Season 3</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 28px 4px;text-align:center;">
                          <h1 style="margin:0;font-size:22px;line-height:1.25;font-weight:800;text-transform:uppercase;color:#f5f0f8;letter-spacing:0.04em;">Verify your email</h1>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:12px 28px 16px;text-align:center;">
                          <p style="margin:0;font-size:15px;line-height:1.55;color:rgba(245,240,248,0.82);">Enter this code in the registration window to complete your sign-up.</p>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="padding:4px 16px 20px;">%s</td>
                      </tr>
                      <tr>
                        <td style="padding:0 28px 28px;text-align:center;">
                          <p style="margin:0;font-size:13px;line-height:1.5;color:rgba(245,240,248,0.55);">Expires in <strong style="color:#9938d4;">%d minutes</strong>. Did not sign up? Ignore this email.</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:16px 28px 24px;border-top:1px solid rgba(255,255,255,0.08);text-align:center;">
                          <p style="margin:0;font-size:11px;line-height:1.45;color:rgba(245,240,248,0.4);">Every win counts. Every goal matters.<br/>Community eFootball · not affiliated with Konami.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
            """
            .formatted(digitRow(code), expiryMinutes);
    }

    /** One table row, one cell per digit — stays on one line in mobile clients. */
    private static String digitRow(String code) {
        StringBuilder row = new StringBuilder();
        row.append(
            "<table role=\"presentation\" cellspacing=\"0\" cellpadding=\"0\" align=\"center\" style=\"border-collapse:separate;border-spacing:8px 0;\"><tr>"
        );
        for (int i = 0; i < code.length(); i++) {
            char d = code.charAt(i);
            row.append("<td align=\"center\" valign=\"middle\" style=\"width:44px;height:52px;");
            row.append("background:#0a0210;border:2px solid ");
            row.append(CODE_BORDER);
            row.append(";border-radius:10px;font-size:28px;font-weight:800;line-height:52px;");
            row.append("color:");
            row.append(CODE_COLOR);
            row.append(";font-family:Consolas,Monaco,Helvetica Neue,Helvetica,Arial,sans-serif;\">");
            row.append(d);
            row.append("</td>");
        }
        row.append("</tr></table>");
        row.append("<p style=\"margin:14px 0 0;font-size:13px;color:rgba(245,240,248,0.65);text-align:center;\">");
        row.append("Or copy: <strong style=\"color:");
        row.append(CODE_COLOR);
        row.append(";font-size:15px;font-weight:800;\">");
        row.append(code);
        row.append("</strong></p>");
        return row.toString();
    }
}
