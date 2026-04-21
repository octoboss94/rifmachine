import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from './lib/supabase/middleware';

export async function middleware(req: NextRequest) {
  // BYPASS AUTH FOR PREVIEW/DEV if using placeholder keys or bypass cookie
  const isPlaceholderKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.includes('your-anon-key');
  const hasBypassCookie = req.cookies.get('admin_bypass')?.value === 'true';
  
  if (isPlaceholderKey || hasBypassCookie) {
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
