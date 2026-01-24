interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface FailedLoginAttempt {
  count: number;
  lastAttempt: number;
  lockedUntil?: number;
}

export class LRUMap<K, V> {
  private limit: number;
  private map: Map<K, V>;
  private onEvict?: (key: K, value: V) => void;

  constructor(limit: number, onEvict?: (key: K, value: V) => void) {
    this.limit = limit;
    this.map = new Map<K, V>();
    this.onEvict = onEvict;
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
        const evictedValue = this.map.get(firstKey);
        this.map.delete(firstKey);
        if (this.onEvict && evictedValue) {
          this.onEvict(firstKey, evictedValue);
        }
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
// Secondary map to track expiration order for rateLimitStore
// Map key -> resetTime. Insertion order is maintained for creation/reset.
export const rateLimitExpiry = new Map<string, number>();

export const rateLimitStore = new LRUMap<string, RateLimitEntry>(MAX_STORE_SIZE, (key) => {
  rateLimitExpiry.delete(key);
});
export const failedLoginAttempts = new LRUMap<string, FailedLoginAttempt>(MAX_STORE_SIZE);

const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 5; // Max 5 requests per window
const MAX_FAILED_ATTEMPTS = 5; // Max 5 failed login attempts
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes lockout
const FAILED_ATTEMPT_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours - expire old attempts

export function checkRateLimit(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // Lazy cleanup: if entry is expired, treat as new
  if (!entry || now > entry.resetTime) {
    // Clean up the expired entry if it exists
    if (entry) {
      rateLimitStore.delete(identifier);
      rateLimitExpiry.delete(identifier);
    }
    
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    };

    // Set in expiry map first (or after, doesn't matter as long as we maintain order)
    // We want the NEWEST expiry at the end.
    // Since we are creating a new entry with expiry = now + WINDOW, it is strictly greater/equal to any previous expiry.
    rateLimitExpiry.delete(identifier); // Ensure it moves to end
    rateLimitExpiry.set(identifier, newEntry.resetTime);

    rateLimitStore.set(identifier, newEntry);
    return { allowed: true, remaining: MAX_REQUESTS - 1, resetTime: newEntry.resetTime };
  }

  if (entry.count >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0, resetTime: entry.resetTime };
  }

  entry.count++;
  // Update store (LRU refresh) but NOT expiry map (expiry time unchanged)
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
  rateLimitExpiry.delete(identifier);
}

export function getClientIdentifier(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || 'unknown';
  return ip;
}

// Cleanup function that can be called periodically
export function cleanupExpiredEntries(): void {
  const now = Date.now();
  
  // Optimized cleanup for rateLimitStore using the expiry map
  // Since rateLimitExpiry is ordered by resetTime (insertion order),
  // we can iterate and stop as soon as we find a non-expired entry.
  for (const [key, resetTime] of rateLimitExpiry) {
    if (now > resetTime) {
      rateLimitStore.delete(key);
      rateLimitExpiry.delete(key);
    } else {
      // Optimization: Found an entry that expires in the future.
      // Since the map is sorted by expiry time, all subsequent entries are also valid.
      break;
    }
  }
  
  // Clean up expired failed login attempts
  // Remove entries that are locked and expired, OR entries older than FAILED_ATTEMPT_EXPIRY
  // Note: We keep the full iteration here as optimization is more complex due to mixed expiry types
  // and lower expected volume.
  for (const [key, entry] of failedLoginAttempts.entries()) {
    const shouldDelete = 
      (entry.lockedUntil && now > entry.lockedUntil) || // Lockout expired
      (now - entry.lastAttempt > FAILED_ATTEMPT_EXPIRY); // Old attempt
    
    if (shouldDelete) {
      failedLoginAttempts.delete(key);
    }
  }
}

// Only run cleanup in development environments
// In production/serverless/edge environments, cleanup happens naturally via cold starts and lazy cleanup
if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
  setInterval(cleanupExpiredEntries, 60 * 1000); // Clean up every minute in dev
}
