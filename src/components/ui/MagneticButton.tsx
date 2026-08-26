import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useMagnetic } from '../../hooks/useMagnetic'
import { cn } from '../../lib/utils'

interface Props {
  children: ReactNode
  href?: string
  to?: string
  type?: 'button' | 'submit'
  variant?: 'solid' | 'outline' | 'ghost' | 'underline'
  className?: string
}

export default function MagneticButton({
  children, href, to, type = 'button', variant = 'outline', className,
}: Props) {
  const ref = useMagnetic<HTMLButtonElement | HTMLAnchorElement>(0.3)

  const base = cn(
    'group relative inline-flex items-center justify-center overflow-hidden px-8 py-4',
    'text-[11px] uppercase tracking-wide-lg transition-colors duration-500',
    variant === 'solid' && 'bg-ink text-paper hover:bg-ochre',
    variant === 'outline' && 'border border-ink text-ink hover:text-paper',
    variant === 'ghost' && 'text-ink',
    variant === 'underline' && 'btn-underline',
    className,
  )

  const content = (
    <span className="relative z-10 flex items-center gap-2">{children}</span>
  )

  const fill = (
    <span
      className="pointer-events-none absolute inset-0 -z-0 translate-y-full bg-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0"
      aria-hidden
    />
  )

  if (href) {
    return (
      <a href={href} ref={ref as React.RefObject<HTMLAnchorElement>} className={base} data-cursor="hover">
        {fill}{content}
      </a>
    )
  }
  if (to) {
    return (
      <Link to={to} ref={ref as unknown as React.RefObject<HTMLAnchorElement>} className={base} data-cursor="hover">
        {fill}{content}
      </Link>
    )
  }
  return (
    <button type={type} ref={ref} className={base} data-cursor="hover">
      {fill}{content}
    </button>
  )
}
