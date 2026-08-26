import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { useLanguage } from '../i18n'

export default function Manifesto() {
  const root = useRef<HTMLElement>(null)
  const { t } = useLanguage()

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
  }, [t.manifesto.text])

  return (
    <section ref={root} className="py-24 md:py-32 lg:py-48">
      <div className="container-ecru">
        <span className="eyebrow mb-8 md:mb-10 block">{t.manifesto.eyebrow}</span>
        <p className="manifesto-text font-display text-2xl md:text-4xl lg:text-5xl xl:text-6xl tracking-ultra-tight leading-[1.15] text-ink">
          {t.manifesto.text}
        </p>
      </div>
    </section>
  )
}
