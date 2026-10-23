import nodemailer from "nodemailer";

export interface MailPayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
  ip?: string;
}

export interface MailResult {
  sent: boolean;
  provider?: "gmail-smtp" | "custom-smtp" | "resend" | "none";
  error?: string;
}

/**
 * Dispatches an automated email notification to the administrator
 * when a visitor submits the contact form.
 *
 * Supported providers:
 * 1. Resend: set RESEND_API_KEY in .env.local
 * 2. Gmail / SMTP: set SMTP_USER and SMTP_PASS (or GMAIL_USER and GMAIL_APP_PASSWORD)
 */
export async function sendContactNotification(payload: MailPayload): Promise<MailResult> {
  const adminEmail = process.env.ADMIN_EMAIL || "sushandjain@gmail.com";
  const { name, email, subject, message, ip } = payload;
  const inquirySubject = subject || "New Portfolio Inquiry";

  // HTML email template
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Portfolio Inquiry</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0B0F19; color: #E2E8F0; margin: 0; padding: 24px; }
    .card { max-width: 600px; margin: 0 auto; background: #111827; border: 1px solid #1F2937; border-radius: 16px; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    .header { border-bottom: 1px solid #1F2937; padding-bottom: 20px; margin-bottom: 24px; }
    .badge { display: inline-block; padding: 4px 12px; background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.3); color: #818CF8; border-radius: 9999px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; }
    .title { font-size: 20px; font-weight: 800; color: #F8FAFC; margin: 12px 0 4px 0; }
    .meta-row { display: flex; margin-bottom: 12px; font-size: 13px; }
    .meta-label { width: 100px; color: #94A3B8; font-weight: 600; }
    .meta-value { color: #F1F5F9; font-weight: 500; }
    .message-box { background: #0F172A; border: 1px solid #1E293B; border-radius: 12px; padding: 20px; margin: 24px 0; font-size: 14px; line-height: 1.6; color: #CBD5E1; white-space: pre-wrap; }
    .footer { border-top: 1px solid #1F2937; padding-top: 20px; font-size: 12px; color: #64748B; text-align: center; }
    .button { display: inline-block; background: #4F46E5; color: #FFFFFF !important; font-weight: 600; font-size: 13px; text-decoration: none; padding: 10px 20px; border-radius: 8px; margin-top: 12px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <span class="badge">Portfolio Dispatch</span>
      <h2 class="title">New Contact Inquiry Received</h2>
      <p style="margin: 0; color: #94A3B8; font-size: 13px;">From your portfolio website at <strong>sushandjain.dev</strong></p>
    </div>

    <div class="meta-row">
      <span class="meta-label">From:</span>
      <span class="meta-value">${name} &lt;<a href="mailto:${email}" style="color: #818CF8;">${email}</a>&gt;</span>
    </div>
    <div class="meta-row">
      <span class="meta-label">Subject:</span>
      <span class="meta-value">${inquirySubject}</span>
    </div>
    <div class="meta-row">
      <span class="meta-label">IP Address:</span>
      <span class="meta-value" style="font-family: monospace; color: #64748B;">${ip || "Unknown"}</span>
    </div>

    <div class="message-box">
${message}
    </div>

    <div style="text-align: center; margin-bottom: 24px;">
      <a href="mailto:${email}?subject=Re: ${encodeURIComponent(inquirySubject)}" class="button">
        Reply Directly to ${name} ↗
      </a>
    </div>

    <div class="footer">
      <p>This message was dispatched from your portfolio and is also archived in your <strong>Admin Panel &rarr; Messages</strong>.</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  // 1. Try Resend if RESEND_API_KEY is configured
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const fromEmail = process.env.RESEND_FROM_EMAIL || "Portfolio Inquiries <onboarding@resend.dev>";
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [adminEmail],
          reply_to: email,
          subject: `[Portfolio Inquiry] ${inquirySubject} — from ${name}`,
          html: htmlContent,
        }),
      });

      const resData = await res.json();
      if (res.ok) {
        return { sent: true, provider: "resend" };
      }
      console.warn("[Mailer:Resend Error]", resData);
    } catch (err: any) {
      console.error("[Mailer:Resend Exception]", err?.message);
    }
  }

  // 2. Try Nodemailer SMTP (Gmail or custom SMTP server)
  const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;

  if (smtpUser && smtpPass) {
    try {
      const host = process.env.SMTP_HOST || "smtp.gmail.com";
      const port = parseInt(process.env.SMTP_PORT || "465", 10);
      const secure = process.env.SMTP_SECURE === "false" ? false : true;

      const transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: `"${name} (via Portfolio)" <${smtpUser}>`,
        to: adminEmail,
        replyTo: email,
        subject: `[Portfolio] ${inquirySubject} — from ${name}`,
        html: htmlContent,
      });

      return { sent: true, provider: "gmail-smtp" };
    } catch (err: any) {
      console.error("[Mailer:SMTP Exception]", err?.message);
      return { sent: false, error: err?.message, provider: "gmail-smtp" };
    }
  }

  // Fallback: No external email provider credentials configured yet
  return {
    sent: false,
    provider: "none",
    error: "No email provider credentials configured in .env.local",
  };
}
