import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

const protectedRoutes: { [key: string]: string[] } = {
    '/dashboard': ['host', 'admin'],  // accessible by both user and admin
    '/profile': ['user','host', 'admin'],
    '/admin-panel': ['admin']         // accessible only by admin
};

const publicRoutes = [
    '/sign-in',
    '/sign-up'
];

const SECRET_KEY = process.env.JWT_SECRET; // Store your JWT secret in .env

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const isProtectedRoute = Object.keys(protectedRoutes).includes(path);
    const isPublicRoute = publicRoutes.includes(path);

    // Retrieve token from cookies
    const token = req.cookies.get('token');
    
    if (isProtectedRoute) {
        if (!token) {
            return NextResponse.redirect(new URL('/sign-in', req.nextUrl).toString());
        }

        try {
            // Decode and verify the token to get the user role
            const decodedToken = jwt.verify(token, SECRET_KEY) as { role: string };
            const userRole = decodedToken.user_role;

            // Check if user role is authorized for this route
            const allowedRoles = protectedRoutes[path];
            if (!allowedRoles.includes(userRole)) {
                // Redirect to a "not authorized" page or dashboard if role is insufficient
                return NextResponse.redirect(new URL('/dashboard', req.nextUrl).toString());
            }
        } catch (error) {
            console.error('Token verification failed:', error);
            // Redirect to sign-in if token is invalid
            return NextResponse.redirect(new URL('/sign-in', req.nextUrl).toString());
        }
    }

    if (isPublicRoute && token) {
        return NextResponse.redirect(new URL('/dashboard', req.nextUrl).toString());
    }

    return NextResponse.next();
}
