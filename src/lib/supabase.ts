import { createClient } from '@supabase/supabase-js'
import { env, hasSupabase } from './env'

export const supabase = hasSupabase
  ? createClient(env.VITE_SUPABASE_URL as string, env.VITE_SUPABASE_ANON_KEY as string, {
      auth: { persistSession: true },
    })
  : null
