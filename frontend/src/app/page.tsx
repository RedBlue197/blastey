// pages/_app.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AppProps } from 'next/app';
import { AuthProvider } from '@/context/AuthContext';
import '@/app/styles/globals.css'; // Include your global styles
import LoadingScreen from '@/app/components/loading/LoadingScreen'; // Adjust the path as needed

function Index({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
    <AuthProvider>
      {loading && <LoadingScreen />}
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default Index;
