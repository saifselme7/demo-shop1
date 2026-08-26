import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'

export default function Manifesto() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const el = root.current!.querySelector('.manifesto-text') as HTMLElement
      if (!el) return
      const words = el.innerText.split(' ')
      el.innerHTML = words
        .map((w) => `<span class="inline-block overflow-hidden"><span class="inline-block word">${w}&nbsp;</span></span>`)
        .join('')

      gsap.fromTo(
        '.word',
        { color: '#A8A29A' },
        {
          color: '#0E0E0E',
          stagger: 0.05,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top 75%', end: 'bottom 60%', scrub: 1 },
        },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="py-24 md:py-32 lg:py-48">
      <div className="container-ecru">
        <span className="eyebrow mb-8 md:mb-10 block">— Manifesto</span>
        <p className="manifesto-text font-display text-3xl md:text-5xl lg:text-6xl xl:text-7xl tracking-ultra-tight leading-[1.05] text-ink">
          We believe in fewer, better garments. Patterns refined across seasons, cloth chosen for hand and longevity, and editions numbered, never replenished. A wardrobe considered, not consumed.
        </p>
      </div>
    </section>
  )
}
