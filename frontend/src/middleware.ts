import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const protectedRoutes : { [key: string]: string[] } = {
    '/dashboard': ['host', 'admin'],
    '/profile': ['user', 'host', 'admin'],
    '/admin-panel': ['admin']
};

const publicRoutesSet = new Set([
    '/sign-in',
    '/sign-up'
]);

const SECRET_KEY = process.env.JWT_SECRET;

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const isProtectedRoute = path in protectedRoutes;  // Check if the path is in protected routes
    const isPublicRoute = publicRoutesSet.has(path);
    
    const token = req.cookies.get('token');

    if (isProtectedRoute) {
        if (!token) {
            return NextResponse.redirect(new URL('/sign-in', req.nextUrl).toString());
        }

        try {
            // Verify JWT using 'jose' library
            const { payload: decodedToken } = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
            const userRole = decodedToken.user_role;

            // Check if the token is expired
            if (decodedToken.exp * 1000 < Date.now()) {
                return NextResponse.redirect(new URL('/sign-in', req.nextUrl).toString());
            }

            // Get allowed roles for the current protected route
            const allowedRoles = protectedRoutes[path];

            if (!allowedRoles.includes(userRole)) {
                return NextResponse.redirect(new URL('/not-authorized', req.nextUrl).toString());
            }
        } catch (error) {
            console.error('Token verification failed:', error);
            return NextResponse.redirect(new URL('/sign-in', req.nextUrl).toString());
        }
    }

    if (isPublicRoute && token) {
        if (path === '/sign-in' || path === '/sign-up') {
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL('/dashboard', req.nextUrl).toString());
    }

    return NextResponse.next();
}
