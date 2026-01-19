interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface FailedLoginAttempt {
  count: number;
  lastAttempt: number;
  lockedUntil?: number;
}

class LRUMap<K, V> {
  private limit: number;
  private map: Map<K, V>;

  constructor(limit: number) {
    this.limit = limit;
    this.map = new Map<K, V>();
  }

  get(key: K): V | undefined {
    const entry = this.map.get(key);
    if (entry) {
      // Refresh key
      this.map.delete(key);
      this.map.set(key, entry);
    }
    return entry;
  }

  set(key: K, value: V): void {
    if (this.map.has(key)) {
      // Refresh key
      this.map.delete(key);
    } else if (this.map.size >= this.limit) {
      // Evict oldest
      const firstKey = this.map.keys().next().value;
      if (firstKey !== undefined) {
        this.map.delete(firstKey);
      }
    }
    this.map.set(key, value);
  }

  delete(key: K): boolean {
    return this.map.delete(key);
  }

  entries(): IterableIterator<[K, V]> {
    return this.map.entries();
  }
}

const MAX_STORE_SIZE = 10000;
const rateLimitStore = new LRUMap<string, RateLimitEntry>(MAX_STORE_SIZE);
const failedLoginAttempts = new LRUMap<string, FailedLoginAttempt>(MAX_STORE_SIZE);

const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 5; // Max 5 requests per window
const MAX_FAILED_ATTEMPTS = 5; // Max 5 failed login attempts
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes lockout

export function checkRateLimit(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // Lazy cleanup: if entry is expired, treat as new
  if (!entry || now > entry.resetTime) {
    // Clean up the expired entry if it exists
    if (entry) {
      rateLimitStore.delete(identifier);
    }
    
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

  // Lazy cleanup: check if lockout has expired
  if (entry.lockedUntil && now >= entry.lockedUntil) {
    // Lockout expired, start fresh
    failedLoginAttempts.delete(identifier);
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

// Cleanup function that can be called periodically
function cleanupExpiredEntries(): void {
  const now = Date.now();
  
  // Clean up expired rate limit entries
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
  
  // Clean up expired failed login attempts
  // Remove entries that are locked and expired, OR entries older than 24 hours
  const FAILED_ATTEMPT_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours
  for (const [key, entry] of failedLoginAttempts.entries()) {
    const shouldDelete = 
      (entry.lockedUntil && now > entry.lockedUntil) || // Lockout expired
      (now - entry.lastAttempt > FAILED_ATTEMPT_EXPIRY); // Old attempt
    
    if (shouldDelete) {
      failedLoginAttempts.delete(key);
    }
  }
}

// Only run cleanup in non-serverless environments
// In serverless/edge environments, cleanup happens naturally via cold starts
if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
  setInterval(cleanupExpiredEntries, 60 * 1000); // Clean up every minute in dev
}
