import { generateCsrfToken, validateCsrfToken } from '../lib/csrf';
import process from 'process';

const MAX_CSRF_TOKENS = 5000;

console.log('Testing CSRF LRU Logic...');

const tokens: string[] = [];

// Fill the map to the limit
for (let i = 0; i < MAX_CSRF_TOKENS; i++) {
  tokens.push(generateCsrfToken());
}

console.log(`Generated ${tokens.length} tokens.`);

// Generate one more token, which should evict the first one
const newToken = generateCsrfToken();
console.log('Generated 1 more token.');

// The first token should now be invalid (evicted)
// Note: validateCsrfToken returns false if token not found
const firstToken = tokens[0];
const isFirstValid = validateCsrfToken(firstToken);

if (!isFirstValid) {
  console.log('SUCCESS: First token was evicted (invalid).');
} else {
  console.error('FAILURE: First token is still valid!');
  process.exit(1);
}

// The new token should be valid
// Note: validateCsrfToken deletes the token upon successful validation
if (validateCsrfToken(newToken)) {
  console.log('SUCCESS: New token is valid.');
} else {
  console.error('FAILURE: New token is invalid!');
  process.exit(1);
}

// The second token should still be valid (it was not evicted)
const secondToken = tokens[1];
if (validateCsrfToken(secondToken)) {
    console.log('SUCCESS: Second token is valid.');
} else {
    console.error('FAILURE: Second token is invalid!');
    process.exit(1);
}

console.log('All LRU tests passed.');
process.exit(0);
