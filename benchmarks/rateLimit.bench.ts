
import { performance } from 'perf_hooks';

// --- Types ---
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface FailedLoginAttempt {
  count: number;
  lastAttempt: number;
  lockedUntil?: number;
}

// --- Constants ---
const ITERATIONS = 100_000;
const EXPIRED_COUNT = 20_000; // 20% expired
const STALE_THRESHOLD = 24 * 60 * 60 * 1000;

// --- Setup Data ---
function setupRateLimitStore() {
    const store = new Map<string, RateLimitEntry>();
    const now = Date.now();
    for (let i = 0; i < ITERATIONS; i++) {
        // First batch is expired, second batch is valid
        // This simulates chronological insertion where oldest expire first
        const isExpired = i < EXPIRED_COUNT;
        const resetTime = isExpired ? now - 1000 : now + 60000;
        store.set(`key_${i}`, { count: 1, resetTime });
    }
    return store;
}

function setupFailedLoginStore() {
    const store = new Map<string, FailedLoginAttempt>();
    const now = Date.now();
    for (let i = 0; i < ITERATIONS; i++) {
        // First batch is stale
        const isStale = i < EXPIRED_COUNT;
        const lastAttempt = isStale ? now - STALE_THRESHOLD - 1000 : now;
        store.set(`key_${i}`, { count: 1, lastAttempt });
    }
    return store;
}

// --- Benchmarks ---

function benchRateLimit() {
    console.log('\n--- Benchmarking Rate Limit Cleanup ---');
    const now = Date.now();

    // 1. Baseline (O(N))
    const store1 = setupRateLimitStore();
    const start1 = performance.now();
    let deleted1 = 0;
    for (const [key, entry] of store1.entries()) {
        if (now > entry.resetTime) {
            store1.delete(key);
            deleted1++;
        }
    }
    const end1 = performance.now();
    console.log(`Baseline (O(N)): ${(end1 - start1).toFixed(4)}ms (Deleted: ${deleted1})`);

    // 2. Optimized (O(k))
    const store2 = setupRateLimitStore();
    const start2 = performance.now();
    let deleted2 = 0;
    for (const [key, entry] of store2.entries()) {
        if (now > entry.resetTime) {
            store2.delete(key);
            deleted2++;
        } else {
            // Since store is sorted by time, we can stop early
            break;
        }
    }
    const end2 = performance.now();
    console.log(`Optimized (O(k)): ${(end2 - start2).toFixed(4)}ms (Deleted: ${deleted2})`);
}

function benchFailedLogin() {
    console.log('\n--- Benchmarking Failed Login Cleanup (Stale Check) ---');
    const now = Date.now();

    // 1. Baseline (O(N))
    const store1 = setupFailedLoginStore();
    const start1 = performance.now();
    let deleted1 = 0;
    for (const [key, entry] of store1.entries()) {
        // Simulate checking for stale
        if (now > entry.lastAttempt + STALE_THRESHOLD) {
            store1.delete(key);
            deleted1++;
        }
    }
    const end1 = performance.now();
    console.log(`Baseline (O(N)): ${(end1 - start1).toFixed(4)}ms (Deleted: ${deleted1})`);

    // 2. Optimized (O(k))
    const store2 = setupFailedLoginStore();
    const start2 = performance.now();
    let deleted2 = 0;
    for (const [key, entry] of store2.entries()) {
        if (now > entry.lastAttempt + STALE_THRESHOLD) {
            store2.delete(key);
            deleted2++;
        } else {
            // Since store is sorted by lastAttempt, we can stop early
            break;
        }
    }
    const end2 = performance.now();
    console.log(`Optimized (O(k)): ${(end2 - start2).toFixed(4)}ms (Deleted: ${deleted2})`);
}

// --- Run ---
benchRateLimit();
benchFailedLogin();
