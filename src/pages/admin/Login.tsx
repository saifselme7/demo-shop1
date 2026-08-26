import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { useAdminAuth } from '../../hooks/useAdminAuth'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { user, isAdmin, loading: authLoading } = useAdminAuth()

  useEffect(() => {
    if (!authLoading && user && isAdmin) {
      navigate('/admin')
    }
  }, [user, isAdmin, authLoading, navigate])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!isSupabaseConfigured()) {
      setError('Supabase not configured — check Vercel env vars VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY')
      setLoading(false)
      return
    }

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      // Check admin using maybeSingle
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', data.user.id)
        .maybeSingle()

      if (adminError) {
        console.error('Admin check error:', adminError)
        setError(`Admin check failed: ${adminError.message}. Ensure migration 003 ran and admin_users table exists.`)
        await supabase.auth.signOut()
        setLoading(false)
        return
      }

      if (!adminData) {
        setError(`Access denied — not an admin. Your ID: ${data.user.id}. Add it to admin_users: insert into admin_users (user_id, email) values ('${data.user.id}', '${data.user.email}');`)
        await supabase.auth.signOut()
        setLoading(false)
        return
      }

      navigate('/admin')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-6">
      <div className="w-full max-w-[400px] border border-line bg-paper p-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl tracking-ultra-tight">SAIF STORE</h1>
          <p className="mt-2 text-[11px] uppercase tracking-wide-lg text-muted">Admin — Sign In</p>
        </div>

        {!isSupabaseConfigured() && (
          <div className="mb-6 border border-ochre/30 bg-ochre/10 px-4 py-3 text-[11px] leading-relaxed text-ochre">
            Supabase not configured. Check Vercel env vars VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY (must be prefixed with VITE_).
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="eyebrow">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-line bg-cream px-4 py-3 text-[14px] focus:outline-none focus:border-ink transition-colors"
              placeholder="admin@saifstore.com"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="eyebrow">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-line bg-cream px-4 py-3 text-[14px] focus:outline-none focus:border-ink transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="border border-ochre/30 bg-ochre/10 px-4 py-3 text-[12px] leading-relaxed text-ochre whitespace-pre-wrap break-words">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group relative overflow-hidden border border-ink py-4 text-[11px] uppercase tracking-wide-lg disabled:opacity-50"
          >
            <span className="absolute inset-0 translate-y-full bg-ink transition-transform duration-500 group-hover:translate-y-0 group-disabled:translate-y-full" />
            <span className="relative z-10 group-hover:text-paper transition-colors">{loading ? 'Signing in...' : 'Sign In'}</span>
          </button>

          <div className="text-[11px] text-muted leading-relaxed border-t border-line pt-4">
            <p>First admin must be added manually via Supabase Dashboard:</p>
            <code className="mt-2 block bg-cream border border-line p-2 text-[10px] break-all">
              insert into admin_users (user_id, email) values ('&lt;your-auth-uuid&gt;', 'admin@saifstore.com');
            </code>
          </div>
        </form>
      </div>
    </div>
  )
}
