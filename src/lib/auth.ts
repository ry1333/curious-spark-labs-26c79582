import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'

export function useAuth() {
  const [user, setUser] = useState<import('@supabase/supabase-js').User | null>(null)
  const [loading, setLoading] = useState<boolean>(!!supabase)

  useEffect(() => {
    if (!supabase) { setLoading(false); return }
    supabase.auth.getUser()
      .then(({ data }) => { setUser(data.user ?? null); setLoading(false) })
      .catch((error) => {
        console.error('Error getting user:', error)
        setUser(null)
        setLoading(false)
      })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null))
    return () => sub?.subscription?.unsubscribe?.()
  }, [])

  return { user, loading }
}
