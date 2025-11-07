import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { hasSupabase } from '../lib/env'
import { useAuth } from '../lib/auth'

export default function RequireAuth({ children }: { children: ReactNode }) {
  if (!hasSupabase) return <>{children}</>        // no backend configured → let through
  const { user, loading } = useAuth()
  const loc = useLocation()
  if (loading) return <div className="p-6">Loading…</div>
  if (!user) return <Navigate to={`/auth?next=${encodeURIComponent(loc.pathname + loc.search)}`} replace />
  return <>{children}</>
}
