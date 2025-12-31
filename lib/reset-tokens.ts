import jwt from 'jsonwebtoken';

// JWT-based reset tokens (stateless, works in serverless environments)
const RESET_TOKEN_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface ResetTokenPayload {
  email: string;
  expires: number;
}

/**
 * Creates a JWT-based password reset token
 * @param email User's email address
 * @returns JWT token string
 */
export function createResetToken(email: string): string {
  const expires = Date.now() + 3600000; // 1 hour from now
  
  const payload: ResetTokenPayload = {
    email,
    expires,
  };
  
  return jwt.sign(payload, RESET_TOKEN_SECRET, { expiresIn: '1h' });
}

/**
 * Validates a password reset token and returns the email
 * @param token JWT token string
 * @returns Email if valid, null if invalid
 */
export function validateResetToken(token: string): string | null {
  try {
    const decoded = jwt.verify(token, RESET_TOKEN_SECRET) as ResetTokenPayload;
    
    // Check if token has expired
    if (Date.now() > decoded.expires) {
      return null;
    }
    
    return decoded.email;
  } catch (error) {
    console.error('Reset token validation error:', error);
    return null;
  }
}

/**
 * Legacy function for compatibility (now returns empty array)
 * This is kept for backward compatibility but no longer used
 */
export function getResetTokens(): Map<string, { email: string; expires: Date }> {
  return new Map();
}
