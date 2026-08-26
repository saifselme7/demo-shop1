import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Reveal, RevealText } from '../components/ui/Reveal'
import MagneticButton from '../components/ui/MagneticButton'
import { useLanguage } from '../i18n'

export default function NotFound() {
  const { t } = useLanguage()
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="container-ecru-wide py-24 md:py-32 min-h-[70vh] flex flex-col justify-center"
    >
      <span className="eyebrow mb-6 block">{t.notFound.eyebrow}</span>
      <RevealText
        as="h1"
        text={t.notFound.title}
        className="font-display text-4xl md:text-6xl lg:text-7xl tracking-ultra-tight leading-[0.95] max-w-[900px]"
      />
      <Reveal delay={0.3}>
        <p className="mt-8 max-w-md font-serif italic text-xl text-muted">
          {t.notFound.description}
        </p>
      </Reveal>
      <Reveal delay={0.4}>
        <div className="mt-12 flex flex-wrap gap-4">
          <MagneticButton to="/shop" variant="solid">
            {t.notFound.browseCollection}
          </MagneticButton>
          <MagneticButton to="/" variant="outline">
            {t.notFound.returnHome}
          </MagneticButton>
        </div>
      </Reveal>
      <Reveal delay={0.5}>
        <div className="mt-24 border-t border-line pt-8 flex flex-col gap-2 text-[11px] uppercase tracking-wide-lg text-muted">
          <span>{t.notFound.errorLabel}</span>
          <Link to="/shop" className="link-line w-fit text-ink" data-cursor="hover">
            {t.notFound.viewAll}
          </Link>
        </div>
      </Reveal>
    </motion.div>
  )
}
