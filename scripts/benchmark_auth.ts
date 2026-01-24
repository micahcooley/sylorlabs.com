
import { _insertUserForTest, findUserByEmail, findUserByUsername, _resetUsers, User } from '../lib/auth';
import { randomUUID } from 'crypto';

async function runBenchmark() {
  console.log('Starting benchmark...');
  _resetUsers();

  const USER_COUNT = 100000;
  const LOOKUP_COUNT = 10000;

  console.log(`Seeding ${USER_COUNT} users...`);
  const users: User[] = [];

  const startSeed = performance.now();
  for (let i = 0; i < USER_COUNT; i++) {
    const user: User = {
      id: randomUUID(),
      email: `user${i}@example.com`,
      username: `user${i}`,
      createdAt: new Date(),
      password: 'hashed_password_placeholder'
    };
    _insertUserForTest(user);
    users.push(user);
  }
  const endSeed = performance.now();
  console.log(`Seeding took ${(endSeed - startSeed).toFixed(2)}ms`);

  // Benchmark Email Lookup
  console.log(`Performing ${LOOKUP_COUNT} email lookups...`);
  const startEmail = performance.now();
  for (let i = 0; i < LOOKUP_COUNT; i++) {
    const targetIndex = Math.floor(Math.random() * USER_COUNT);
    const targetEmail = `user${targetIndex}@example.com`;
    await findUserByEmail(targetEmail);
  }
  const endEmail = performance.now();
  const durationEmail = endEmail - startEmail;
  console.log(`Email Lookups: ${durationEmail.toFixed(2)}ms total, ${(durationEmail / LOOKUP_COUNT).toFixed(4)}ms per lookup`);

  // Benchmark Username Lookup
  console.log(`Performing ${LOOKUP_COUNT} username lookups...`);
  const startUsername = performance.now();
  for (let i = 0; i < LOOKUP_COUNT; i++) {
    const targetIndex = Math.floor(Math.random() * USER_COUNT);
    const targetUsername = `user${targetIndex}`;
    await findUserByUsername(targetUsername);
  }
  const endUsername = performance.now();
  const durationUsername = endUsername - startUsername;
  console.log(`Username Lookups: ${durationUsername.toFixed(2)}ms total, ${(durationUsername / LOOKUP_COUNT).toFixed(4)}ms per lookup`);

  // Non-existent lookup
  console.log(`Performing ${LOOKUP_COUNT} non-existent lookups...`);
  const startMiss = performance.now();
  for (let i = 0; i < LOOKUP_COUNT; i++) {
    await findUserByEmail('nonexistent@example.com');
  }
  const endMiss = performance.now();
  const durationMiss = endMiss - startMiss;
  console.log(`Miss Lookups: ${durationMiss.toFixed(2)}ms total, ${(durationMiss / LOOKUP_COUNT).toFixed(4)}ms per lookup`);

}

runBenchmark().catch(console.error);
