
const ITERATIONS = 10_000_000;
const ARRAY_SIZE = 10;

// Baseline: Recreating the array every time
function testAllocation() {
  let sum = 0;
  const start = process.hrtime.bigint();

  for (let i = 0; i < ITERATIONS; i++) {
    // Simulating the [...Array(10)].map(...) pattern
    // We do a minimal operation inside map to prevent V8 from optimizing it away completely
    [...Array(ARRAY_SIZE)].map((_, index) => {
        sum += index;
        return index;
    });
  }

  const end = process.hrtime.bigint();
  return { time: end - start, sum }; // Return sum to prevent dead code elimination
}

// Optimized: Using a constant array
const CONSTANT_ARRAY = [...Array(ARRAY_SIZE)];

function testConstant() {
  let sum = 0;
  const start = process.hrtime.bigint();

  for (let i = 0; i < ITERATIONS; i++) {
    CONSTANT_ARRAY.map((_, index) => {
        sum += index;
        return index;
    });
  }

  const end = process.hrtime.bigint();
  return { time: end - start, sum };
}

console.log(`Running benchmark with ${ITERATIONS.toLocaleString()} iterations...`);

// Warmup (optional but good practice)
console.log("Warming up...");
testAllocation();
testConstant();

console.log("Running tests...");

// Run Allocation Test
// Force GC if possible (requires --expose-gc, but we'll just run it)
// We run the optimized one first to give the "disadvantage" of cold cache if any,
// though we warmed up. Actually, let's run baseline first.

const baselineResult = testAllocation();
const optimizedResult = testConstant();

const baselineNs = Number(baselineResult.time);
const optimizedNs = Number(optimizedResult.time);

const baselineMs = baselineNs / 1_000_000;
const optimizedMs = optimizedNs / 1_000_000;

console.log("\nResults:");
console.log(`Baseline (New Array Allocation): ${baselineMs.toFixed(2)} ms`);
console.log(`Optimized (Constant Array):      ${optimizedMs.toFixed(2)} ms`);

const improvement = baselineMs / optimizedMs;
const percentFaster = ((baselineMs - optimizedMs) / baselineMs) * 100;

console.log(`\nImprovement: ${improvement.toFixed(2)}x faster`);
console.log(`Reduction in time: ${percentFaster.toFixed(2)}%`);
