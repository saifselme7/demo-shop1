export const site = {
  name: 'SAIF STORE',
  tagline: 'Garments for the considered life',
  founded: 2019,
  city: 'Cairo',
  nav: [
    { label: 'New', href: '/shop/new' },
    { label: 'Outerwear', href: '/shop/outerwear' },
    { label: 'Knitwear', href: '/shop/knitwear' },
    { label: 'Trousers', href: '/shop/trousers' },
    { label: 'Dresses', href: '/shop/dresses' },
    { label: 'Accessories', href: '/shop/accessories' },
    { label: 'About', href: '/about' },
  ],
  announcement: 'Complimentary shipping on orders above €250 — Considered manufacture, made to endure.',
  social: [
    { label: 'Instagram', href: '#' },
    { label: 'Journal', href: '#' },
    { label: 'Newsletter', href: '#' },
  ],
}

export type Site = typeof site
