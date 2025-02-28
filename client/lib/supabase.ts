import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase credentials. Please check your .env.local file.');
}

// Create a mock Supabase client if we're using placeholder values
const isDevelopmentWithPlaceholders = 
  supabaseUrl.includes('your-project') || 
  supabaseAnonKey.includes('placeholder');

// For development with placeholder values, provide a mock client
export const supabase = isDevelopmentWithPlaceholders
  ? {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        signInAnonymously: async () => ({ 
          data: { user: { id: 'anonymous-user-' + Math.random().toString(36).substring(2, 10) } }, 
          error: null 
        }),
      }
    }
  : createClient(supabaseUrl, supabaseAnonKey); 