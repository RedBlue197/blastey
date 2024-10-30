import { NextRequest, NextResponse } from "next/server";
import jwtDecode from 'jwt-decode';

interface DecodedToken {
  exp: number;
  role: string;
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

const accessControlList: { [path: string]: string[] } = {
  '/dashboard': ['admin', 'user'],
  '/profile': ['user', 'admin'],
  // Define roles for additional routes
};

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = Object.keys(accessControlList).includes(path);

  // Get the token from cookies
  const token = req.cookies.get('token');

  if (token) {
    try {
      const decoded: DecodedToken = jwtDecode(token);

      // Check if the token is expired
      if (isTokenExpired(token)) {
        return NextResponse.redirect(new URL('/sign-in', req.nextUrl).toString());
      }

      // Check if the user has access to the route based on their role
      if (isProtectedRoute) {
        const allowedRoles = accessControlList[path];
        if (!allowedRoles.includes(decoded.role)) {
          return NextResponse.redirect(new URL('/unauthorized', req.nextUrl).toString());
        }
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      return NextResponse.redirect(new URL('/sign-in', req.nextUrl).toString());
    }
  } else if (isProtectedRoute) {
    // Redirect to sign-in if the route is protected and no token is present
    return NextResponse.redirect(new URL('/sign-in', req.nextUrl).toString());
  }

  return NextResponse.next();
}
