import { cn } from '../../lib/utils'
import { useLanguage } from '../../i18n'

interface Props {
  sizes: string[]
  selected: string | null
  onSelect: (size: string) => void
}

export default function SizeSelector({ sizes, selected, onSelect }: Props) {
  const { t } = useLanguage()
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="eyebrow">{t.product.size}</span>
        <button
          className="text-[11px] uppercase tracking-wide-lg text-muted link-line focus:outline-none focus-visible:ring-1 focus-visible:ring-ink"
          data-cursor="hover"
          title="Size guide — coming soon"
        >
          {t.product.sizeGuide}
        </button>
      </div>
      <div className="flex flex-wrap gap-2.5">
        {sizes.map((s) => (
          <button
            key={s}
            onClick={() => onSelect(s)}
            className={cn(
              'min-w-[60px] min-h-[48px] border px-4 py-3 text-[12px] uppercase tracking-wide-lg transition-all duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-ink focus-visible:ring-offset-1',
              selected === s
                ? 'border-ink bg-ink text-paper ring-1 ring-ink'
                : 'border-line text-ink hover:border-ink hover:bg-cream/50',
            )}
            data-cursor="hover"
            aria-pressed={selected === s}
            aria-label={`${t.product.size} ${s}`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}
