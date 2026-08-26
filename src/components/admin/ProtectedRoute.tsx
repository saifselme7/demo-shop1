import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAdminAuth } from '../../hooks/useAdminAuth'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isAdmin, loading, error } = useAdminAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="eyebrow">Loading</span>
          <div className="h-6 w-6 border border-line border-t-ink animate-spin rounded-full" />
        </div>
      </div>
    )
  }

  if (error && !user) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center px-6">
        <div className="max-w-[480px] border border-ochre/30 bg-ochre/10 p-8">
          <span className="eyebrow mb-3 block text-ochre">— Configuration Error</span>
          <p className="font-display text-xl tracking-ultra-tight">Supabase not configured</p>
          <p className="mt-3 text-[12px] leading-relaxed text-ochre">{error}</p>
          <p className="mt-4 text-[11px] text-muted">Check Vercel env vars: VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY must be set and prefixed with VITE_.</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center px-6 text-center">
        <div className="max-w-[480px] border border-line p-8 flex flex-col gap-4">
          <span className="eyebrow block">— Access Denied</span>
          <h1 className="font-display text-2xl tracking-ultra-tight">Not an admin.</h1>
          <p className="text-[13px] text-muted">Your user is authenticated but not in admin_users. Contact owner to add your user ID to admin_users table.</p>
          <div className="text-[11px] text-muted border border-line bg-cream p-3 text-left break-all">
            <div>User ID: {user.id}</div>
            <div>Email: {user.email}</div>
            {error && <div className="mt-2 text-ochre">Error: {error}</div>}
          </div>
          <p className="text-[11px] text-muted">Run in Supabase SQL: insert into admin_users (user_id, email) values ('{user.id}', '{user.email}');</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
