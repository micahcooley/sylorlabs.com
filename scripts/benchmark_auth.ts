
process.env.AUTH_BENCHMARK = 'true';
import { createUser, findUserByEmail, getUsers } from '../lib/auth';

async function main() {
  const USER_COUNT = 50000;
  console.log(`Generating ${USER_COUNT} users...`);

  const startPopulate = performance.now();
  for (let i = 0; i < USER_COUNT; i++) {
    // Generate unique email
    await createUser(undefined, `user${i}@example.com`, 'password');

    if (i % 10000 === 0 && i > 0) {
      process.stdout.write('.');
    }
  }
  process.stdout.write('\n');
  const endPopulate = performance.now();
  console.log(`Population took ${(endPopulate - startPopulate).toFixed(2)}ms`);
  console.log(`Users count: ${getUsers().length}`);

  // Measure Lookup (Worst case: the last user added)
  const targetEmail = `user${USER_COUNT - 1}@example.com`;
  console.log(`Benchmarking lookup for: ${targetEmail}`);

  const startLookup = performance.now();
  const iterations = 5000;
  for (let i = 0; i < iterations; i++) {
    const user = await findUserByEmail(targetEmail);
    if (!user) throw new Error('User not found!');
  }
  const endLookup = performance.now();

  const totalTime = endLookup - startLookup;
  const avgTime = totalTime / iterations;

  console.log(`Total time for ${iterations} lookups: ${totalTime.toFixed(2)}ms`);
  console.log(`Average lookup time: ${avgTime.toFixed(4)}ms`);
}

main().catch(console.error);
