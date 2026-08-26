import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { site } from '../../data/site'
import { useUI } from '../../store/ui'

export default function MobileMenu() {
  const open = useUI((s) => s.mobileMenuOpen)
  const setOpen = useUI((s) => s.setMobileMenu)
  const setSearchOpen = useUI((s) => s.setSearchOpen)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      const lenis = (window as any).lenis
      if (lenis) lenis.stop()
    } else {
      document.body.style.overflow = ''
      const lenis = (window as any).lenis
      if (lenis) lenis.start()
    }
    return () => {
      document.body.style.overflow = ''
      const lenis = (window as any).lenis
      if (lenis) lenis.start()
    }
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, setOpen])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] bg-paper flex flex-col"
          initial={{ y: '-100%' }}
          animate={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex h-[68px] items-center justify-between px-6 border-b border-line shrink-0">
            <span className="font-display text-xl font-bold tracking-ultra-tight">SAIF STORE</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setOpen(false)
                  setTimeout(() => setSearchOpen(true), 300)
                }}
                className="text-[11px] uppercase tracking-wide-lg px-3 py-2 min-h-[44px] min-w-[44px] flex items-center justify-center border border-line hover:border-ink"
                aria-label="Search"
              >
                Search
              </button>
              <button
                onClick={() => setOpen(false)}
                className="text-[11px] uppercase tracking-wide-lg px-3 py-2 -me-2 min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus-visible:ring-1 focus-visible:ring-ink"
                aria-label="Close menu"
              >
                Close
              </button>
            </div>
          </div>
          <nav className="flex flex-1 flex-col justify-center gap-1 px-6 py-8 overflow-y-auto">
            {site.nav.map((n, i) => (
              <motion.div
                key={n.href}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 + i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  to={n.href}
                  onClick={() => setOpen(false)}
                  className="block font-display text-[clamp(32px,9vw,48px)] tracking-ultra-tight text-ink py-2 min-h-[44px] flex items-center focus:outline-none focus-visible:ring-1 focus-visible:ring-ink"
                >
                  {n.label}
                </Link>
              </motion.div>
            ))}
          </nav>
          <div className="border-t border-line px-6 py-6 flex flex-col gap-4 shrink-0">
            <div className="text-[12px] uppercase tracking-wide-lg text-muted">
              {site.city} — Est. {site.founded}
            </div>
            <div className="flex gap-6 text-[11px] uppercase tracking-wide-lg">
              {site.social.map((s) => (
                <a key={s.label} href={s.href} className="link-line text-muted hover:text-ink" data-cursor="hover">
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
