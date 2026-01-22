import { generateCsrfToken } from '../../lib/csrf';
import process from 'process';

const ITERATIONS = 50000;
const SAMPLE_RATE = 5000;

function formatBytes(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

console.log('Starting CSRF Benchmark...');
console.log(`Target: ${ITERATIONS} tokens`);

// Force GC if available to get cleaner baseline (requires --expose-gc)
if (global.gc) {
    global.gc();
}

const initialMemory = process.memoryUsage().heapUsed;
console.log(`Initial Memory: ${formatBytes(initialMemory)}`);

const startTime = Date.now();

for (let i = 1; i <= ITERATIONS; i++) {
  generateCsrfToken();

  if (i % SAMPLE_RATE === 0) {
    const currentMemory = process.memoryUsage().heapUsed;
    console.log(`Generated ${i} tokens. Heap Used: ${formatBytes(currentMemory)} (Diff: ${formatBytes(currentMemory - initialMemory)})`);
  }
}

const endTime = Date.now();
const finalMemory = process.memoryUsage().heapUsed;

console.log('--- Benchmark Complete ---');
console.log(`Total Time: ${endTime - startTime}ms`);
console.log(`Final Memory: ${formatBytes(finalMemory)}`);
console.log(`Memory Growth: ${formatBytes(finalMemory - initialMemory)}`);

process.exit(0);
