import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export interface AdminUser {
  id: string
  email: string | undefined
  isAdmin: boolean
}

export function useAdminAuth() {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    let mounted = true

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!mounted) return

      if (session?.user) {
        // Check if user is in admin_users
        const { data: adminData } = await supabase
          .from('admin_users')
          .select('user_id')
          .eq('user_id', session.user.id)
          .single()

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
    }

    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return
      if (session?.user) {
        const { data: adminData } = await supabase
          .from('admin_users')
          .select('user_id')
          .eq('user_id', session.user.id)
          .single()

        const admin = !!adminData
        setUser({ id: session.user.id, email: session.user.email, isAdmin: admin })
        setIsAdmin(admin)
      } else {
        setUser(null)
        setIsAdmin(false)
      }
      setLoading(false)
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

  return { user, isAdmin, loading, signOut }
}
