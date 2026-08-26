import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAdminAuth } from '../../hooks/useAdminAuth'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isAdmin, loading } = useAdminAuth()

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

  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center px-6 text-center">
        <div className="max-w-[400px] border border-line p-8">
          <span className="eyebrow mb-4 block">— Access Denied</span>
          <h1 className="font-display text-2xl tracking-ultra-tight">Not an admin.</h1>
          <p className="mt-3 text-[13px] text-muted">Your user is authenticated but not in admin_users. Contact owner.</p>
          <p className="mt-2 text-[11px] text-muted">{user.email}</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
