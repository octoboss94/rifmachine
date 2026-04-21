import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const supabase = createClient();
  const url = new URL(req.url);

  // Sign out from Supabase
  await supabase.auth.signOut();

  // Create response to redirect to home
  const response = NextResponse.redirect(new URL('/', url.origin), {
    status: 302,
  });

  // Clear the admin bypass cookie
  response.cookies.delete('admin_bypass');

  return response;
}
