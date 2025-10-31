import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function proxy(request: NextRequest) {
  const currentPath = request.nextUrl.pathname;
  const isPublicPath = currentPath === '/login' || 
                      currentPath === '/signup' || 
                      currentPath === '/forgotpassword' || 
                      currentPath === '/resetpassword' || 
                      currentPath === '/verifyemail' ||
                      currentPath === '/';

  const token = request.cookies.get('token')?.value || '';

  // Redirect authenticated users away from public pages (except home)
  if (isPublicPath && token && currentPath !== '/') {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  // Redirect unauthenticated users to login for protected pages
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/signup',
    '/profile/:path*',
    '/forgotpassword',
    '/resetpassword',
    '/verifyemail',
  ],
}
