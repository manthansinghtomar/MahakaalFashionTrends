import nodemailer from 'nodemailer';

/**
 * Send Password Reset OTP Email
 * Subject: Mahakaal Fashion Trends - Password Reset OTP
 */
export const sendOtpEmail = async ({ toEmail, otp }) => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

  const subject = 'Mahakaal Fashion Trends - Password Reset OTP';
  const textContent = `Hello,

We received a request to reset your password.

Your OTP is:

${otp}

This OTP is valid for 10 minutes.

If you did not request this reset, you can safely ignore this email.

Mahakaal Fashion Trends`;

  const htmlContent = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e5e5; border-radius: 16px; overflow: hidden; color: #171717;">
      <div style="background-color: #0a0a0a; padding: 32px 24px; text-align: center;">
        <h1 style="color: #d4af37; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase;">MAHAKAAL</h1>
        <p style="color: #a3a3a3; margin: 4px 0 0 0; font-size: 11px; tracking: 3px; text-transform: uppercase;">Fashion Trends</p>
      </div>
      
      <div style="padding: 36px 32px; background-color: #ffffff;">
        <p style="font-size: 15px; color: #404040; margin-top: 0;">Hello,</p>
        <p style="font-size: 14px; color: #525252; leading: 1.6;">We received a request to reset your password for your account.</p>
        
        <div style="margin: 32px 0; padding: 24px; background-color: #fafafa; border: 1px border-solid #f5f5f5; border-radius: 12px; text-align: center;">
          <span style="font-size: 11px; font-weight: 700; color: #737373; text-transform: uppercase; letter-spacing: 2px; display: block; margin-bottom: 8px;">Your One-Time Password (OTP)</span>
          <span style="font-size: 36px; font-weight: 900; color: #0a0a0a; letter-spacing: 8px; font-family: monospace;">${otp}</span>
          <span style="font-size: 12px; color: #e11d48; display: block; margin-top: 8px; font-weight: 600;">Valid for 10 minutes</span>
        </div>

        <p style="font-size: 13px; color: #737373; margin-bottom: 0;">If you did not request this password reset, please ignore this email or contact support if you have concerns.</p>
      </div>

      <div style="background-color: #fafafa; padding: 20px 24px; border-top: 1px solid #f5f5f5; text-align: center;">
        <p style="margin: 0; font-size: 12px; color: #a3a3a3; font-weight: 600;">Mahakaal Fashion Trends</p>
      </div>
    </div>
  `;

  // Always log in console for development & debugging visibility
  console.log('\n======================================================');
  console.log(`📧 [EMAIL SENT TO]: ${toEmail}`);
  console.log(`🔑 [PASSWORD RESET OTP]: ${otp}`);
  console.log('======================================================\n');

  // If SMTP is configured, send actual email via Nodemailer
  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT) || 587,
        secure: Number(SMTP_PORT) === 465,
        auth: {
          user: SMTP_USER.trim(),
          pass: SMTP_PASS ? SMTP_PASS.replace(/\s+/g, '') : '',
        },
      });

      await transporter.sendMail({
        from: SMTP_FROM || `"Mahakaal Fashion Trends" <${SMTP_USER}>`,
        to: toEmail,
        subject,
        text: textContent,
        html: htmlContent,
      });
      return { success: true, mode: 'smtp' };
    } catch (err) {
      console.error('⚠️ SMTP Email Delivery Error:', err.message);
      // Fallback to console delivery log so testing continues gracefully
      return { success: true, mode: 'fallback-console', error: err.message };
    }
  }

  return { success: true, mode: 'console' };
};
