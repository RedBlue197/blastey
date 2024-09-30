// hooks/useAuthRedirect.ts
"use client"
// hooks/useAuthRedirect.ts
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext'; // Adjust the path accordingly

const useAuthRedirect = (allowedRoles: string[]) => {
  const router = useRouter();
  const { token } = useAuth();

  useEffect(() => {
    const checkToken = () => {
      // Check if the token exists
      if (!token) {
        router.push('/signin'); // Redirect to sign-in page
        return;
      }

      // Decode the token to check expiration and role
      const tokenData = JSON.parse(atob(token.split('.')[1])); // Decode token
      const isExpired = tokenData.exp * 1000 < Date.now(); // Check expiration
      const userRole = tokenData.user_role; // Extract user role

      if (isExpired) {
        router.push('/signin'); // Redirect if token is expired
        return;
      }

      // Check if the user role is allowed
      if (!allowedRoles.includes(userRole)) {
        router.push('/unauthorized'); // Redirect to an unauthorized page or home
      }
    };

    checkToken();
  }, [token, router, allowedRoles]);
};

export default useAuthRedirect;
