// app/layout.tsx
import { AuthProvider } from '@/context/AuthContext';
import '@/app/styles/globals.css';
import { Inter } from 'next/font/google'
import { PostHogProvider } from '@/providers/PostHogProvider'
 
const inter = Inter({ subsets: ['latin'] })

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <title>Blastey</title>
        {/* Add any global head elements here */}
      </head>
      <body className={inter.className}>
      <PostHogProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}