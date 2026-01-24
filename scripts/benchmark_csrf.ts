
import { csrfTokens, cleanupTokens } from '../lib/csrf';

// Helper to fill map
function fillMap(map: Map<string, { expiresAt: number }>, expiredCount: number, validCount: number) {
    map.clear();
    const now = Date.now();

    // Insert expired tokens first (simulating older tokens)
    for (let i = 0; i < expiredCount; i++) {
        map.set(`expired_${i}`, { expiresAt: now - 1000 });
    }

    // Insert valid tokens next (simulating newer tokens)
    for (let i = 0; i < validCount; i++) {
        map.set(`valid_${i}`, { expiresAt: now + 10000 }); // Valid for 10s
    }
}

function baselineCleanup(map: Map<string, { expiresAt: number }>) {
  const now = Date.now();
  for (const [token, data] of map.entries()) {
    if (now > data.expiresAt) {
      map.delete(token);
    }
  }
}

async function runBenchmark() {
    const EXPIRED_COUNT = 2500;
    const VALID_COUNT = 2500;
    const TOTAL = EXPIRED_COUNT + VALID_COUNT;

    console.log(`Setting up benchmark with ${EXPIRED_COUNT} expired and ${VALID_COUNT} valid tokens (Total: ${TOTAL}).`);

    // 1. Measure Baseline
    const baselineMap = new Map<string, { expiresAt: number }>();
    fillMap(baselineMap, EXPIRED_COUNT, VALID_COUNT);

    // Warmup
    baselineCleanup(new Map(baselineMap));

    const startBaseline = process.hrtime.bigint();
    baselineCleanup(baselineMap);
    const endBaseline = process.hrtime.bigint();
    const baselineDuration = Number(endBaseline - startBaseline) / 1e6; // ms

    console.log(`Baseline (O(N)) Cleanup Duration: ${baselineDuration.toFixed(4)} ms`);
    console.log(`Baseline Remaining Size: ${baselineMap.size} (Expected: ${VALID_COUNT})`);

    if (baselineMap.size !== VALID_COUNT) {
        console.error("Baseline cleanup failed correctness check!");
        process.exit(1);
    }

    // 2. Measure Actual Implementation
    // We use the exported csrfTokens map
    fillMap(csrfTokens, EXPIRED_COUNT, VALID_COUNT);

    const startActual = process.hrtime.bigint();
    cleanupTokens();
    const endActual = process.hrtime.bigint();
    const actualDuration = Number(endActual - startActual) / 1e6; // ms

    console.log(`Actual Implementation Cleanup Duration: ${actualDuration.toFixed(4)} ms`);
    console.log(`Actual Implementation Remaining Size: ${csrfTokens.size} (Expected: ${VALID_COUNT})`);

    if (csrfTokens.size !== VALID_COUNT) {
         console.error("Actual cleanup failed correctness check!");
         process.exit(1);
    }

    console.log("Benchmark complete.");
    process.exit(0);
}

runBenchmark();
