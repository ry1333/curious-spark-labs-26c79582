import { z } from 'zod'

const Env = z.object({
  VITE_SUPABASE_URL: z.string().url().optional(),
  VITE_SUPABASE_ANON_KEY: z.string().optional(),
  VITE_POST_MAX_SECONDS: z.string().optional(),
})

const parsed = Env.safeParse(import.meta.env)

// In dev: warn; In prod: never crash the app because of missing envs
if (!parsed.success && import.meta.env.DEV) {
  console.warn('Env validation warnings:', parsed.error.flatten().fieldErrors)
}

// Merge whatever validated with the raw env so Vite’s typings still work
export const env = { ...(import.meta.env as any), ...(parsed.success ? parsed.data : {}) }

export const MAX_SECONDS = Number(env.VITE_POST_MAX_SECONDS || 40)
export const hasSupabase = Boolean(env.VITE_SUPABASE_URL && env.VITE_SUPABASE_ANON_KEY)
