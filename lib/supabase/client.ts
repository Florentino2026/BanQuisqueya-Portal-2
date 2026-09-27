import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.next_public_supabase_url!,
    process.env.next_public_supabase_publishable_key!
  )
}
