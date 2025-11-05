import { Resend } from "resend";
import { NextResponse } from "next/server";

// Initialize Resend lazily to avoid build-time errors
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
      return NextResponse.json(
        { error: "Email service not configured. Please contact support." },
        { status: 500 }
      );
    }

    // Send confirmation email to the subscriber
    const { data, error } = await resendClient.emails.send({
      from: "Sylorlabs <onboarding@resend.dev>", // You'll change this to your domain later
      to: email,
      subject: "You're signed up for Sylorlabs updates! 🎵",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Sylorlabs</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; background-color: #0f172a;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 20px; padding: 60px 40px; text-align: center;">
                    <tr>
                      <td>
                        <h1 style="color: #ffffff; font-size: 42px; margin: 0 0 20px 0; font-weight: 800;">
                          SYLORLABS
                        </h1>
                        <div style="font-size: 60px; margin: 20px 0;">✓</div>
                        <h2 style="color: #ffffff; font-size: 28px; margin: 0 0 20px 0; font-weight: 700;">
                          You're signed up for Sylorlabs updates!
                        </h2>
                        <p style="color: rgba(255, 255, 255, 0.9); font-size: 18px; line-height: 1.6; margin: 0 0 30px 0;">
                          Thank you for joining our community! We'll notify you when <strong>OpenWave</strong> and <strong>Wingman</strong> launch.
                        </p>
                        <div style="background: rgba(255, 255, 255, 0.1); border-radius: 15px; padding: 30px; margin: 30px 0; backdrop-filter: blur(10px);">
                          <h3 style="color: #ffffff; font-size: 20px; margin: 0 0 15px 0;">Coming Soon:</h3>
                          <p style="color: rgba(255, 255, 255, 0.9); font-size: 16px; margin: 10px 0;">
                            🎹 <strong>OpenWave</strong> - Advanced wavetable synthesizer (FREE)
                          </p>
                          <p style="color: rgba(255, 255, 255, 0.9); font-size: 16px; margin: 10px 0;">
                            🤖 <strong>Wingman</strong> - AI-powered DAW assistant
                          </p>
                          <p style="color: rgba(255, 255, 255, 0.7); font-size: 14px; margin: 15px 0 0 0; font-style: italic;">
                            Expected Q2 2026
                          </p>
                        </div>
                        <p style="color: rgba(255, 255, 255, 0.8); font-size: 14px; margin: 30px 0 0 0;">
                          Professional VST3 Audio Tools for Music Producers
                        </p>
                      </td>
                    </tr>
                  </table>
                  <p style="color: #64748b; font-size: 12px; margin: 20px 0 0 0;">
                    © 2025 Sylorlabs. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}
