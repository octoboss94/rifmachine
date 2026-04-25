import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
// This client does not use Next.js cookies, so it won't opt routes into dynamic rendering.
export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
  
  return createSupabaseClient(url, key);
}
