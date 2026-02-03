import { randomBytes } from 'crypto';

export const csrfTokens = new Map<string, { expiresAt: number }>();

const CSRF_TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hour
const MAX_CSRF_TOKENS = 5000;

export function cleanupTokens() {
  const now = Date.now();
  for (const [token, data] of csrfTokens.entries()) {
    if (now > data.expiresAt) {
      csrfTokens.delete(token);
    } else {
      // Optimization: Since Map preserves insertion order and tokens are added
      // with increasing expiry times, we can stop as soon as we find a valid token.
      break;
    }
  }
}

export function generateCsrfToken(): string {
  // Lazy cleanup: remove expired tokens before generating a new one
  cleanupTokens();

  const token = randomBytes(32).toString('hex');
  const expiresAt = Date.now() + CSRF_TOKEN_EXPIRY;

  // Evict oldest if at limit
  if (csrfTokens.size >= MAX_CSRF_TOKENS) {
    const oldestKey = csrfTokens.keys().next().value;
    if (oldestKey !== undefined) {
      csrfTokens.delete(oldestKey);
    }
  }

  csrfTokens.set(token, { expiresAt });
  return token;
}

export function validateCsrfToken(token: string): boolean {
  const data = csrfTokens.get(token);

  if (!data) {
    return false;
  }

  if (Date.now() > data.expiresAt) {
    csrfTokens.delete(token);
    return false;
  }

  csrfTokens.delete(token);
  return true;
}

export function getCsrfTokenFromRequest(request: Request): string | null {
  const contentType = request.headers.get('content-type');

  if (contentType?.includes('application/json')) {
    return null;
  }

  const url = new URL(request.url);
  return url.searchParams.get('csrf_token');
}
