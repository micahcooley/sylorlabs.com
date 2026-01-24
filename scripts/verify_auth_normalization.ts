
import { createUser, findUserByEmail, _resetUsers } from '../lib/auth';
import { randomUUID } from 'crypto';

async function runTest() {
  console.log('Testing case sensitivity...');
  _resetUsers();

  const email = 'test@example.com';
  const mixedCaseEmail = 'Test@Example.com';

  // Create user with lowercase
  await createUser('testuser', email, 'password123');
  console.log(`Created user with ${email}`);

  // Try to find with mixed case
  const user = await findUserByEmail(mixedCaseEmail);

  if (user) {
    console.log('SUCCESS: User found with mixed case email.');
  } else {
    console.log('FAILURE: User NOT found with mixed case email.');
    process.exit(1);
  }
}

runTest().catch((e) => {
  console.error(e);
  process.exit(1);
});
