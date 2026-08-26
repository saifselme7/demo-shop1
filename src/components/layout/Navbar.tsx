import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from '../../lib/gsap'
import { useCart, cartCount } from '../../store/cart'
import { useUI } from '../../store/ui'
import { cn } from '../../lib/utils'

export default function Navbar() {
  const items = useCart((s) => s.items)
  const openCart = useCart((s) => s.open)
  const mobileMenuOpen = useUI((s) => s.mobileMenuOpen)
  const setMobileMenu = useUI((s) => s.setMobileMenu)
  const [scrolled, setScrolled] = useState(false)
  const navRef = useRef<HTMLElement>(null)

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
        {/* Menu Icon — always visible, left */}
        <button
          onClick={() => setMobileMenu(!mobileMenuOpen)}
          className="nav-item group flex items-center gap-3 focus:outline-none focus-visible:ring-1 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper min-h-[44px] min-w-[44px] px-2 -ms-2"
          data-cursor="hover"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          <span className="flex flex-col gap-[5px] w-6">
            <span
              className={cn(
                'block h-px bg-ink transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
                mobileMenuOpen ? 'rotate-45 translate-y-[3px] w-6' : 'w-6',
              )}
            />
            <span
              className={cn(
                'block h-px bg-ink transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
                mobileMenuOpen ? '-rotate-45 -translate-y-[3px] w-6' : 'w-4 group-hover:w-6',
              )}
            />
          </span>
          <span className="hidden md:inline text-[11px] uppercase tracking-wide-lg">
            {mobileMenuOpen ? 'Close' : 'Menu'}
          </span>
        </button>

        {/* Logo — centered */}
        <Link
          to="/"
          className="nav-item absolute left-1/2 -translate-x-1/2 font-display text-lg md:text-xl lg:text-2xl font-bold tracking-ultra-tight text-ink focus:outline-none focus-visible:ring-1 focus-visible:ring-ink whitespace-nowrap"
          data-cursor="hover"
        >
          SAIF STORE
        </Link>

        {/* Cart — always visible, right */}
        <div className="flex items-center gap-2">
          <button
            onClick={openCart}
            className="nav-item relative flex items-center gap-1.5 text-[11px] md:text-[12px] uppercase tracking-wide-lg text-ink focus:outline-none focus-visible:ring-1 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper min-h-[44px] px-3 border border-transparent hover:border-line transition-colors"
            data-cursor="hover"
            aria-label="Open cart"
          >
            <span>Cart</span>
            <span className="inline-flex items-center justify-center text-[10px] tabular-nums bg-ink text-paper min-w-[20px] h-[20px] px-1 rounded-full">
              {cartCount(items)}
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}
