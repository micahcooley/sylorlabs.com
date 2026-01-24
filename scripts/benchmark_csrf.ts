
import { csrfTokens, generateCsrfToken, cleanupTokens, validateCsrfToken } from '../lib/csrf';

// Helper to fill map
function fillMap(count: number, expiryOffset: number) {
    csrfTokens.clear();
    const now = Date.now();
    for (let i = 0; i < count; i++) {
        // We manually set to control expiry
        const token = `token_${i}`;
        csrfTokens.set(token, { expiresAt: now + expiryOffset + (i * 10) }); // Staggered expiry
    }
}

function benchmarkCleanup() {
    console.log('--- Benchmarking cleanupTokens ---');

    // Case 1: None expired
    fillMap(5000, 1000000); // Expires in future
    let start = performance.now();
    cleanupTokens();
    let end = performance.now();
    console.log(`None expired (O(N) check): ${(end - start).toFixed(4)}ms`);
    console.log(`Remaining size: ${csrfTokens.size}`);

    // Case 2: All expired
    fillMap(5000, -1000000); // Expired in past
    start = performance.now();
    cleanupTokens();
    end = performance.now();
    console.log(`All expired (O(N) delete): ${(end - start).toFixed(4)}ms`);
    console.log(`Remaining size: ${csrfTokens.size}`);

    // Case 3: Half expired (Oldest half)
    csrfTokens.clear();
    const now = Date.now();
    for (let i = 0; i < 5000; i++) {
        const token = `token_${i}`;
        // First 2500 expired, rest valid
        const expiresAt = i < 2500 ? now - 1000 : now + 100000;
        csrfTokens.set(token, { expiresAt });
    }

    start = performance.now();
    cleanupTokens();
    end = performance.now();
    console.log(`Half expired (O(N) mixed): ${(end - start).toFixed(4)}ms`);
    console.log(`Remaining size: ${csrfTokens.size}`);

    process.exit(0);
}

benchmarkCleanup();
