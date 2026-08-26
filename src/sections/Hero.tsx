import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MagneticButton from '../components/ui/MagneticButton'
import { site } from '../data/site'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 2.8 })
      tl.from('.hero-eyebrow', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' })
        .from('.hero-line', { yPercent: 110, opacity: 0, duration: 1.2, stagger: 0.12, ease: 'power4.out' }, '-=0.4')
        .from('.hero-meta', { y: 20, opacity: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out' }, '-=0.6')
        .from('.hero-cta', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4')
        .from('.hero-image', {
          clipPath: 'inset(100% 0 0 0)',
          duration: 1.4,
          ease: 'power4.inOut',
        }, '-=1')
        .from('.hero-image img', { scale: 1.3, duration: 1.8, ease: 'power3.out' }, '<')

      gsap.to('.hero-image img', {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('.hero-content', {
        yPercent: -20,
        opacity: 0.4,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="relative h-[100svh] min-h-[600px] overflow-hidden">
      <div className="hero-image absolute inset-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43e?auto=format&fit=crop&w=2000&q=80"
          alt="ÉCRU AW Reserve"
          className="h-[115%] w-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.background = 'linear-gradient(135deg,#E8E0D3,#6B4F2A)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/10 via-transparent to-ink/30" />
      </div>

      <div className="hero-content relative z-10 flex h-full flex-col justify-between px-6 py-10 md:px-10 md:py-12 lg:px-16 lg:py-16">
        <div className="flex items-start justify-between">
          <span className="hero-eyebrow eyebrow text-paper/80">ÉCRU — AW / Reserve ’25</span>
          <span className="hero-eyebrow hidden text-paper/80 md:block">{site.city}</span>
        </div>

        <div className="max-w-[1400px]">
          <h1 className="font-display text-[14vw] md:text-[12vw] lg:text-[11vw] xl:text-[10vw] leading-[0.85] tracking-ultra-tight text-paper">
            <span className="block overflow-hidden"><span className="hero-line inline-block">Garments for</span></span>
            <span className="block overflow-hidden"><span className="hero-line inline-block">the considered</span></span>
            <span className="block overflow-hidden"><span className="hero-line inline-block font-serif italic font-normal">life.</span></span>
          </h1>
        </div>

        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="hero-meta max-w-md">
            <p className="text-paper/90 text-[15px] leading-relaxed">
              A studied wardrobe of essential pieces — patterns refined across seasons,
              made in numbered editions, intended to endure.
            </p>
          </div>
          <div className="hero-cta flex flex-wrap gap-4">
            <MagneticButton to="/shop" variant="solid" className="text-paper">
              Browse the collection
            </MagneticButton>
            <MagneticButton to="/about" variant="outline" className="border-paper text-paper">
              The atelier
            </MagneticButton>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-paper/70 md:flex">
        <span className="text-[10px] uppercase tracking-wide-lg">Scroll</span>
        <span className="h-12 w-px bg-paper/40" />
      </div>
    </section>
  )
}
