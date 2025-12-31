/**
 * Security utilities for validating URLs and preventing vulnerabilities
 */

// Allowed domains for redirects (add your production domains here)
const ALLOWED_REDIRECT_DOMAINS = [
  'localhost:3000',
  'sylorlabs.com',
  'www.sylorlabs.com',
  // Add any other trusted domains here
];

// Trusted domains for profile picture proxy
const TRUSTED_IMAGE_DOMAINS = [
  'lh3.googleusercontent.com',
  'graph.facebook.com',
  'avatars.githubusercontent.com',
  'secure.gravatar.com',
];

/**
 * Validates if a redirect URL is safe
 * @param url The redirect URL to validate
 * @returns true if the URL is safe, false otherwise
 */
export function isValidRedirectUrl(url: string): boolean {
  try {
    if (!url || typeof url !== 'string') {
      return false;
    }

    const parsedUrl = new URL(url);
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return false;
    }

    // Check if the domain is in our allowlist
    const hostname = parsedUrl.hostname;
    const port = parsedUrl.port;
    const hostWithPort = port ? `${hostname}:${port}` : hostname;

    return ALLOWED_REDIRECT_DOMAINS.some(allowedDomain => {
      if (allowedDomain.includes(':')) {
        return hostWithPort === allowedDomain;
      }
      return hostname === allowedDomain;
    });
  } catch (error) {
    // Invalid URL format
    return false;
  }
}

/**
 * Validates if an image URL is from a trusted domain
 * @param url The image URL to validate
 * @returns true if the URL is from a trusted domain, false otherwise
 */
export function isTrustedImageUrl(url: string): boolean {
  try {
    if (!url || typeof url !== 'string') {
      return false;
    }

    const parsedUrl = new URL(url);
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return false;
    }

    return TRUSTED_IMAGE_DOMAINS.includes(parsedUrl.hostname);
  } catch (error) {
    // Invalid URL format
    return false;
  }
}

/**
 * Gets the current base URL for CORS headers
 * @returns The base URL or fallback
 */
export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
}
