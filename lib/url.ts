/**
 * Get the base URL for the application
 * Falls back to localhost with configurable port if NEXT_PUBLIC_BASE_URL is not set
 */
export function getBaseUrl(): string {
  // If NEXT_PUBLIC_BASE_URL is explicitly set, use it
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }

  // For server-side, we need to construct the URL from environment or defaults
  const protocol = process.env.NEXT_PUBLIC_PROTOCOL || 'http';
  const host = process.env.NEXT_PUBLIC_HOST || 'localhost';
  const port = process.env.NEXT_PUBLIC_PORT || process.env.PORT || '3000';
  
  // Only include port if it's not the default port for the protocol
  const isDefaultPort = (protocol === 'http' && port === '80') || (protocol === 'https' && port === '443');
  
  return isDefaultPort ? `${protocol}://${host}` : `${protocol}://${host}:${port}`;
}

/**
 * Get the redirect URI for Google OAuth
 * Falls back to base URL with the callback path
 */
export function getGoogleRedirectUri(): string {
  // If GOOGLE_REDIRECT_URI is explicitly set, use it
  if (process.env.GOOGLE_REDIRECT_URI) {
    return process.env.GOOGLE_REDIRECT_URI;
  }
  
  // Otherwise, construct it from the base URL
  return `${getBaseUrl()}/api/auth/google/callback`;
}
