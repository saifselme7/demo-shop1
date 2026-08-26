import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { gsap } from '../../lib/gsap'
import { useLanguage } from '../../i18n'

interface Props {
  onComplete?: () => void
}

export default function Loader({ onComplete }: Props) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const { t } = useLanguage()

  useEffect(() => {
    const ctx = gsap.context(() => {
      const counter = { v: 0 }
      gsap.to(counter, {
        v: 100,
        duration: 2.2,
        ease: 'power2.inOut',
        onUpdate: () => setCount(Math.floor(counter.v)),
        onComplete: () => {
          gsap.to('.loader-content', {
            yPercent: -100,
            duration: 0.8,
            ease: 'power3.inOut',
          })
          gsap.to(ref.current, {
            yPercent: -100,
            duration: 1,
            delay: 0.3,
            ease: 'power3.inOut',
            onComplete: () => {
              onComplete?.()
            },
          })
        },
      })
    })
    return () => ctx.revert()
  }, [onComplete])

  return (
    <motion.div
      ref={ref}
      className="fixed inset-0 z-[10000] bg-ink text-paper flex items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
    >
      <div className="loader-content flex flex-col items-center">
        <span className="eyebrow text-paper/60 mb-4">{t.loader.established}</span>
        <div className="font-display text-[18vw] md:text-[16vw] leading-none tracking-ultra-tight">
          {String(count).padStart(3, '0')}
        </div>
      </div>
    </motion.div>
  )
}
