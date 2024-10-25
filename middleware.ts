import { NextRequest, NextResponse } from "next/server";
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
const protectedRoutes = [
    '/dashboard', 
    '/profile',
];

const publicRoutes = [
    '/sign-in',
    '/sign-up'
];

export default async function middleware(req:NextRequest) {
    const path=req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.includes(path);
    const isPublicRoute = publicRoutes.includes(path);

  // Add your authentication logic here
    const token = req.cookies.get('token');

    if (isProtectedRoute && isTokenExpired(token)) {
        return NextResponse.redirect(new URL('/sign-in', req.nextUrl).toString());
    }

    if (isPublicRoute && !isTokenExpired(token)) {
        return NextResponse.redirect(new URL('/dashboard', req.nextUrl).toString());
    }

    return NextResponse.next();
}