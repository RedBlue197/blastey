import { NextRequest, NextResponse } from "next/server";

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

    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL('/sign-in', req.nextUrl).toString());
    }

    if (isPublicRoute && token) {
        return NextResponse.redirect(new URL('/dashboard', req.nextUrl).toString());
    }

    return NextResponse.next();
}