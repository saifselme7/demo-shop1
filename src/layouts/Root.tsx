import { ReactNode, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import CustomCursor from '../components/ui/CustomCursor'
import AnnouncementBar from '../components/layout/AnnouncementBar'
import Navbar from '../components/layout/Navbar'
import MobileMenu from '../components/layout/MobileMenu'
import CartDrawer from '../components/layout/CartDrawer'
import Footer from '../components/layout/Footer'
import { useLenis } from '../hooks/useLenis'

export default function Root({ children }: { children: ReactNode }) {
  const location = useLocation()
  useLenis()

  useEffect(() => {
    const lenis = (window as any).lenis
    if (lenis) lenis.scrollTo(0, { immediate: true })
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <>
      <CustomCursor />
      <div className="flex min-h-screen flex-col">
        <AnnouncementBar />
        <Navbar />
        <MobileMenu />
        <CartDrawer />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </>
  )
}
