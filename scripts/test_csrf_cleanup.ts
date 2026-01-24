
import { csrfTokens, cleanupTokens, generateCsrfToken, validateCsrfToken } from '../lib/csrf';

function assert(condition: boolean, message: string) {
    if (!condition) {
        console.error(`❌ Assertion failed: ${message}`);
        process.exit(1);
    }
    console.log(`✅ ${message}`);
}

async function runTests() {
    console.log('Starting CSRF Logic Verification...');

    // --- Test 1: FIFO Eviction ---
    console.log('\n--- Test 1: FIFO Eviction ---');
    csrfTokens.clear();

    // Manually fill 5000 items
    const LIMIT = 5000;
    for (let i = 0; i < LIMIT; i++) {
        csrfTokens.set(`manual_${i}`, { expiresAt: Date.now() + 3600000 });
    }

    assert(csrfTokens.size === LIMIT, `Map filled to ${LIMIT}`);

    // The "oldest" is currently manual_0 (first inserted)
    const oldestKey = csrfTokens.keys().next().value;
    assert(oldestKey === 'manual_0', 'Oldest key is manual_0');

    // Generate one more token (should trigger eviction)
    const newToken = generateCsrfToken();

    assert(csrfTokens.size === LIMIT, 'Size remained at limit after adding 1 more');
    assert(!csrfTokens.has('manual_0'), 'Oldest key was evicted');
    assert(csrfTokens.has(newToken), 'New key is present');


    // --- Test 2: Cleanup Correctness (Mixed Expiry) ---
    console.log('\n--- Test 2: Cleanup Correctness ---');
    csrfTokens.clear();
    const now = Date.now();

    // Insert 100 expired tokens
    for (let i = 0; i < 100; i++) {
        csrfTokens.set(`expired_${i}`, { expiresAt: now - 1000 });
    }

    // Insert 100 valid tokens
    for (let i = 0; i < 100; i++) {
        csrfTokens.set(`valid_${i}`, { expiresAt: now + 3600000 });
    }

    assert(csrfTokens.size === 200, 'Setup: 200 tokens inserted');

    // Run cleanup
    cleanupTokens();

    assert(csrfTokens.size === 100, 'Cleanup: Size reduced to 100');
    assert(!csrfTokens.has('expired_0'), 'Expired token removed');
    assert(csrfTokens.has('valid_0'), 'Valid token retained');


    // --- Test 3: Validate Consumption ---
    console.log('\n--- Test 3: Validate Consumption ---');
    const token = generateCsrfToken();
    assert(csrfTokens.has(token), 'Token generated');

    const isValid = validateCsrfToken(token);
    assert(isValid, 'Token is valid');
    assert(!csrfTokens.has(token), 'Token consumed (deleted) after validation');

    const isReused = validateCsrfToken(token);
    assert(!isReused, 'Token cannot be reused');

    console.log('\n🎉 All tests passed!');
}

runTests()
    .then(() => process.exit(0))
    .catch(e => {
        console.error(e);
        process.exit(1);
    });
