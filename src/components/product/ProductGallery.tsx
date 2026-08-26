import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../lib/utils'

export default function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0)

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-[3/4] overflow-hidden bg-cream">
        <AnimatePresence mode="wait">
          <motion.img
            key={active}
            src={images[active]}
            alt={alt}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 h-full w-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.background = 'linear-gradient(135deg,#E8E0D3,#C9BBA4)'
            }}
          />
        </AnimatePresence>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={cn(
              'relative aspect-[3/4] overflow-hidden bg-cream transition-all duration-500',
              active === i ? 'ring-1 ring-ink' : 'opacity-60 hover:opacity-100',
            )}
            data-cursor="hover"
          >
            <img src={src} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}
