import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, findUserByEmail, users, User } from '@/lib/auth';
import { resetTokens } from '../request/route';

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      );
    }

    // Validate token
    const resetData = resetTokens.get(token);
    
    if (!resetData) {
      return NextResponse.json(
        { error: 'Invalid reset token' },
        { status: 400 }
      );
    }

    if (new Date() > resetData.expires) {
      resetTokens.delete(token);
      return NextResponse.json(
        { error: 'Reset token has expired' },
        { status: 400 }
      );
    }

    // Find user and update password
    const user = users.find((u: User) => u.email === resetData.email);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Hash new password
    const hashedPassword = await hashPassword(password);
    
    // Update user password
    user.password = hashedPassword;
    
    // Remove used token
    resetTokens.delete(token);

    console.log(`Password reset successful for user: ${user.email}`);

    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully'
    });

  } catch (error) {
    console.error('Password reset confirmation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
