interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface FailedLoginAttempt {
  count: number;
  lastAttempt: number;
  lockedUntil?: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();
const failedLoginAttempts = new Map<string, FailedLoginAttempt>();

const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 5; // Max 5 requests per window
const MAX_FAILED_ATTEMPTS = 5; // Max 5 failed login attempts
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes lockout

export function checkRateLimit(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry || now > entry.resetTime) {
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    };
    rateLimitStore.set(identifier, newEntry);
    return { allowed: true, remaining: MAX_REQUESTS - 1, resetTime: newEntry.resetTime };
  }

  if (entry.count >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0, resetTime: entry.resetTime };
  }

  entry.count++;
  rateLimitStore.set(identifier, entry);
  return { allowed: true, remaining: MAX_REQUESTS - entry.count, resetTime: entry.resetTime };
}

export function recordFailedLogin(identifier: string): { locked: boolean; remainingAttempts: number; lockedUntil?: number } {
  const now = Date.now();
  const entry = failedLoginAttempts.get(identifier);

  if (!entry) {
    const newEntry: FailedLoginAttempt = {
      count: 1,
      lastAttempt: now,
    };
    failedLoginAttempts.set(identifier, newEntry);
    return { locked: false, remainingAttempts: MAX_FAILED_ATTEMPTS - 1 };
  }

  if (entry.lockedUntil && now < entry.lockedUntil) {
    return { locked: true, remainingAttempts: 0, lockedUntil: entry.lockedUntil };
  }

  entry.count++;
  entry.lastAttempt = now;

  if (entry.count >= MAX_FAILED_ATTEMPTS) {
    entry.lockedUntil = now + LOCKOUT_DURATION;
    failedLoginAttempts.set(identifier, entry);
    return { locked: true, remainingAttempts: 0, lockedUntil: entry.lockedUntil };
  }

  failedLoginAttempts.set(identifier, entry);
  return { locked: false, remainingAttempts: MAX_FAILED_ATTEMPTS - entry.count };
}

export function resetFailedLoginAttempts(identifier: string): void {
  failedLoginAttempts.delete(identifier);
}

export function clearRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier);
}

export function getClientIdentifier(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || 'unknown';
  return ip;
}

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
  for (const [key, entry] of failedLoginAttempts.entries()) {
    if (entry.lockedUntil && now > entry.lockedUntil) {
      failedLoginAttempts.delete(key);
    }
  }
}, 60 * 1000); // Clean up every minute
