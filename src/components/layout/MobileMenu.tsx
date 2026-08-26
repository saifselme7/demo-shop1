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

  const shopLinks = [
    { label: 'New', href: '/shop/new' },
    { label: 'Outerwear', href: '/shop/outerwear' },
    { label: 'Knitwear', href: '/shop/knitwear' },
    { label: 'Trousers', href: '/shop/trousers' },
    { label: 'Dresses', href: '/shop/dresses' },
    { label: 'Accessories', href: '/shop/accessories' },
  ]

  const otherLinks = [
    { label: 'Shop All', href: '/shop' },
    { label: 'About', href: '/about' },
  ]

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
          <div className="flex h-[68px] items-center justify-between px-6 md:px-10 lg:px-16 border-b border-line shrink-0">
            <span className="font-display text-lg md:text-xl font-bold tracking-ultra-tight">SAIF STORE</span>
            <button
              onClick={() => setOpen(false)}
              className="group flex items-center gap-2 text-[11px] uppercase tracking-wide-lg px-3 py-2 -me-2 min-h-[44px] min-w-[44px] focus:outline-none focus-visible:ring-1 focus-visible:ring-ink"
              aria-label="Close menu"
            >
              <span className="flex flex-col gap-[5px] w-6">
                <span className="block h-px w-6 bg-ink rotate-45 translate-y-[3px] transition-all duration-300" />
                <span className="block h-px w-6 bg-ink -rotate-45 -translate-y-[3px] transition-all duration-300" />
              </span>
              <span className="hidden md:inline">Close</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar">
            <div className="container-ecru-wide py-10 md:py-16 lg:py-20 grid lg:grid-cols-12 gap-10">
              {/* Shop / Collections */}
              <div className="lg:col-span-7">
                <span className="eyebrow mb-6 md:mb-8 block">— Shop / Collections</span>
                <nav className="flex flex-col gap-1">
                  {shopLinks.map((n, i) => (
                    <motion.div
                      key={n.href}
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 + i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Link
                        to={n.href}
                        onClick={() => setOpen(false)}
                        className="group flex items-baseline justify-between py-2 md:py-3 border-b border-line/50 hover:border-ink transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-ink"
                      >
                        <span className="font-display text-[clamp(28px,7vw,56px)] md:text-5xl lg:text-6xl tracking-ultra-tight leading-[0.9] group-hover:text-ochre transition-colors">
                          {n.label}
                        </span>
                        <span className="text-[11px] uppercase tracking-wide-lg text-muted group-hover:text-ink transition-colors hidden md:inline">→</span>
                      </Link>
                    </motion.div>
                  ))}
                </nav>
              </div>

              {/* Other + Info */}
              <div className="lg:col-span-5 flex flex-col gap-10 lg:pl-12">
                <div>
                  <span className="eyebrow mb-6 block">— Navigate</span>
                  <nav className="flex flex-col gap-3">
                    {otherLinks.map((n, i) => (
                      <motion.div
                        key={n.href}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 + i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <Link
                          to={n.href}
                          onClick={() => setOpen(false)}
                          className="text-[13px] md:text-[14px] link-line focus:outline-none focus-visible:ring-1 focus-visible:ring-ink py-1 min-h-[32px] flex items-center"
                        >
                          {n.label}
                        </Link>
                      </motion.div>
                    ))}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                    >
                      <button
                        onClick={() => {
                          setOpen(false)
                          setTimeout(() => setSearchOpen(true), 350)
                        }}
                        className="text-[13px] md:text-[14px] link-line text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-ink py-1 min-h-[32px] flex items-center"
                        aria-label="Search"
                      >
                        Search
                      </button>
                    </motion.div>
                  </nav>
                </div>

                <div className="border-t border-line pt-8">
                  <span className="eyebrow mb-4 block">— Atelier</span>
                  <p className="text-[13px] leading-relaxed text-muted max-w-[320px]">
                    SAIF STORE — A studied wardrobe of essential pieces, made in numbered editions, intended to endure. {site.city} — Est. {site.founded}
                  </p>
                  <div className="mt-6 flex gap-6 text-[11px] uppercase tracking-wide-lg">
                    {site.social.map((s) => (
                      <a key={s.label} href={s.href} className="link-line text-muted hover:text-ink" data-cursor="hover">
                        {s.label}
                      </a>
                    ))}
                  </div>
                </div>

                <div className="mt-auto pt-8">
                  <p className="text-[11px] uppercase tracking-wide-lg text-muted">
                    Complimentary shipping above €250 — Considered manufacture, made to endure.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
