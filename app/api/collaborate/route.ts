import { NextResponse } from "next/server";
import { Resend } from "resend";

// Lazy initialization to avoid build-time errors
let resend: Resend | null = null;

function getResend() {
  if (!resend && process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

export async function POST(request: Request) {
  try {
    const { name, email, message, type } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const resendClient = getResend();

    if (!resendClient) {
      console.error("Resend API key not configured");
      return NextResponse.json(
        { error: "Email service not configured. Please add your RESEND_API_KEY to .env.local" },
        { status: 500 }
      );
    }

    // Send notification to Sylorlabs
    const { data, error } = await resendClient.emails.send({
      from: "Sylorlabs <noreply@sylorlabs.com>",
      to: "Micah.cooley@sylorlabs.com",
      replyTo: email,
      subject: "New Feature Request",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Feature Request Received</title>
            <style>
              body {
                font-family: system-ui, -apple-system, sans-serif;
                background-color: #0f172a;
                color: #e2e8f0;
                margin: 0;
                padding: 40px 20px;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
                border-radius: 16px;
                padding: 40px;
                border: 1px solid #334155;
              }
              .header {
                text-align: center;
                margin-bottom: 40px;
              }
              .logo {
                font-size: 28px;
                font-weight: bold;
                background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                margin-bottom: 10px;
              }
              .badge {
                display: inline-block;
                padding: 8px 16px;
                background: rgba(99, 102, 241, 0.2);
                border: 1px solid #6366f1;
                border-radius: 20px;
                font-size: 14px;
                color: #a5b4fc;
                margin-bottom: 20px;
              }
              .content {
                background: rgba(15, 23, 42, 0.5);
                border-radius: 12px;
                padding: 30px;
                margin-bottom: 30px;
              }
              .field {
                margin-bottom: 20px;
              }
              .label {
                font-weight: 600;
                color: #a5b4fc;
                margin-bottom: 8px;
                font-size: 14px;
                text-transform: uppercase;
                letter-spacing: 0.05em;
              }
              .value {
                font-size: 16px;
                line-height: 1.6;
                color: #e2e8f0;
              }
              .message {
                background: rgba(99, 102, 241, 0.1);
                border-left: 4px solid #6366f1;
                padding: 20px;
                border-radius: 8px;
                margin-top: 20px;
              }
              .footer {
                text-align: center;
                color: #64748b;
                font-size: 14px;
              }
              .checkmark {
                width: 48px;
                height: 48px;
                margin: 0 auto 20px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">SYLORLABS</div>
                <div class="badge">New Feature Request</div>
                <h1>New Feature Request!</h1>
              </div>
              
              <div class="content">
                <div class="field">
                  <div class="label">From</div>
                  <div class="value">${name} &lt;${email}&gt;</div>
                </div>
                
                <div class="field">
                  <div class="label">Message</div>
                  <div class="message">${message.replace(/\n/g, "<br>")}</div>
                </div>
              </div>
              
              <div class="footer">
                Feature request from sylorlabs.com
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("Resend API error:", error);
      return NextResponse.json(
        { error: "Failed to send notification" },
        { status: 500 }
      );
    }

    // Send automatic reply to the sender
    const replyResult = await resendClient.emails.send({
      from: "Sylorlabs <noreply@sylorlabs.com>",
      to: email,
      subject: "Thank you for sharing your ideas with Sylorlabs!",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Thank You - Sylorlabs</title>
            <style>
              body {
                font-family: system-ui, -apple-system, sans-serif;
                background-color: #0f172a;
                color: #e2e8f0;
                margin: 0;
                padding: 40px 20px;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
                border-radius: 16px;
                padding: 40px;
                border: 1px solid #334155;
              }
              .header {
                text-align: center;
                margin-bottom: 40px;
              }
              .logo {
                font-size: 28px;
                font-weight: bold;
                background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                margin-bottom: 10px;
              }
              .checkmark {
                width: 64px;
                height: 64px;
                margin: 0 auto 20px;
              }
              .content {
                text-align: center;
              }
              .title {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 20px;
                color: #a5b4fc;
              }
              .message {
                font-size: 16px;
                line-height: 1.6;
                color: #e2e8f0;
                margin-bottom: 30px;
              }
              .footer {
                text-align: center;
                color: #64748b;
                font-size: 14px;
                margin-top: 40px;
              }
              .footer a {
                color: #6366f1;
                text-decoration: none;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">SYLORLABS</div>
                <div class="checkmark">
                  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="32" cy="32" r="30" stroke="#6366f1" stroke-width="3" fill="none"/>
                    <path d="M20 32 L28 40 L44 24" stroke="#6366f1" stroke-width="4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              
              <div class="content">
                <h1 class="title">Thank You!</h1>
                <p class="message">
                  Thank you for sharing your ideas with Sylorlabs! We've received your message and will read every suggestion carefully.
                  Your feedback helps us build Zenith DAW for producers like you.
                </p>
                <p class="message">
                  We'll reach out if we need more details about your ideas. Stay tuned for beta access!
                </p>
              </div>
              
              <div class="footer">
                <p>Building Zenith DAW • <a href="https://sylorlabs.com">sylorlabs.com</a></p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("Resend API error:", error);
      return NextResponse.json(
        { error: "Failed to send email. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Message sent successfully!", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Collaborate endpoint error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
