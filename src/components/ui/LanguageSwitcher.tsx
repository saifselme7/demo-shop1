import { useLanguage } from '../../i18n'
import { cn } from '../../lib/utils'

export default function LanguageSwitcher({ className }: { className?: string }) {
  const { language, setLanguage } = useLanguage()

  return (
    <div className={cn('flex items-center gap-2 text-[11px] uppercase tracking-wide-lg', className)} aria-label="Language">
      <button
        onClick={() => setLanguage('en')}
        aria-pressed={language === 'en'}
        aria-label="Switch to English"
        className={cn(
          'transition-colors duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-ink px-1',
          language === 'en' ? 'text-ink font-medium' : 'text-muted hover:text-ink',
        )}
        data-cursor="hover"
      >
        EN
      </button>
      <span className="text-line">|</span>
      <button
        onClick={() => setLanguage('ar')}
        aria-pressed={language === 'ar'}
        aria-label="Switch to Arabic"
        className={cn(
          'transition-colors duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-ink px-1',
          language === 'ar' ? 'text-ink font-medium' : 'text-muted hover:text-ink',
        )}
        data-cursor="hover"
      >
        AR
      </button>
    </div>
  )
}
