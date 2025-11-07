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
    const { name, email, role, message } = await request.json();

    if (!name || !email || !role || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const resendClient = getResend();

    if (!resendClient) {
      console.error("Resend API key not configured");
      return NextResponse.json(
        { error: "Email service not configured. Please contact support." },
        { status: 500 }
      );
    }

    const { data, error } = await resendClient.emails.send({
      from: "Sylorlabs Collaborations <noreply@sylorlabs.com>",
      to: "Micah.cooley@sylorlabs.com",
      replyTo: email,
      subject: `New Collaboration Request: ${role}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
              }
              .container {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 16px;
                padding: 40px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.1);
              }
              .header {
                text-align: center;
                margin-bottom: 30px;
              }
              .logo {
                font-size: 32px;
                font-weight: bold;
                color: white;
                margin-bottom: 10px;
              }
              .badge {
                display: inline-block;
                background: rgba(255, 193, 7, 0.2);
                border: 2px solid #ffc107;
                color: #ffc107;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: bold;
                margin-bottom: 20px;
              }
              .content {
                background: white;
                padding: 30px;
                border-radius: 12px;
                margin-bottom: 20px;
              }
              h1 {
                color: #667eea;
                margin-top: 0;
                font-size: 28px;
              }
              .field {
                margin: 20px 0;
                padding: 15px;
                background: #f8f9fa;
                border-radius: 8px;
                border-left: 4px solid #667eea;
              }
              .field-label {
                font-weight: bold;
                color: #667eea;
                margin-bottom: 5px;
              }
              .field-value {
                color: #555;
              }
              .message-box {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
                border-left: 4px solid #667eea;
                white-space: pre-wrap;
              }
              .footer {
                text-align: center;
                color: rgba(255,255,255,0.8);
                font-size: 14px;
                margin-top: 20px;
              }
              .action-button {
                display: inline-block;
                background: #667eea;
                color: white;
                padding: 12px 30px;
                border-radius: 8px;
                text-decoration: none;
                font-weight: bold;
                margin-top: 10px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">Sylorlabs</div>
                <div class="badge">🤝 New Collaboration Request</div>
              </div>

              <div class="content">
                <h1>Someone Wants to Join the Team!</h1>

                <div class="field">
                  <div class="field-label">Name:</div>
                  <div class="field-value">${name}</div>
                </div>

                <div class="field">
                  <div class="field-label">Email:</div>
                  <div class="field-value">${email}</div>
                </div>

                <div class="field">
                  <div class="field-label">Role Interest:</div>
                  <div class="field-value">${role}</div>
                </div>

                <div class="field">
                  <div class="field-label">Message:</div>
                  <div class="message-box">${message}</div>
                </div>

                <p style="margin-top: 30px;">
                  <a href="mailto:${email}" class="action-button">Reply to ${name}</a>
                </p>
              </div>

              <div class="footer">
                Collaboration request from sylorlabs.com
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
