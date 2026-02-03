
import { csrfTokens, generateCsrfToken } from '../lib/csrf';

async function main() {
  console.log('Starting CSRF verification...');

  // 1. Verify Lazy Cleanup
  console.log('Test 1: Verifying Lazy Cleanup (Oldest-First Expired)...');

  // Inject an expired token at the beginning (oldest)
  const expiredToken = 'expired-token-' + Date.now();
  // Using a Map hack to ensure it's first?
  // Map insertion order is key. If the map is empty, this is easy.
  // If not empty, we clear it first for deterministic testing.
  csrfTokens.clear();

  csrfTokens.set(expiredToken, { expiresAt: Date.now() - 10000 }); // Expired 10s ago

  // Add some valid tokens after it
  csrfTokens.set('valid-token-1', { expiresAt: Date.now() + 10000 });

  console.log(`Before generate: Map size = ${csrfTokens.size}, has expired token? ${csrfTokens.has(expiredToken)}`);

  // Trigger cleanup via generation
  const newToken = generateCsrfToken();

  if (csrfTokens.has(expiredToken)) {
    console.error('FAIL: Expired token was NOT removed.');
    process.exit(1);
  } else {
    console.log('PASS: Expired token was removed.');
  }

  // 2. Verify Max Capacity
  console.log('\nTest 2: Verifying Max Capacity...');
  csrfTokens.clear();

  // Fill up to 6000 items (assuming limit is 5000)
  // We use a constant expiry far in the future so nothing expires naturally during the test
  const futureExpiry = Date.now() + 1000000;

  // We can't easily override the internal expiry logic of generateCsrfToken,
  // but we can manually populate the map to simulate "pre-existing" tokens,
  // then call generateCsrfToken to trigger eviction.
  // However, generateCsrfToken uses randomBytes.
  // Let's just call generateCsrfToken 5500 times.

  const TARGET_SIZE = 5500;
  console.log(`Generating ${TARGET_SIZE} tokens...`);

  for (let i = 0; i < TARGET_SIZE; i++) {
    generateCsrfToken();
  }

  console.log(`Final Map Size: ${csrfTokens.size}`);

  if (csrfTokens.size > 5000) {
    console.error(`FAIL: Map size ${csrfTokens.size} exceeds 5000 limit.`);
    process.exit(1);
  } else {
    console.log('PASS: Map size is bounded at 5000.');
  }

  console.log('\nAll tests passed. Script should exit now (proving no lingering setInterval).');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
