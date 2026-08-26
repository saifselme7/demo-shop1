import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '../lib/gsap'

export function useLenis() {
  useEffect(() => {
    let lenis: Lenis | null = null

    const init = () => {
      lenis = new Lenis({
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
      })

      lenis.on('scroll', ScrollTrigger.update)

      const tickerCallback = (time: number) => {
        lenis?.raf(time * 1000)
      }
      gsap.ticker.add(tickerCallback)
      gsap.ticker.lagSmoothing(0)

      ;(window as any).lenis = lenis
      ScrollTrigger.refresh()

      const onLoad = () => {
        ScrollTrigger.refresh()
        setTimeout(() => ScrollTrigger.refresh(), 500)
      }
      window.addEventListener('load', onLoad)

      return () => {
        window.removeEventListener('load', onLoad)
        gsap.ticker.remove(tickerCallback)
        lenis?.destroy()
      }
    }

    const cleanup = init()
    return cleanup
  }, [])
}
