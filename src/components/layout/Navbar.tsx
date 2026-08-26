import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { site } from '../../data/site'
import { useCart, cartCount } from '../../store/cart'
import { useUI } from '../../store/ui'
import { cn } from '../../lib/utils'

export default function Navbar() {
  const location = useLocation()
  const items = useCart((s) => s.items)
  const open = useCart((s) => s.open)
  const setMobileMenu = useUI((s) => s.setMobileMenu)
  const [scrolled, setScrolled] = useState(false)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    onScroll()
    window.addEventListener('scroll', onScroll)
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
          ? 'bg-paper/85 backdrop-blur-md border-line'
          : 'bg-transparent border-transparent',
      )}
    >
      <div className="container-ecru-wide flex h-[68px] items-center justify-between">
        <nav className="hidden lg:flex items-center gap-7">
          {site.nav.slice(0, 4).map((n) => (
            <Link
              key={n.href}
              to={n.href}
              className={cn(
                'nav-item link-line text-[12px] uppercase tracking-wide-lg text-ink',
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
          className="nav-item absolute left-1/2 -translate-x-1/2 font-display text-2xl font-bold tracking-ultra-tight text-ink"
          data-cursor="hover"
        >
          ÉCRU
        </Link>

        <div className="flex items-center gap-5">
          <nav className="hidden lg:flex items-center gap-7">
            {site.nav.slice(4).map((n) => (
              <Link
                key={n.href}
                to={n.href}
                className={cn(
                  'nav-item link-line text-[12px] uppercase tracking-wide-lg text-ink',
                  location.pathname === n.href && 'text-ochre',
                )}
                data-cursor="hover"
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <button
            className="nav-item text-[12px] uppercase tracking-wide-lg text-ink link-line hidden md:inline-block"
            data-cursor="hover"
          >
            Search
          </button>
          <button
            onClick={open}
            className="nav-item relative text-[12px] uppercase tracking-wide-lg text-ink"
            data-cursor="hover"
          >
            Cart
            <span className="ml-1.5 inline-flex items-center justify-center text-[10px]">
              ({cartCount(items)})
            </span>
          </button>
          <button
            onClick={() => setMobileMenu(true)}
            className="lg:hidden flex flex-col gap-[5px] p-2"
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
