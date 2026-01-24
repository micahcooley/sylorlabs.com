
import { rateLimitStore, rateLimitExpiry, cleanupExpiredEntries } from '../lib/rateLimit';

// Polyfill for performance.now if needed (Node usually has it)
const { performance } = require('perf_hooks');

const STORE_SIZE = 10000;
const EXPIRED_RATIO = 0.5;

console.log(`Setting up benchmark with ${STORE_SIZE} items (${EXPIRED_RATIO * 100}% expired)...`);

// Populate store
const now = Date.now();
for (let i = 0; i < STORE_SIZE; i++) {
  const isExpired = i < STORE_SIZE * EXPIRED_RATIO;
  // If expired, resetTime is in the past.
  // If valid, resetTime is in the future.
  const resetTime = isExpired ? now - 1000 : now + 100000;
  const key = `user-${i}`;

  rateLimitStore.set(key, {
    count: 1,
    resetTime
  });
  // Manually sync expiry map for benchmark
  rateLimitExpiry.set(key, resetTime);
}

// Warmup if necessary? JS optimization?
// Usually microbenchmarks run multiple times.
// But we are measuring a single "cleanup" event which is the blocking part.

console.log('Running cleanup...');
const start = performance.now();
cleanupExpiredEntries();
const end = performance.now();

console.log(`Cleanup took ${(end - start).toFixed(4)} ms`);

let remaining = 0;
for (const _ of rateLimitStore.entries()) {
  remaining++;
}
console.log(`Remaining items: ${remaining}`);
