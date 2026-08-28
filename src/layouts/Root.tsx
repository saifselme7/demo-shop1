import { ReactNode, useEffect, useState, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import CustomCursor from '../components/ui/CustomCursor'
import AnnouncementBar from '../components/layout/AnnouncementBar'
import Navbar from '../components/layout/Navbar'
import MobileMenu from '../components/layout/MobileMenu'
import CartDrawer from '../components/layout/CartDrawer'
import SearchDrawer from '../components/layout/SearchDrawer'
import Footer from '../components/layout/Footer'
import { useLenis } from '../hooks/useLenis'
import { ScrollTrigger } from '../lib/gsap'
import { useUI } from '../store/ui'

export default function Root({ children }: { children: ReactNode }) {
  const location = useLocation()
  useLenis()
  const mobileMenuOpen = useUI((s) => s.mobileMenuOpen)
  const searchOpen = useUI((s) => s.searchOpen)
  const cartOpen = useUI((s) => (s as any).cartOpen) // fallback, cart uses different store
  const [headerHidden, setHeaderHidden] = useState(false)
  const lastScrollY = useRef(0)
  const ticking = useRef(false)

  useEffect(() => {
    // Reset scroll position on navigation.
    const lenis = (window as any).lenis
    if (lenis) lenis.scrollTo(0, { immediate: true })
    window.scrollTo(0, 0)

    // Refresh ScrollTrigger once the new route's DOM has painted, then once
    // more after images/fonts have a chance to settle the layout. This keeps
    // below-the-fold reveal triggers armed immediately after client-side
    // navigation (they previously could stay hidden until the first scroll).
    let raf2 = 0
    const raf1 = requestAnimationFrame(() => {
      ScrollTrigger.refresh()
      raf2 = requestAnimationFrame(() => ScrollTrigger.refresh())
    })
    const t1 = window.setTimeout(() => ScrollTrigger.refresh(), 300)
    const t2 = window.setTimeout(() => ScrollTrigger.refresh(), 800)

    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [location.pathname])

  // Scroll direction detection compatible with Lenis
  useEffect(() => {
    const handleScroll = (scrollY: number, direction: number) => {
      if (mobileMenuOpen || searchOpen) {
        // Keep header visible when overlays open
        setHeaderHidden(false)
        lastScrollY.current = scrollY
        return
      }

      const currentY = scrollY
      const lastY = lastScrollY.current
      const diff = currentY - lastY

      // At top, always visible
      if (currentY < 10) {
        setHeaderHidden(false)
      } else if (direction === 1 || diff > 5) {
        // Scrolling down and past threshold
        if (currentY > 100) {
          setHeaderHidden(true)
        }
      } else if (direction === -1 || diff < -5) {
        // Scrolling up — reveal immediately
        setHeaderHidden(false)
      }

      lastScrollY.current = currentY
    }

    const onLenisScroll = (e: any) => {
      // Lenis event contains scroll and direction
      const scroll = e.scroll ?? window.scrollY
      const direction = e.direction ?? (e.velocity > 0 ? 1 : e.velocity < 0 ? -1 : 0)
      if (!ticking.current) {
        ticking.current = true
        requestAnimationFrame(() => {
          handleScroll(scroll, direction)
          ticking.current = false
        })
      }
    }

    const onWindowScroll = () => {
      const scrollY = window.scrollY
      const direction = scrollY > lastScrollY.current ? 1 : scrollY < lastScrollY.current ? -1 : 0
      if (!ticking.current) {
        ticking.current = true
        requestAnimationFrame(() => {
          handleScroll(scrollY, direction)
          ticking.current = false
        })
      }
    }

    // Try Lenis first
    const lenis = (window as any).lenis
    if (lenis) {
      lenis.on('scroll', onLenisScroll)
      return () => {
        lenis.off('scroll', onLenisScroll)
      }
    } else {
      window.addEventListener('scroll', onWindowScroll, { passive: true })
      return () => window.removeEventListener('scroll', onWindowScroll)
    }
  }, [mobileMenuOpen, searchOpen])

  // Ensure header visible when cart opens (cart uses separate store, check via DOM or via effect)
  // We watch for cart drawer open via mutation or via polling the cart store isOpen
  // For simplicity, we keep header visible when any overlay open via CSS class
  useEffect(() => {
    const checkOverlays = () => {
      const hasOverlay = document.querySelector('[data-overlay-open="true"]')
      if (hasOverlay) setHeaderHidden(false)
    }
    const observer = new MutationObserver(checkOverlays)
    observer.observe(document.body, { attributes: true, childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <CustomCursor />
      <div className="flex min-h-screen flex-col">
        {/* Fixed header wrapper — hide/reveal on scroll */}
        <div
          className="fixed top-0 left-0 right-0 z-50 flex flex-col will-change-transform"
          style={{
            transform: headerHidden ? 'translateY(-100%)' : 'translateY(0)',
            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <AnnouncementBar />
          <Navbar />
        </div>

        {/* Spacer for fixed header */}
        <div className="h-[96px] md:h-[108px] shrink-0" aria-hidden />

        <MobileMenu />
        <CartDrawer />
        <SearchDrawer />
        <main className="flex-1 min-w-0 overflow-x-clip">{children}</main>
        <Footer />
      </div>
    </>
  )
}
