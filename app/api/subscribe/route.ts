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
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
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
      from: "Sylorlabs <noreply@sylorlabs.com>",
      to: email,
      subject: "Welcome to Sylorlabs Beta Waitlist!",
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
              p {
                margin: 15px 0;
                color: #555;
              }
              .highlight {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
                border-left: 4px solid #667eea;
              }
              .products {
                margin: 20px 0;
              }
              .product {
                margin: 15px 0;
                padding-left: 20px;
              }
              .product-name {
                font-weight: bold;
                color: #667eea;
              }
              .footer {
                text-align: center;
                color: rgba(255,255,255,0.8);
                font-size: 14px;
                margin-top: 20px;
              }
              .checkmark {
                font-size: 48px;
                text-align: center;
                margin: 20px 0;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">Sylorlabs</div>
                <div class="badge">Beta Waitlist</div>
              </div>

              <div class="content">
                <div class="checkmark">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="24" cy="24" r="22" stroke="#667eea" stroke-width="3" fill="none"/>
                    <path d="M15 24 L21 30 L33 18" stroke="#667eea" stroke-width="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h1>You're on the Beta Waitlist!</h1>

                <p>Thanks for joining us on this journey! You'll be among the first to test our tools as we build them.</p>

                <div class="highlight">
                  <strong>What to expect:</strong>
                  <div class="products">
                    <div class="product">
                      <span class="product-name">Zenith DAW</span> - Professional Digital Audio Workstation<br>
                      <small>Currently: UI Development → Backend Integration → Beta → Release</small>
                    </div>
                    <div class="product">
                      <span class="product-name">Wingman AI</span> - Optional creative assistant<br>
                      <small>Currently: Research & Development</small>
                    </div>
                  </div>
                </div>

                <p>We're being completely transparent about our progress. We have UI mockups and are deep in research—exploring JUCE for audio development, testing AI models, and planning the architecture.</p>

                <p>As a beta waitlist member, you'll get:</p>
                <ul>
                  <li>Early access to test versions before anyone else</li>
                  <li>Direct input on features and workflow</li>
                  <li>Updates on development milestones</li>
                  <li>Special pricing when we launch</li>
                </ul>

                <p>We'll keep you posted as we hit major milestones. This is a real journey, and we're inviting you to be part of it.</p>

                <p style="margin-top: 30px;">
                  <strong>— The Sylorlabs Team</strong>
                </p>
              </div>

              <div class="footer">
                Building the future of music production, one step at a time.
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
      { message: "Successfully subscribed!", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Subscribe endpoint error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
