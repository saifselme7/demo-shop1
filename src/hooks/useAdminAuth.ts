import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export interface AdminUser {
  id: string
  email: string | undefined
  isAdmin: boolean
}

export function useAdminAuth() {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const checkSession = async () => {
      if (!isSupabaseConfigured()) {
        if (mounted) {
          setError('Supabase not configured — check Vercel env vars VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY')
          setLoading(false)
        }
        return
      }

      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) throw sessionError
        if (!mounted) return

        if (session?.user) {
          // Use maybeSingle to avoid throwing when not found
          const { data: adminData, error: adminError } = await supabase
            .from('admin_users')
            .select('user_id')
            .eq('user_id', session.user.id)
            .maybeSingle()

          if (adminError) {
            console.error('Admin check error:', adminError)
            // If table doesn't exist or RLS blocks, treat as not admin but surface error
            if (mounted) {
              setUser({ id: session.user.id, email: session.user.email, isAdmin: false })
              setIsAdmin(false)
              setError(`Admin check failed: ${adminError.message}`)
              setLoading(false)
            }
            return
          }

          const admin = !!adminData
          if (mounted) {
            setUser({ id: session.user.id, email: session.user.email, isAdmin: admin })
            setIsAdmin(admin)
            setLoading(false)
          }
        } else {
          if (mounted) {
            setUser(null)
            setIsAdmin(false)
            setLoading(false)
          }
        }
      } catch (err: any) {
        console.error('Auth check failed:', err)
        if (mounted) {
          setError(err.message)
          setLoading(false)
        }
      }
    }

    checkSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return
      try {
        if (session?.user) {
          const { data: adminData, error: adminError } = await supabase
            .from('admin_users')
            .select('user_id')
            .eq('user_id', session.user.id)
            .maybeSingle()

          if (adminError) {
            console.error('Admin check on auth change error:', adminError)
            setUser({ id: session.user.id, email: session.user.email, isAdmin: false })
            setIsAdmin(false)
            setError(`Admin check failed: ${adminError.message}`)
          } else {
            const admin = !!adminData
            setUser({ id: session.user.id, email: session.user.email, isAdmin: admin })
            setIsAdmin(admin)
            setError(null)
          }
        } else {
          setUser(null)
          setIsAdmin(false)
          setError(null)
        }
      } catch (err: any) {
        console.error('Auth state change error:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setIsAdmin(false)
  }

  return { user, isAdmin, loading, error, signOut }
}
