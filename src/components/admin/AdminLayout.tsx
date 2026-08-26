import { ReactNode, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../../hooks/useAdminAuth'

interface Props {
  children: ReactNode
}

const nav = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Products', href: '/admin/products' },
  { label: 'Categories', href: '/admin/categories' },
  { label: 'Collections', href: '/admin/collections' },
]

export default function AdminLayout({ children }: Props) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, signOut } = useAdminAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await signOut()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-paper flex">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex w-[240px] shrink-0 flex-col border-r border-line bg-paper sticky top-0 h-screen">
        <div className="h-[68px] flex items-center px-6 border-b border-line">
          <Link to="/admin" className="font-display text-lg font-bold tracking-ultra-tight">SAIF STORE — Admin</Link>
        </div>
        <nav className="flex-1 flex flex-col gap-1 p-4">
          {nav.map((n) => (
            <Link
              key={n.href}
              to={n.href}
              className={`px-3 py-2.5 text-[12px] uppercase tracking-wide-lg transition-colors ${
                location.pathname === n.href ? 'bg-ink text-paper' : 'text-ink hover:bg-cream'
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-line flex flex-col gap-3">
          <span className="text-[11px] text-muted truncate">{user?.email}</span>
          <button onClick={handleLogout} className="text-left text-[11px] uppercase tracking-wide-lg link-line w-fit">Logout</button>
          <Link to="/" className="text-[11px] uppercase tracking-wide-lg text-muted link-line w-fit">← Storefront</Link>
        </div>
      </aside>

      {/* Mobile */}
      <div className="flex flex-1 flex-col lg:hidden">
        <header className="h-[68px] flex items-center justify-between px-6 border-b border-line bg-paper sticky top-0 z-30">
          <Link to="/admin" className="font-display text-base font-bold tracking-ultra-tight">SAIF STORE — Admin</Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex flex-col gap-[5px] p-2"
            aria-label="Toggle menu"
          >
            <span className="block h-px w-6 bg-ink" />
            <span className="block h-px w-6 bg-ink" />
          </button>
        </header>
        {mobileOpen && (
          <div className="bg-paper border-b border-line p-4 flex flex-col gap-2">
            {nav.map((n) => (
              <Link
                key={n.href}
                to={n.href}
                onClick={() => setMobileOpen(false)}
                className={`px-3 py-3 text-[12px] uppercase tracking-wide-lg ${
                  location.pathname === n.href ? 'bg-ink text-paper' : 'bg-cream text-ink'
                }`}
              >
                {n.label}
              </Link>
            ))}
            <div className="mt-4 pt-4 border-t border-line flex flex-col gap-3">
              <span className="text-[11px] text-muted">{user?.email}</span>
              <button onClick={handleLogout} className="text-left text-[11px] uppercase tracking-wide-lg">Logout</button>
              <Link to="/" className="text-[11px] uppercase tracking-wide-lg text-muted">← Storefront</Link>
            </div>
          </div>
        )}
        <main className="flex-1 p-6">{children}</main>
      </div>

      {/* Desktop main */}
      <main className="hidden lg:flex flex-1 flex-col">
        <div className="flex-1 p-8 lg:p-10">{children}</div>
      </main>
    </div>
  )
}
