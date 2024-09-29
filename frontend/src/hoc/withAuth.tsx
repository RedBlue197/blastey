"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {jwtDecode} from 'jwt-decode';

interface DecodedToken {
  exp: number;
  [key: string]: any;
}

const isTokenExpired = (token: string): boolean => {
  try {
    const decoded: DecodedToken = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
};

const withAuth = (WrappedComponent: React.ComponentType<any>) => {
  const AuthenticatedComponent = (props: any) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // Use null for loading state

    useEffect(() => {
      const token = localStorage.getItem('token');

      if (token && !isTokenExpired(token)) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        router.push('/sign-in');
      }
    }, [router]);

    if (isAuthenticated === null) {
      // Optionally, show a loading indicator while determining authentication status
      return <p>Loading...</p>; // Consider replacing this with a spinner
    }

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;
