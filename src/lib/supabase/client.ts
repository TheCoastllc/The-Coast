import { createClient } from '@supabase/supabase-js'

// Fallbacks prevent module-level crash during SSR/build when env vars are absent.
// Actual data fetching only occurs on the client via useQuery.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key',
)
