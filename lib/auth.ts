import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { getGoogleRedirectUri } from './security';


export interface GoogleProfile {
  id: string;
  email: string;
  name?: string;
  picture?: string;
}

export interface User {
  id: string;
  username?: string;
  email: string;
  password?: string;
  googleId?: string;
  profilePicture?: string;
  createdAt: Date;
  emailVerified?: boolean;
  emailVerifiedAt?: Date;
}

// Internal Maps for O(1) lookups
const usersById = new Map<string, User>();
const usersByEmail = new Map<string, User>();
const usersByUsername = new Map<string, User>();
const usersByGoogleId = new Map<string, User>();

/**
 * Adds a user to internal maps.
 * @internal
 */
function addUserToMaps(user: User) {
  usersById.set(user.id, user);
  usersByEmail.set(user.email.toLowerCase(), user);
  if (user.username) {
    usersByUsername.set(user.username.toLowerCase(), user);
  }
  if (user.googleId) {
    usersByGoogleId.set(user.googleId, user);
  }
}

/**
 * Resets the internal user store.
 * Useful for testing.
 * @internal
 */
export function _resetUsers() {
  usersById.clear();
  usersByEmail.clear();
  usersByUsername.clear();
  usersByGoogleId.clear();
}

/**
 * Inserts a user directly into the maps.
 * Useful for benchmarking and testing to bypass hashing.
 * @internal
 */
export function _insertUserForTest(user: User) {
  addUserToMaps(user);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(userId: string, email: string): string {
  const JWT_SECRET = process.env.JWT_SECRET;
  
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set. Please configure it before starting the server.');
  }
  
  return jwt.sign(
    { userId, email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): { userId: string; email: string } | null {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not set. Please configure it before starting the server.');
    }
    
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
  } catch {
    return null;
  }
}

export async function createUser(username: string | undefined, email: string, password: string): Promise<User> {
  const normalizedEmail = email.toLowerCase();
  const normalizedUsername = username?.toLowerCase();

  if (usersByEmail.has(normalizedEmail)) {
    throw new Error('Email is already registered');
  }
  
  // Only check username if one is provided
  if (normalizedUsername) {
    if (usersByUsername.has(normalizedUsername)) {
      throw new Error('Username is already taken');
    }
  }

  const hashedPassword = await hashPassword(password);
  const user: User = {
    id: randomUUID(),
    username: normalizedUsername,
    email: normalizedEmail,
    password: hashedPassword,
    createdAt: new Date(),
  };

  addUserToMaps(user);
  return user;
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
  return usersByEmail.get(email.toLowerCase());
}

export async function findUserByUsername(username: string): Promise<User | undefined> {
  return usersByUsername.get(username.toLowerCase());
}

export async function authenticateUser(emailOrUsername: string, password: string): Promise<User | null> {
  const normalizedInput = emailOrUsername.toLowerCase();
  let user = usersByEmail.get(normalizedInput);

  if (!user) {
    user = usersByUsername.get(normalizedInput);
  }

  if (!user || !user.password) {
    return null;
  }

  const isValid = await verifyPassword(password, user.password);
  return isValid ? user : null;
}

export function getGoogleAuthUrl(redirectUri?: string, customState?: string): string {
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
  
  if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === '') {
    throw new Error('Google OAuth is not configured. Please set GOOGLE_CLIENT_ID in your environment variables.');
  }

  // Combine customState and redirectUri into the state parameter
  // Format: "state:redirectUri"
  let stateValue = customState || 'default';
  if (redirectUri) {
    stateValue = `${stateValue}:${redirectUri}`;
  }

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: getGoogleRedirectUri(),
    response_type: 'code',
    scope: 'openid email profile',
    state: stateValue,
    prompt: 'consent',
    access_type: 'offline',
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function exchangeGoogleCode(code: string): Promise<GoogleProfile> {
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
  
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: getGoogleRedirectUri(),
      grant_type: 'authorization_code',
    }),
  });

  const tokens = await tokenResponse.json();

  const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });

  return userInfoResponse.json();
}

export async function findOrCreateGoogleUser(googleProfile: GoogleProfile): Promise<User> {
  let user: User | undefined;

  if (googleProfile.id) {
    user = usersByGoogleId.get(googleProfile.id);
  }

  if (!user) {
    // Check if there's an existing account with the same email
    const normalizedEmail = googleProfile.email.toLowerCase();
    user = usersByEmail.get(normalizedEmail);

    if (user) {
      // Link the Google account to the existing account
      user.googleId = googleProfile.id;
      // Update profile picture if it exists and user doesn't have one
      if (googleProfile.picture && !user.profilePicture) {
        user.profilePicture = googleProfile.picture;
      }
      // Update googleId index
      if (user.googleId) {
        usersByGoogleId.set(user.googleId, user);
      }
      console.log(`Linked Google account to existing user: ${user.email}`);
    } else {
      // Create a new user with Google info (username is optional)
      user = {
        id: randomUUID(),
        username: undefined, // Google users don't need usernames
        email: normalizedEmail,
        googleId: googleProfile.id,
        profilePicture: googleProfile.picture,
        createdAt: new Date(),
      };
      addUserToMaps(user);
      console.log(`Created new user via Google OAuth: ${user.email}`);
    }
  } else {
    // Update existing Google user's profile picture if it changed
    if (googleProfile.picture && user.profilePicture !== googleProfile.picture) {
      user.profilePicture = googleProfile.picture;
    }
  }

  return user;
}
