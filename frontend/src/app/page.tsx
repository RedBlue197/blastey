// pages/_app.tsx
import { AppProps } from 'next/app';
import { AuthProvider } from '@/context/AuthContext'; // Update the path accordingly
import '../globals.css'; // Include your global styles

function Index({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default Index;
