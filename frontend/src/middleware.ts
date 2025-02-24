// app/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Define protected routes and the roles allowed for each
const protectedRoutes: { [key: string]: string[] } = {
  '/profile': ['user', 'host', 'admin'],
};

// Define routes that are accessible to everyone (public)
const publicRoutesSet = new Set(['/sign-in', '/sign-up']);

// Get the JWT secret key from environment variables (ensure it's set!)
const SECRET_KEY = process.env.JWT_SECRET;

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = path in protectedRoutes;
  const isPublicRoute = publicRoutesSet.has(path);

  // Get the JWT token from the 'token' cookie
  const token = req.cookies.get('token')?.value;  // Access cookie value directly

  // --- REDIRECT / to /home ---
  if (path === '/') {
    return NextResponse.redirect(new URL('/home', req.nextUrl));
  }

  // --- PROTECTED ROUTES HANDLING ---
  if (isProtectedRoute) {
    // If no token is present, redirect to the sign-in page
    if (!token) {
      return NextResponse.redirect(new URL('/sign-in', req.nextUrl));
    }

    try {
      // Verify the JWT using 'jose' library
      const { payload: decodedToken } = await jwtVerify(
        token,
        new TextEncoder().encode(SECRET_KEY)
      );

      // Extract the user role from the decoded token
      const userRole = decodedToken.user_role as string; // Type assertion

      // Check if the token is expired
      if (decodedToken.exp! * 1000 < Date.now()) {  // Non-null assertion
        return NextResponse.redirect(new URL('/sign-in', req.nextUrl));
      }

      // Get the allowed roles for the current protected route
      const allowedRoles = protectedRoutes[path];

      // Check if the user's role is authorized to access the route
      if (!allowedRoles.includes(userRole)) {
        return NextResponse.redirect(new URL('/not-authorized', req.nextUrl));
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      // Redirect to the sign-in page if token verification fails
      return NextResponse.redirect(new URL('/sign-in', req.nextUrl));
    }
  }

  // --- PUBLIC ROUTES HANDLING ---
  if (isPublicRoute && token) {
    // If a token is present on a public route, redirect to the dashboard
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
  }

  // --- ALLOW ALL OTHER ROUTES ---
  return NextResponse.next();  // Allow access to all other routes
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};