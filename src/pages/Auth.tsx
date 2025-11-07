import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { hasSupabase } from '../lib/env'

export default function AuthPage() {
  const [mode, setMode] = useState<'signIn'|'signUp'>('signIn')
  const [email, setEmail] = useState('test@example.com')
  const [password, setPassword] = useState('pass1234')
  const [error, setError] = useState<string | null>(null)
  const [search] = useSearchParams()
  const nav = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!hasSupabase || !supabase) { setError('Supabase not configured.'); return }
    const fn = mode === 'signIn' ? supabase.auth.signInWithPassword : supabase.auth.signUp
    const { error } = await fn({ email, password })
    if (error) setError(error.message)
    else nav(search.get('next') || '/profile', { replace: true })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-neutral-50">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl border bg-white p-6 space-y-4">
        <h1 className="text-xl font-bold">{mode === 'signIn' ? 'Sign in' : 'Create account'}</h1>
        {!hasSupabase && (
          <div className="rounded-xl bg-yellow-50 text-yellow-900 p-3 text-sm">
            Backend not configured—set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
          </div>
        )}
        <input className="w-full border rounded-xl px-3 py-2" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email" required />
        <input className="w-full border rounded-xl px-3 py-2" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" required />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button className="w-full rounded-xl bg-black text-white py-2">{mode==='signIn'?'Sign in':'Sign up'}</button>
        <button type="button" className="w-full text-sm opacity-70" onClick={()=>setMode(mode==='signIn'?'signUp':'signIn')}>
          {mode==='signIn'?'Need an account? Sign up':'Have an account? Sign in'}
        </button>
      </form>
    </div>
  )
}
