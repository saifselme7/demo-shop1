import { ReactNode, useEffect } from 'react'
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

export default function Root({ children }: { children: ReactNode }) {
  const location = useLocation()
  useLenis()

  useEffect(() => {
    const lenis = (window as any).lenis
    if (lenis) lenis.scrollTo(0, { immediate: true })
    window.scrollTo(0, 0)
    setTimeout(() => ScrollTrigger.refresh(), 100)
  }, [location.pathname])

  return (
    <>
      <CustomCursor />
      <div className="flex min-h-screen flex-col">
        {/* Fixed header wrapper — ensures navbar always accessible */}
        <div className="fixed top-0 left-0 right-0 z-50 flex flex-col">
          <AnnouncementBar />
          <Navbar />
        </div>

        {/* Spacer for fixed header — announcement ~40px + navbar 68px = ~108px, responsive */}
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
