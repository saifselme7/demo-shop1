import { Link } from 'react-router-dom'
import { site } from '../../data/site'
import { collections } from '../../data/collections'

export default function Footer() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="container-ecru-wide py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="font-display text-7xl md:text-9xl tracking-ultra-tight leading-none">
              ÉCRU
            </h2>
            <p className="mt-6 max-w-md font-serif italic text-lg text-muted">
              {site.tagline}.
            </p>
            <p className="mt-8 max-w-md text-[14px] leading-relaxed text-muted">
              A studied wardrobe of essential pieces — patterns refined across seasons,
              made in numbered editions, intended to endure.
            </p>
          </div>

          <div className="lg:col-span-2">
            <span className="eyebrow mb-4 block">Browse</span>
            <ul className="flex flex-col gap-2.5 text-[14px]">
              {site.nav.map((n) => (
                <li key={n.href}>
                  <Link to={n.href} className="link-line" data-cursor="hover">{n.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <span className="eyebrow mb-4 block">Collections</span>
            <ul className="flex flex-col gap-2.5 text-[14px]">
              {collections.map((c) => (
                <li key={c.slug}>
                  <Link to="/shop" className="link-line" data-cursor="hover">{c.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <span className="eyebrow mb-4 block">Follow</span>
            <ul className="flex flex-col gap-2.5 text-[14px]">
              {site.social.map((s) => (
                <li key={s.label}>
                  <a href={s.href} className="link-line" data-cursor="hover">{s.label}</a>
                </li>
              ))}
            </ul>
            <span className="eyebrow mt-8 mb-4 block">Atelier</span>
            <p className="text-[14px] leading-relaxed text-muted">
              {site.city}<br />
              Est. {site.founded}
            </p>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-[11px] uppercase tracking-wide-lg text-muted">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <div className="flex gap-6 text-[11px] uppercase tracking-wide-lg text-muted">
            <a href="#" className="link-line" data-cursor="hover">Privacy</a>
            <a href="#" className="link-line" data-cursor="hover">Terms</a>
            <a href="#" className="link-line" data-cursor="hover">Shipping</a>
            <a href="#" className="link-line" data-cursor="hover">Returns</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
