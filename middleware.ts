import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from './lib/supabase/middleware';

export async function middleware(req: NextRequest) {
  // BYPASS AUTH FOR PREVIEW/DEV if using placeholder keys
  const isPlaceholderKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.includes('your-anon-key');
  if (isPlaceholderKey) {
    return NextResponse.next();
  }

  const { response, user } = await updateSession(req);

  // Protect /admin routes
  if (!user && req.nextUrl.pathname.startsWith('/admin') && !req.nextUrl.pathname.startsWith('/admin/login')) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  // Redirect admin users from login to dashboard
  if (user && req.nextUrl.pathname.startsWith('/admin/login')) {
    return NextResponse.redirect(new URL('/admin/dashboard', req.url));
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*']
};
