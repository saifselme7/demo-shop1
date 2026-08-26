import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    const xDot = gsap.quickTo(dot, 'x', { duration: 0.15, ease: 'power3' })
    const yDot = gsap.quickTo(dot, 'y', { duration: 0.15, ease: 'power3' })
    const xRing = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' })
    const yRing = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' })

    const onMove = (e: MouseEvent) => {
      xDot(e.clientX); yDot(e.clientY)
      xRing(e.clientX); yRing(e.clientY)
    }

    const onOver = (e: Event) => {
      const t = e.target as HTMLElement
      if (t.closest('a, button, [data-cursor="hover"]')) {
        gsap.to(ring, { width: 64, height: 64, backgroundColor: 'rgba(14,14,14,0.06)', borderColor: 'rgba(14,14,14,0)', duration: 0.4 })
        gsap.to(dot, { scale: 0, duration: 0.3 })
      }
    }

    const onOut = (e: Event) => {
      const t = e.target as HTMLElement
      if (t.closest('a, button, [data-cursor="hover"]')) {
        gsap.to(ring, { width: 36, height: 36, backgroundColor: 'rgba(14,14,14,0)', borderColor: 'rgba(14,14,14,0.4)', duration: 0.4 })
        gsap.to(dot, { scale: 1, duration: 0.3 })
      }
    }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
    }
  }, [])

  return (
    <>
      <div ref={ringRef} className="cursor-ring" />
      <div ref={dotRef} className="cursor-dot" />
    </>
  )
}
