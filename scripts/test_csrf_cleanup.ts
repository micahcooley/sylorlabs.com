
import { csrfTokens, cleanupTokens } from '../lib/csrf';

function runVerification() {
  console.log('Starting verification...');

  // Clear existing tokens
  csrfTokens.clear();

  const now = Date.now();

  // Add 10 expired tokens (older)
  for (let i = 0; i < 10; i++) {
    csrfTokens.set(`expired-${i}`, { expiresAt: now - 10000 });
  }

  // Add 10 valid tokens (newer)
  for (let i = 0; i < 10; i++) {
    csrfTokens.set(`valid-${i}`, { expiresAt: now + 10000 });
  }

  console.log('Initial size:', csrfTokens.size); // Should be 20

  cleanupTokens();

  console.log('Size after cleanup:', csrfTokens.size); // Should be 10

  let expiredCount = 0;
  let validCount = 0;

  for (const [key] of csrfTokens.entries()) {
    if (key.startsWith('expired-')) expiredCount++;
    if (key.startsWith('valid-')) validCount++;
  }

  if (expiredCount === 0 && validCount === 10) {
    console.log('✅ Verification PASSED: All expired tokens removed, valid tokens retained.');
    process.exit(0);
  } else {
    console.error(`❌ Verification FAILED: Expired count: ${expiredCount}, Valid count: ${validCount}`);
    process.exit(1);
  }
}

runVerification();
