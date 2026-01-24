import { randomBytes } from 'crypto';

export const csrfTokens = new Map<string, { expiresAt: number }>();

const CSRF_TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hour
const MAX_CSRF_TOKENS = 5000;
const CLEANUP_INTERVAL = 60 * 1000; // 1 minute
let lastCleanupAt = 0;

function maybeCleanup() {
  const now = Date.now();
  if (now - lastCleanupAt > CLEANUP_INTERVAL) {
    cleanupTokens();
    lastCleanupAt = now;
  }
}

export function generateCsrfToken(): string {
  maybeCleanup();

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
  maybeCleanup();

  const data = csrfTokens.get(token);

  if (!data) {
    return false;
  }

  // Always delete used tokens to prevent reuse
  csrfTokens.delete(token);

  if (Date.now() > data.expiresAt) {
    return false;
  }

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

export function cleanupTokens() {
  const now = Date.now();
  // Optimization: Since tokens are inserted with a fixed TTL and never updated,
  // the Map insertion order corresponds to the expiration order.
  // We can safely break early once we encounter a non-expired token.
  for (const [token, data] of csrfTokens.entries()) {
    if (now > data.expiresAt) {
      csrfTokens.delete(token);
    } else {
      break;
    }
  }
}
