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
}

export const users: User[] = [
  // Test user for development
  {
    id: 'test-user-1',
    username: 'testuser',
    email: 'test@example.com',
    password: '$2b$10$TUOe64NaQs2WJ5G4pICZvu1rm6URprq7KUIY1m0AzXFTNf0SSAJ5u', // "Test123456" hashed
    createdAt: new Date(),
  }
];

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(userId: string, email: string): string {
  const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
  
  return jwt.sign(
    { userId, email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): { userId: string; email: string } | null {
  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
  } catch {
    return null;
  }
}

export async function createUser(username: string | undefined, email: string, password: string): Promise<User> {
  const existingUserByEmail = users.find(u => u.email === email);
  
  if (existingUserByEmail) {
    throw new Error('Email is already registered');
  }
  
  // Only check username if one is provided
  if (username) {
    const existingUserByUsername = users.find(u => u.username === username);
    if (existingUserByUsername) {
      throw new Error('Username is already taken');
    }
  }

  const hashedPassword = await hashPassword(password);
  const user: User = {
    id: randomUUID(),
    username,
    email,
    password: hashedPassword,
    createdAt: new Date(),
  };

  users.push(user);
  return user;
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
  return users.find(u => u.email === email);
}

export async function findUserByUsername(username: string): Promise<User | undefined> {
  return users.find(u => u.username === username);
}

export async function authenticateUser(emailOrUsername: string, password: string): Promise<User | null> {
  const user = users.find(u => u.email === emailOrUsername || u.username === emailOrUsername);

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
  let user = users.find(u => u.googleId === googleProfile.id);

  if (!user) {
    // Check if there's an existing account with the same email
    user = users.find(u => u.email === googleProfile.email);

    if (user) {
      // Link the Google account to the existing account
      user.googleId = googleProfile.id;
      // Update profile picture if it exists and user doesn't have one
      if (googleProfile.picture && !user.profilePicture) {
        user.profilePicture = googleProfile.picture;
      }
      console.log(`Linked Google account to existing user: ${user.email}`);
    } else {
      // Create a new user with Google info (username is optional)
      user = {
        id: randomUUID(),
        username: undefined, // Google users don't need usernames
        email: googleProfile.email,
        googleId: googleProfile.id,
        profilePicture: googleProfile.picture,
        createdAt: new Date(),
      };
      users.push(user);
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
