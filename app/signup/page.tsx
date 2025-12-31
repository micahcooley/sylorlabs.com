'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [processedToken, setProcessedToken] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const redirectUri = searchParams.get('redirect_uri');

  useEffect(() => {
    setMounted(true);
    
    const token = searchParams.get('token');
    const success = searchParams.get('success');
    const oauthError = searchParams.get('error');

    if (token && success && token !== processedToken) {
      // For OAuth signup, we need to fetch user info
      const fetchUser = async () => {
        try {
          const response = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.ok) {
            const userData = await response.json();
            login(userData, token);
            setProcessedToken(token); // Mark token as processed
            
            if (redirectUri) {
              const separator = redirectUri.includes('?') ? '&' : '?';
              window.location.href = `${redirectUri}${separator}token=${token}`;
            } else {
              router.push('/');
            }
          }
        } catch (error) {
          console.error('Failed to fetch user:', error);
        }
      };
      
      fetchUser();
    }

    if (oauthError === 'oauth_failed') {
      setError('Google authentication failed. Please try again.');
    } else if (oauthError === 'oauth_not_configured') {
      setError('Google sign-in is not configured. Please use email/password signup.');
    }
  }, [searchParams, redirectUri, processedToken]);

  useEffect(() => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          email,
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Signup failed');
        setLoading(false);
        return;
      }

      login(data.user, data.token);
      
      if (redirectUri) {
        const separator = redirectUri.includes('?') ? '&' : '?';
        window.location.href = `${redirectUri}${separator}token=${data.token}`;
      } else {
        router.push('/');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const params = new URLSearchParams();
      if (redirectUri) {
        params.set('redirect_uri', redirectUri);
      }
      params.set('state', 'signup'); // Tell callback we came from signup
      const googleAuthUrl = `/api/auth/google?${params.toString()}`;
      window.location.href = googleAuthUrl;
    } catch (err) {
      setError('Google sign-in is not configured. Please use email/password signup.');
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength === 3) return 'bg-yellow-500';
    if (passwordStrength === 4) return 'bg-neon-cyan';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength === 3) return 'Medium';
    if (passwordStrength === 4) return 'Strong';
    return 'Very Strong';
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-noir-bg flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-neon-magenta/5 via-transparent to-neon-cyan/5" />
      
      <div className="absolute top-20 right-20 w-96 h-96 bg-neon-magenta/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 animate-fade-in">
          <a href="/" className="inline-block mb-4 group">
            <h1 className="text-5xl font-bold font-outfit transition-transform group-hover:scale-105">
              <span className="neon-text-cyan">Sylor</span>
              <span className="neon-text-magenta">Labs</span>
            </h1>
          </a>
          <p className="text-gray-400 text-sm">Universal Authentication Portal</p>
        </div>

        <div className="neon-glass rounded-2xl p-8 animate-slide-up">
          <h2 className="text-3xl font-bold text-white mb-2 font-outfit">Create Account</h2>
          <p className="text-gray-400 mt-2">Start creating with professional audio tools</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username (optional)"
                className="w-full bg-black/40 border border-neon-magenta/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-neon-magenta focus:shadow-neon-magenta transition-all duration-300"
              />
              <p className="text-xs text-gray-500 mt-1">Optional: 3-20 characters, letters, numbers, and underscores only</p>
            </div>

            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full bg-black/40 border border-neon-magenta/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-neon-magenta focus:shadow-neon-magenta transition-all duration-300"
                required
              />
            </div>

            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-black/40 border border-neon-magenta/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-neon-magenta focus:shadow-neon-magenta transition-all duration-300"
                required
              />
              {password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-400">Password strength:</span>
                    <span className={`text-xs font-medium ${passwordStrength >= 4 ? 'text-neon-cyan' : 'text-gray-400'}`}>
                      {getStrengthText()}
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    />
                  </div>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-2">
                At least 8 characters with uppercase, lowercase, and numbers
              </p>
            </div>

            <div className="relative">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="w-full bg-black/40 border border-neon-magenta/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-neon-magenta focus:shadow-neon-magenta transition-all duration-300"
                required
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || password !== confirmPassword}
              className="w-full bg-gradient-to-r from-neon-magenta to-neon-cyan text-white font-semibold py-3 rounded-lg hover:shadow-[0_0_15px_rgba(255,0,255,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-noir-panel text-gray-400">or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white/5 border border-white/10 text-white font-medium py-3 rounded-lg hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign up with Google
          </button>

          <p className="text-center text-gray-500 text-sm">
            Already have an account?{' '}
            <Link
              href={`/login${redirectUri ? `?redirect_uri=${encodeURIComponent(redirectUri)}` : ''}`}
              className="text-neon-cyan hover:text-neon-cyan/80 transition-colors font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>

        <p className="text-center text-gray-600 text-xs mt-2">
          © 2024 SylorLabs. All rights reserved.
        </p>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
