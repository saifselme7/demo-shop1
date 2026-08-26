import { useState, useEffect } from 'react'
import { cn } from '../../lib/utils'

interface Props {
  src: string
  alt: string
  className?: string
  imgClassName?: string
  fallbackClassName?: string
  loading?: 'eager' | 'lazy'
  decoding?: 'async' | 'sync' | 'auto'
  fetchPriority?: 'high' | 'low' | 'auto'
}

export default function SafeImage({
  src,
  alt,
  className,
  imgClassName,
  fallbackClassName,
  loading = 'lazy',
  decoding = 'async',
  fetchPriority = 'auto',
}: Props) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading')
  const [currentSrc, setCurrentSrc] = useState(src)

  useEffect(() => {
    setCurrentSrc(src)
    setStatus('loading')
  }, [src])

  return (
    <div className={cn('relative overflow-hidden bg-cream', className)}>
      {status === 'loading' && (
        <div className="absolute inset-0 bg-cream animate-pulse" aria-hidden />
      )}

      {status !== 'error' ? (
        <img
          src={currentSrc}
          alt={alt}
          loading={loading}
          decoding={decoding}
          fetchPriority={fetchPriority}
          className={cn('h-full w-full object-cover transition-opacity duration-500', status === 'loaded' ? 'opacity-100' : 'opacity-0', imgClassName)}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
        />
      ) : null}

      {status === 'error' && (
        <div className={cn('absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-cream to-sand border border-line/30', fallbackClassName)}>
          <span className="font-display text-[10px] uppercase tracking-wide-lg text-muted">SAIF STORE</span>
          <span className="mt-1 text-[10px] uppercase tracking-wide-lg text-muted/60">Image unavailable</span>
        </div>
      )}
    </div>
  )
}
