/**
 * Proxy
 * Handles authentication and protected routes
 */

import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(req: NextRequest) {
  const res = NextResponse.next();

  // Create Supabase client for proxy
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          req.cookies.set({ name, value, ...options });
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          req.cookies.delete({ name, ...options });
          res.cookies.delete({ name, ...options });
        },
      },
    }
  );

  // Get current session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;

  // Protected routes: /dashboard
  if (pathname.startsWith('/dashboard')) {
    if (!session) {
      // Redirect to login if no session
      const redirectUrl = new URL('/login', req.url);
      redirectUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Redirect authenticated users from login to dashboard
  if ((pathname === '/login' || pathname === '/signup') && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return res;
}

export const matcher = [
  /*
   * Match all request paths except:
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   * - public folder (public files)
   */
  '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
];
