'use client';

import { useEffect, Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useAuth();
  const [processedToken, setProcessedToken] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get('token');
    const success = searchParams.get('success');

    if (token && success && token !== processedToken) {
      // OAuth callback - fetch user info and login
      const fetchUser = async (retries = 3) => {
        try {
          const response = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (response.status === 404 && retries > 0) {
            // API route not ready yet, retry after a short delay
            setTimeout(() => fetchUser(retries - 1), 500);
            return;
          }
          
          if (response.ok) {
            const userData = await response.json();
            login(userData, token);
            setProcessedToken(token); // Mark token as processed
            
            // Clean up URL
            router.replace('/');
          } else {
            console.error('Failed to fetch user:', response.status);
          }
        } catch (error) {
          console.error('Failed to fetch user:', error);
          if (retries > 0) {
            setTimeout(() => fetchUser(retries - 1), 500);
          }
        }
      };
      
      fetchUser();
    }
  }, [searchParams, router, processedToken]);

  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Newsletter />
      <Footer />
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
