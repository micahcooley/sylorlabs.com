
import {
  rateLimitStore,
  rateLimitExpiry,
  checkRateLimit,
  cleanupExpiredEntries,
  clearRateLimit,
  LRUMap
} from '../lib/rateLimit';

async function runTests() {
  console.log('Starting Correctness Tests...');

  // Clear everything
  for (const key of rateLimitStore.entries()) {
    rateLimitStore.delete(key[0]);
    rateLimitExpiry.delete(key[0]);
  }
  // Clear expiry map manually just in case
  rateLimitExpiry.clear();

  // Test 1: Basic Insertion and Expiry Map
  console.log('Test 1: Insertion syncs with Expiry Map');
  checkRateLimit('user1');
  if (!rateLimitStore.get('user1')) throw new Error('user1 not in store');
  if (!rateLimitExpiry.has('user1')) throw new Error('user1 not in expiry map');
  console.log('Passed Test 1');

  // Test 2: Updates don't duplicate or mess up order
  console.log('Test 2: Updates preserve expiry order');
  // Ensure time passes for different resetTime?
  // Actually checkRateLimit uses Date.now(). If run too fast, resetTime might be same.
  // But Map insertion order is preserved even if values are same.

  // Wait a tick
  await new Promise(r => setTimeout(r, 10));

  checkRateLimit('user2'); // Created after user1

  // Expiry order should be user1, user2
  let keys = [...rateLimitExpiry.keys()];
  if (keys[0] !== 'user1' || keys[1] !== 'user2') throw new Error(`Wrong order: ${keys}`);

  // Update user1 (count++)
  checkRateLimit('user1');
  // Should NOT change expiry order (resetTime unchanged, insertion not re-done)
  keys = [...rateLimitExpiry.keys()];
  if (keys[0] !== 'user1' || keys[1] !== 'user2') throw new Error(`Order changed after update: ${keys}`);
  console.log('Passed Test 2');

  // Test 3: Eviction
  console.log('Test 3: LRU Eviction cleans expiry map');

  const expiryTracker = new Map<string, number>();
  const testStore = new LRUMap<string, any>(2, (key, val) => {
    expiryTracker.delete(key);
  });

  testStore.set('a', 1); expiryTracker.set('a', 100);
  testStore.set('b', 2); expiryTracker.set('b', 200);
  // Full (2 items).
  testStore.set('c', 3); expiryTracker.set('c', 300);

  // 'a' should be evicted (oldest access).
  if (testStore.get('a')) throw new Error('a was not evicted');
  if (expiryTracker.has('a')) throw new Error('a was not removed from expiry tracker');
  if (!testStore.get('b')) throw new Error('b missing');
  if (!testStore.get('c')) throw new Error('c missing');
  console.log('Passed Test 3');

  // Test 4: Cleanup Logic
  console.log('Test 4: Cleanup Logic');

  // We manually populate to simulate scenario
  const now = Date.now();

  // Clear real store
  for (const k of rateLimitStore.entries()) {
      rateLimitStore.delete(k[0]);
      rateLimitExpiry.delete(k[0]);
  }

  rateLimitStore.set('expired1', { count: 1, resetTime: now - 1000 });
  rateLimitExpiry.set('expired1', now - 1000);

  rateLimitStore.set('valid1', { count: 1, resetTime: now + 10000 });
  rateLimitExpiry.set('valid1', now + 10000);

  // Insert an expired item that violates time ordering (should not happen in real usage but tests robustness)
  // If we inserted it *after* valid1, it comes *after* in Map.
  rateLimitStore.set('expired2', { count: 1, resetTime: now - 500 });
  rateLimitExpiry.set('expired2', now - 500);

  cleanupExpiredEntries();

  if (rateLimitStore.get('expired1')) throw new Error('expired1 not cleaned');
  if (!rateLimitStore.get('valid1')) throw new Error('valid1 wrongly cleaned');

  // Check expired2
  if (rateLimitStore.get('expired2')) {
      console.log('Note: expired2 was NOT cleaned (expected due to "break" optimization)');
  } else {
       throw new Error('expired2 WAS cleaned - this means "break" did not work or map order is wrong');
  }

  console.log('Passed Test 4');

  // Test 5: clearRateLimit
  console.log('Test 5: clearRateLimit');
  rateLimitStore.set('toDelete', { count: 1, resetTime: now + 10000 });
  rateLimitExpiry.set('toDelete', now + 10000);

  clearRateLimit('toDelete');
  if (rateLimitStore.get('toDelete')) throw new Error('toDelete failed');
  if (rateLimitExpiry.has('toDelete')) throw new Error('toDelete left in expiry map');
  console.log('Passed Test 5');

  console.log('All Correctness Tests Passed!');
}

runTests().catch(e => {
  console.error(e);
  process.exit(1);
});
