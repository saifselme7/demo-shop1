import { cn } from '../../lib/utils'

interface Props {
  sizes: string[]
  selected: string | null
  onSelect: (size: string) => void
}

export default function SizeSelector({ sizes, selected, onSelect }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="eyebrow">Size</span>
        <button className="text-[11px] uppercase tracking-wide-lg text-muted link-line" data-cursor="hover">
          Size Guide
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {sizes.map((s) => (
          <button
            key={s}
            onClick={() => onSelect(s)}
            className={cn(
              'min-w-[56px] border px-4 py-3 text-[12px] uppercase tracking-wide-lg transition-all duration-300',
              selected === s
                ? 'border-ink bg-ink text-paper'
                : 'border-line text-ink hover:border-ink',
            )}
            data-cursor="hover"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}
