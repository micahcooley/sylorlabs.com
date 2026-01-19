import { Resend } from 'resend';

let resend: Resend | null = null;

function getResend() {
  if (!resend && process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

export async function sendVerificationEmail(email: string, username?: string): Promise<boolean> {
  try {
    const resendClient = getResend();
    if (!resendClient) {
      console.error('RESEND_API_KEY is not configured');
      return false;
    }

    const verificationToken = Buffer.from(`${email}:${Date.now()}`).toString('base64');
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const verificationUrl = `${baseUrl}/api/auth/verify-email?token=${verificationToken}`;

    const { error } = await resendClient.emails.send({
      from: 'SylorLabs <noreply@sylorlabs.com>',
      to: email,
      subject: 'Verify your SylorLabs account',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify Your Account</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #09090b; color: #ffffff;">
            <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <div style="text-align: center; margin-bottom: 40px;">
                <h1 style="font-size: 32px; margin: 0; font-weight: bold;">
                  <span style="color: #00f3ff;">Sylor</span><span style="color: #ff00ff;">Labs</span>
                </h1>
              </div>
              
              <div style="background-color: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 30px; margin-bottom: 30px;">
                <h2 style="margin-top: 0; color: #ffffff; font-size: 24px;">Verify Your Account</h2>
                <p style="color: #a0a0a0; line-height: 1.6;">
                  ${username ? `Hi ${username},` : 'Hi,'}
                </p>
                <p style="color: #a0a0a0; line-height: 1.6;">
                  Thank you for creating an account with SylorLabs. Please verify your email address by clicking the button below:
                </p>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${verificationUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(90deg, #00f3ff, #ff00ff); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                    Verify Email
                  </a>
                </div>
                
                <p style="color: #a0a0a0; line-height: 1.6; font-size: 14px;">
                  Or copy and paste this link into your browser:
                </p>
                <p style="color: #00f3ff; word-break: break-all; font-size: 13px; margin: 10px 0;">
                  ${verificationUrl}
                </p>
              </div>
              
              <p style="color: #666; text-align: center; font-size: 12px; margin-top: 40px;">
                This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
              </p>
              
              <p style="color: #666; text-align: center; font-size: 12px; margin-top: 20px;">
                © 2024 SylorLabs. All rights reserved.
              </p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Failed to send verification email:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
}

export async function sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
  try {
    const resendClient = getResend();
    if (!resendClient) {
      console.error('RESEND_API_KEY is not configured');
      return false;
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/login/password-reset?token=${resetToken}`;

    const { error } = await resendClient.emails.send({
      from: 'SylorLabs <noreply@sylorlabs.com>',
      to: email,
      subject: 'Reset your SylorLabs password',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Your Password</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #09090b; color: #ffffff;">
            <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <div style="text-align: center; margin-bottom: 40px;">
                <h1 style="font-size: 32px; margin: 0; font-weight: bold;">
                  <span style="color: #00f3ff;">Sylor</span><span style="color: #ff00ff;">Labs</span>
                </h1>
              </div>
              
              <div style="background-color: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 30px; margin-bottom: 30px;">
                <h2 style="margin-top: 0; color: #ffffff; font-size: 24px;">Reset Your Password</h2>
                <p style="color: #a0a0a0; line-height: 1.6;">
                  We received a request to reset your password. Click the button below to create a new password:
                </p>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${resetUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(90deg, #00f3ff, #ff00ff); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                    Reset Password
                  </a>
                </div>
                
                <p style="color: #a0a0a0; line-height: 1.6; font-size: 14px;">
                  Or copy and paste this link into your browser:
                </p>
                <p style="color: #00f3ff; word-break: break-all; font-size: 13px; margin: 10px 0;">
                  ${resetUrl}
                </p>
              </div>
              
              <p style="color: #666; text-align: center; font-size: 12px; margin-top: 40px;">
                This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
              </p>
              
              <p style="color: #666; text-align: center; font-size: 12px; margin-top: 20px;">
                © 2024 SylorLabs. All rights reserved.
              </p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Failed to send password reset email:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
}

export function decodeVerificationToken(token: string): { email: string; timestamp: number } | null {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [email, timestamp] = decoded.split(':');
    
    if (!email || !timestamp) {
      return null;
    }
    
    return { email, timestamp: parseInt(timestamp, 10) };
  } catch {
    return null;
  }
}

export function isTokenExpired(timestamp: number, maxAgeHours: number = 24): boolean {
  const now = Date.now();
  const maxAgeMs = maxAgeHours * 60 * 60 * 1000;
  return now - timestamp > maxAgeMs;
}
