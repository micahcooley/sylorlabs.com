import { NextRequest, NextResponse } from 'next/server';
import { resetTokens } from '../request/route';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Check if token exists and is not expired
    const resetData = resetTokens.get(token);
    
    if (!resetData) {
      return NextResponse.json(
        { error: 'Invalid reset token' },
        { status: 400 }
      );
    }

    if (new Date() > resetData.expires) {
      // Remove expired token
      resetTokens.delete(token);
      return NextResponse.json(
        { error: 'Reset token has expired' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      email: resetData.email
    });

  } catch (error) {
    console.error('Token validation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
