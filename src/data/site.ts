export const site = {
  name: 'SAIF STORE',
  tagline: 'Garments for the considered life',
  founded: 2019,
  city: 'Cairo',
  nav: [
    { label: 'New', href: '/shop/new', key: 'new' as const },
    { label: 'Outerwear', href: '/shop/outerwear', key: 'outerwear' as const },
    { label: 'Knitwear', href: '/shop/knitwear', key: 'knitwear' as const },
    { label: 'Trousers', href: '/shop/trousers', key: 'trousers' as const },
    { label: 'Dresses', href: '/shop/dresses', key: 'dresses' as const },
    { label: 'Accessories', href: '/shop/accessories', key: 'accessories' as const },
    { label: 'About', href: '/about', key: 'about' as const },
  ],
  announcement: 'Complimentary shipping on orders above €250 — Considered manufacture, made to endure.',
  social: [
    { label: 'Instagram', href: '#' },
    { label: 'Journal', href: '#' },
    { label: 'Newsletter', href: '#' },
  ],
}

export type Site = typeof site
export type NavKey = (typeof site.nav)[number]['key']
