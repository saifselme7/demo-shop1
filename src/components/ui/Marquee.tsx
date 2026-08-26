import { ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface Props {
  children: ReactNode
  className?: string
  speed?: 'slow' | 'normal' | 'fast'
}

export default function Marquee({ children, className, speed = 'normal' }: Props) {
  const dur = speed === 'slow' ? '60s' : speed === 'fast' ? '20s' : '40s'
  return (
    <div className={cn('relative flex overflow-hidden', className)}>
      <div
        className="flex shrink-0 animate-marquee items-center gap-12 pr-12"
        style={{ animationDuration: dur }}
      >
        {children}
      </div>
      <div
        className="flex shrink-0 animate-marquee items-center gap-12 pr-12"
        style={{ animationDuration: dur }}
        aria-hidden
      >
        {children}
      </div>
    </div>
  )
}
