import { ReactNode, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '../../lib/utils'

gsap.registerPlugin(ScrollTrigger)

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  duration?: number
}

export function Reveal({ children, className, delay = 0, y = 30, duration = 1 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y, opacity: 0 },
        {
          y: 0, opacity: 1, duration, delay,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
        },
      )
    })
    return () => ctx.revert()
  }, [delay, y, duration])

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  )
}

interface RevealTextProps {
  text: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  delay?: number
  stagger?: number
}

export function RevealText({
  text, className, as: Tag = 'div', delay = 0, stagger = 0.06,
}: RevealTextProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const lines = el.querySelectorAll('.reveal-line')
    const ctx = gsap.context(() => {
      gsap.fromTo(
        lines,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.1,
          ease: 'power4.out',
          stagger,
          delay,
          scrollTrigger: { trigger: el, start: 'top 88%' },
        },
      )
    })
    return () => ctx.revert()
  }, [delay, stagger])

  const segments = text.split(/(?<=[.!?,;:])\s+|\n/).filter(Boolean)

  return (
    <Tag ref={ref as any} className={cn('inline-block', className)}>
      {segments.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <span className="reveal-line inline-block will-change-transform">{line}</span>
        </span>
      ))}
    </Tag>
  )
}

interface RevealImageProps {
  src: string
  alt: string
  className?: string
  imgClassName?: string
  delay?: number
  parallax?: boolean
}

export function RevealImage({
  src, alt, className, imgClassName, delay = 0, parallax = false,
}: RevealImageProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const img = imgRef.current
    if (!wrap || !img) return
    const ctx = gsap.context(() => {
      gsap.fromTo(wrap, { clipPath: 'inset(100% 0 0 0)' }, {
        clipPath: 'inset(0% 0 0 0)',
        duration: 1.4,
        ease: 'power4.inOut',
        delay,
        scrollTrigger: { trigger: wrap, start: 'top 85%' },
      })
      gsap.fromTo(img, { scale: 1.3 }, {
        scale: parallax ? 1.15 : 1,
        duration: 1.8,
        ease: 'power3.out',
        delay,
      })
      if (parallax) {
        gsap.to(img, {
          yPercent: -8,
          ease: 'none',
          scrollTrigger: {
            trigger: wrap,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      }
    })
    return () => ctx.revert()
  }, [delay, parallax])

  return (
    <div ref={wrapRef} className={cn('overflow-hidden', className)}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading="lazy"
        className={cn('h-full w-full object-cover will-change-transform', imgClassName)}
        onError={(e) => {
          const t = e.currentTarget as HTMLImageElement
          t.style.background = 'linear-gradient(135deg,#E8E0D3,#C9BBA4)'
        }}
      />
    </div>
  )
}
