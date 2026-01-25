import { randomBytes } from 'crypto';

/**
 * Standalone benchmark for CSRF cleanup optimization.
 *
 * We duplicate the logic here to avoid module resolution issues during benchmarking
 * and to ensure a controlled environment.
 *
 * The optimization changes the cleanup from O(N) to O(k) where k is the number of expired tokens.
 * Since tokens are inserted in order of expiration, we can break early.
 */

// --- LOGIC FROM lib/csrf.ts ---
export const csrfTokens = new Map<string, { expiresAt: number }>();

export function cleanupTokens() {
  const now = Date.now();
  for (const [token, data] of csrfTokens.entries()) {
    if (now > data.expiresAt) {
      csrfTokens.delete(token);
    } else {
      // Optimization: Break early
      break;
    }
  }
}
// -------------------------------

// Helper to format time
const formatTime = (ms: number) => {
  return `${ms.toFixed(3)}ms`;
};

async function runBenchmark() {
  console.log('Preparing benchmark (Steady State: 1 expired, 99999 active)...');

  // Clear any existing tokens
  csrfTokens.clear();

  const TOTAL_TOKENS = 100_000;
  const EXPIRED_TOKENS = 1;
  const now = Date.now();

  // Fill with expired tokens
  for (let i = 0; i < EXPIRED_TOKENS; i++) {
    const token = `expired_${i}`;
    csrfTokens.set(token, { expiresAt: now - 1000 });
  }

  // Fill with active tokens
  for (let i = 0; i < (TOTAL_TOKENS - EXPIRED_TOKENS); i++) {
    const token = `active_${i}`;
    csrfTokens.set(token, { expiresAt: now + 100000 });
  }

  console.log(`Filled map with ${csrfTokens.size} tokens (${EXPIRED_TOKENS} expired).`);

  // Measure cleanup
  const start = performance.now();
  cleanupTokens();
  const end = performance.now();

  console.log(`Cleanup took: ${formatTime(end - start)}`);
  console.log(`Remaining tokens: ${csrfTokens.size}`);
}

runBenchmark().catch(console.error);
