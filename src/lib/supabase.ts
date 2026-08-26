import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string) ||
  (import.meta.env.VITE_SUPABASE_URL as string) // keep explicit for clarity

const supabaseKey =
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string) ||
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ||
  ''

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    'Supabase env vars missing: Ensure VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY (or VITE_SUPABASE_ANON_KEY) are set in Vercel and locally. ' +
      'Vite only exposes variables prefixed with VITE_.',
  )
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
})

export type SupabaseClient = typeof supabase

// Helper to check if client is configured
export function isSupabaseConfigured() {
  return !!supabaseUrl && !!supabaseKey
}
