import { Link } from 'react-router-dom'
import { site } from '../../data/site'
import { collections } from '../../data/collections'
import { useLanguage } from '../../i18n'

export default function Footer() {
  const { t, language } = useLanguage()

  return (
    <footer className="border-t border-line bg-paper">
      <div className="container-ecru-wide py-16 md:py-20">
        <div className="grid grid-cols-1 gap-10 md:gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl xl:text-8xl tracking-ultra-tight leading-none">
              SAIF STORE
            </h2>
            <p className="mt-5 md:mt-6 max-w-md font-serif italic text-lg text-muted">
              {t.footer.tagline}
            </p>
            <p className="mt-6 md:mt-8 max-w-md text-[13px] md:text-[14px] leading-relaxed text-muted">
              {t.footer.description}
            </p>
          </div>

          <div className="lg:col-span-2">
            <span className="eyebrow mb-4 block">{t.footer.browse}</span>
            <ul className="flex flex-col gap-2.5 text-[13px] md:text-[14px]">
              <li><Link to="/shop/new" className="link-line focus:outline-none focus-visible:ring-1 focus-visible:ring-ink" data-cursor="hover">{t.nav.new}</Link></li>
              <li><Link to="/shop/outerwear" className="link-line focus:outline-none focus-visible:ring-1 focus-visible:ring-ink" data-cursor="hover">{t.nav.outerwear}</Link></li>
              <li><Link to="/shop/knitwear" className="link-line focus:outline-none focus-visible:ring-1 focus-visible:ring-ink" data-cursor="hover">{t.nav.knitwear}</Link></li>
              <li><Link to="/shop/trousers" className="link-line focus:outline-none focus-visible:ring-1 focus-visible:ring-ink" data-cursor="hover">{t.nav.trousers}</Link></li>
              <li><Link to="/shop/dresses" className="link-line focus:outline-none focus-visible:ring-1 focus-visible:ring-ink" data-cursor="hover">{t.nav.dresses}</Link></li>
              <li><Link to="/shop/accessories" className="link-line focus:outline-none focus-visible:ring-1 focus-visible:ring-ink" data-cursor="hover">{t.nav.accessories}</Link></li>
              <li><Link to="/about" className="link-line focus:outline-none focus-visible:ring-1 focus-visible:ring-ink" data-cursor="hover">{t.nav.about}</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <span className="eyebrow mb-4 block">{t.footer.collections}</span>
            <ul className="flex flex-col gap-2.5 text-[13px] md:text-[14px]">
              {collections.map((c) => (
                <li key={c.slug}>
                  <Link to={`/shop?collection=${c.slug}`} className="link-line focus:outline-none focus-visible:ring-1 focus-visible:ring-ink" data-cursor="hover">{c.title[language]}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <span className="eyebrow mb-4 block">{t.footer.follow}</span>
            <ul className="flex flex-col gap-2.5 text-[13px] md:text-[14px]">
              {site.social.map((s) => (
                <li key={s.label}>
                  <a href={s.href} className="link-line focus:outline-none focus-visible:ring-1 focus-visible:ring-ink" data-cursor="hover">{s.label}</a>
                </li>
              ))}
            </ul>
            <span className="eyebrow mt-8 mb-4 block">{t.footer.atelier}</span>
            <p className="text-[13px] md:text-[14px] leading-relaxed text-muted">
              {site.city}<br />
              Est. {site.founded}
            </p>
          </div>
        </div>

        <div className="mt-12 md:mt-16 flex flex-col gap-4 border-t border-line pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-[11px] uppercase tracking-wide-lg text-muted">
            © {new Date().getFullYear()} SAIF STORE. {t.footer.rights}
          </p>
          <div className="flex flex-wrap gap-4 md:gap-6 text-[11px] uppercase tracking-wide-lg text-muted">
            <a href="#" className="link-line focus:outline-none focus-visible:ring-1 focus-visible:ring-ink" data-cursor="hover">{t.footer.privacy}</a>
            <a href="#" className="link-line focus:outline-none focus-visible:ring-1 focus-visible:ring-ink" data-cursor="hover">{t.footer.terms}</a>
            <a href="#" className="link-line focus:outline-none focus-visible:ring-1 focus-visible:ring-ink" data-cursor="hover">{t.footer.shipping}</a>
            <a href="#" className="link-line focus:outline-none focus-visible:ring-1 focus-visible:ring-ink" data-cursor="hover">{t.footer.returns}</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
