import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { gsap } from '../../lib/gsap'
import { site } from '../../data/site'
import { useCart, cartCount } from '../../store/cart'
import { useUI } from '../../store/ui'
import { cn } from '../../lib/utils'
import { useLanguage } from '../../i18n'
import LanguageSwitcher from '../ui/LanguageSwitcher'

export default function Navbar() {
  const location = useLocation()
  const items = useCart((s) => s.items)
  const open = useCart((s) => s.open)
  const setMobileMenu = useUI((s) => s.setMobileMenu)
  const [scrolled, setScrolled] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const { t } = useLanguage()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.nav-item', {
        y: -20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.05,
        delay: 2.7,
        ease: 'power3.out',
      })
    }, navRef)
    return () => ctx.revert()
  }, [])

  const navItems = [
    { label: t.nav.new, href: '/shop/new' },
    { label: t.nav.outerwear, href: '/shop/outerwear' },
    { label: t.nav.knitwear, href: '/shop/knitwear' },
    { label: t.nav.trousers, href: '/shop/trousers' },
    { label: t.nav.dresses, href: '/shop/dresses' },
    { label: t.nav.accessories, href: '/shop/accessories' },
    { label: t.nav.about, href: '/about' },
  ]

  return (
    <header
      ref={navRef}
      className={cn(
        'sticky top-0 z-50 border-b transition-all duration-500',
        scrolled
          ? 'bg-paper/90 backdrop-blur-xl border-line shadow-[0_1px_0_0_rgba(0,0,0,0.04)]'
          : 'bg-transparent border-transparent',
      )}
    >
      <div className="container-ecru-wide flex h-[68px] items-center justify-between">
        <nav className="hidden lg:flex items-center gap-7">
          {navItems.slice(0, 4).map((n) => (
            <Link
              key={n.href}
              to={n.href}
              className={cn(
                'nav-item link-line text-[12px] uppercase tracking-wide-lg text-ink focus:outline-none focus-visible:ring-1 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper',
                location.pathname === n.href && 'text-ochre',
              )}
              data-cursor="hover"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <Link
          to="/"
          className="nav-item absolute left-1/2 -translate-x-1/2 font-display text-xl md:text-2xl font-bold tracking-ultra-tight text-ink focus:outline-none focus-visible:ring-1 focus-visible:ring-ink whitespace-nowrap"
          data-cursor="hover"
        >
          SAIF STORE
        </Link>

        <div className="flex items-center gap-3 md:gap-5">
          <nav className="hidden lg:flex items-center gap-7">
            {navItems.slice(4).map((n) => (
              <Link
                key={n.href}
                to={n.href}
                className={cn(
                  'nav-item link-line text-[12px] uppercase tracking-wide-lg text-ink focus:outline-none focus-visible:ring-1 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper',
                  location.pathname === n.href && 'text-ochre',
                )}
                data-cursor="hover"
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <LanguageSwitcher className="nav-item hidden md:flex" />
          <button
            className="nav-item text-[12px] uppercase tracking-wide-lg text-ink link-line hidden md:inline-block focus:outline-none focus-visible:ring-1 focus-visible:ring-ink"
            data-cursor="hover"
            title="Search — coming soon"
            aria-label={t.nav.search}
          >
            {t.nav.search}
          </button>
          <button
            onClick={open}
            className="nav-item relative text-[12px] uppercase tracking-wide-lg text-ink focus:outline-none focus-visible:ring-1 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
            data-cursor="hover"
            aria-label="Open cart"
          >
            {t.nav.cart}
            <span className="ms-1.5 inline-flex items-center justify-center text-[10px] tabular-nums">
              ({cartCount(items)})
            </span>
          </button>
          <button
            onClick={() => setMobileMenu(true)}
            className="lg:hidden flex flex-col gap-[6px] p-3 -me-2 focus:outline-none focus-visible:ring-1 focus-visible:ring-ink"
            data-cursor="hover"
            aria-label="Open menu"
          >
            <span className="block h-px w-6 bg-ink" />
            <span className="block h-px w-6 bg-ink" />
          </button>
        </div>
      </div>
    </header>
  )
}
