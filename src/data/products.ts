export interface Product {
  id: string
  slug: string
  name: string
  subtitle: string
  price: number
  currency: string
  category: string
  collection: string
  description: string
  details: string[]
  sizes: string[]
  colors: { name: string; hex: string }[]
  images: string[]
  featured?: boolean
  isNew?: boolean
}

const img = (id: string, w = 1200) => {
  const full = id.startsWith('photo-') || id.startsWith('premium_photo-') ? id : `photo-${id}`
  return `https://images.unsplash.com/${full}?auto=format&fit=crop&w=${w}&q=80`
}

export const products: Product[] = [
  {
    id: 'p01',
    slug: 'oversized-wool-coat',
    name: 'Oversized Wool Coat',
    subtitle: 'Brushed merino, mid-length',
    price: 685,
    currency: '€',
    category: 'outerwear',
    collection: 'aw-reserve',
    description:
      'A loose, architectural coat cut from brushed merino. Raglan sleeves, concealed placket, and a weighted hem that falls without resistance.',
    details: [
      '100% Italian merino wool',
      'Concealed horn-button placket',
      'Bemberg cupro lining',
      'Made in Portugal',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Charcoal', hex: '#3A3A38' },
      { name: 'Camel', hex: '#A88B66' },
    ],
    images: [
      img('1490481651871-ab68de25d43d', 1400),
      img('1485230895905-ec40ba36b9bc', 1400),
    ],
    featured: true,
    isNew: true,
  },
  {
    id: 'p02',
    slug: 'cashmere-mock-neck',
    name: 'Cashmere Mock Neck',
    subtitle: '8-gauge, undyed fibre',
    price: 320,
    currency: '€',
    category: 'knitwear',
    collection: 'aw-reserve',
    description:
      'A relaxed mock-neck pullover knitted from undyed Mongolian cashmere. Boxy through the body, with a ribbed funnel collar.',
    details: [
      '100% grade-A Mongolian cashmere',
      '8-gauge plain knit',
      'Ribbed funnel collar and cuffs',
      'Made in Scotland',
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Oat', hex: '#D9CDB6' },
      { name: 'Stone', hex: '#A39782' },
    ],
    images: [
      img('1608748010899-18f300247112', 1400),
      img('1621190595987-0d5f9b449233', 1400),
    ],
    featured: true,
    isNew: true,
  },
  {
    id: 'p03',
    slug: 'wide-pleated-trouser',
    name: 'Wide Pleated Trouser',
    subtitle: 'Tropical wool, double-pleat',
    price: 295,
    currency: '€',
    category: 'trousers',
    collection: 'aw-reserve',
    description:
      'High-rise, double-pleated trouser in pressed tropical wool. Full through the leg, gently tapered at the hem.',
    details: [
      '96% virgin wool, 4% elastane',
      'Double front pleats',
      'Hook-and-eye closure',
      'Made in Italy',
    ],
    sizes: ['28', '30', '32', '34', '36'],
    colors: [
      { name: 'Anthracite', hex: '#2F2F2D' },
      { name: 'Sand', hex: '#C7B79A' },
    ],
    images: [
      img('1594633312687-16307288dd64', 1400),
      img('1506629082955-21b7767d54a1', 1400),
    ],
    featured: true,
  },
  {
    id: 'p04',
    slug: 'bias-cut-silk-slip',
    name: 'Bias-Cut Silk Slip',
    subtitle: 'Sandwashed silk, floor-length',
    price: 380,
    currency: '€',
    category: 'dresses',
    collection: 'aw-reserve',
    description:
      'A floor-length bias-cut slip in sandwashed silk. Cowl neckline, thin adjustable straps, and a fluid, weighted fall.',
    details: [
      '100% sandwashed silk',
      'Bias cut',
      'Adjustable straps',
      'Made in France',
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Bone', hex: '#E5DCC7' },
      { name: 'Ink', hex: '#1B1B1B' },
    ],
    images: [
      img('1518570305330-b4e045569e53', 1400),
      img('premium_photo-1661657720305-ec3a988c8763', 1400),
    ],
    featured: true,
  },
  {
    id: 'p05',
    slug: 'structured-linen-blazer',
    name: 'Structured Linen Blazer',
    subtitle: 'Irish linen, half-canvas',
    price: 410,
    currency: '€',
    category: 'outerwear',
    collection: 'spring-reserve',
    description:
      'A half-canvas single-breasted blazer in dry-finish Irish linen. Soft shoulder, notch lapel, and patch pockets.',
    details: [
      '100% Irish linen',
      'Half-canvas construction',
      'Patch pockets',
      'Made in Portugal',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Ecru', hex: '#E8E0D3' },
      { name: 'Coal', hex: '#232323' },
    ],
    images: [
      img('1485231183945-8c42f0d6e7a1', 1400),
      img('1515882315439-5a6cbf8b7c8c', 1400),
    ],
    featured: true,
  },
  {
    id: 'p06',
    slug: 'merino-roll-neck',
    name: 'Merino Roll Neck',
    subtitle: 'Extra-fine, second-skin',
    price: 180,
    currency: '€',
    category: 'knitwear',
    collection: 'spring-reserve',
    description:
      'A long-sleeve roll neck in extra-fine 18.5-micron merino. Slim through the body, layered or alone.',
    details: [
      '100% extra-fine merino',
      '18.5 micron',
      'Fully fashioned',
      'Made in Italy',
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Ivory', hex: '#EDE5D3' },
      { name: 'Slate', hex: '#444444' },
    ],
    images: [
      img('1434389677669-e08b4cac3105', 1400),
      img('1758537698215-af1e35acb911', 1400),
    ],
    featured: true,
  },
  {
    id: 'p07',
    slug: 'cotton-twill-chino',
    name: 'Cotton Twill Chino',
    subtitle: 'Garment-dyed, straight-leg',
    price: 220,
    currency: '€',
    category: 'trousers',
    collection: 'spring-reserve',
    description:
      'A straight-leg chino in 8-oz garment-dyed cotton twill. Mid-rise, slanted front pockets, clean unbroken hem.',
    details: [
      '8-oz cotton twill',
      'Garment-dyed',
      'Slanted front pockets',
      'Made in Portugal',
    ],
    sizes: ['28', '30', '32', '34', '36'],
    colors: [
      { name: 'Faded Olive', hex: '#6A6F4D' },
      { name: 'Washed Black', hex: '#2C2C2C' },
    ],
    images: [
      img('1594631252845-29fc4cc8cde9', 1400),
      img('1507680434567-5739c80be1e1', 1400),
    ],
    featured: true,
  },
  {
    id: 'p08',
    slug: 'wrap-wool-dress',
    name: 'Wrap Wool Dress',
    subtitle: 'Crispa crepe, ankle-length',
    price: 440,
    currency: '€',
    category: 'dresses',
    collection: 'spring-reserve',
    description:
      'An ankle-length wrap dress in matte Crispa crepe. Soft collar, self-tie waist, and a deep inverted pleat.',
    details: [
      'Crispa crepe, 96% wool',
      'Self-tie waist',
      'Inverted centre pleat',
      'Made in Italy',
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Clay', hex: '#A4715A' },
      { name: 'Black', hex: '#0E0E0E' },
    ],
    images: [
      img('1485968579580-b6d095142e6f', 1400),
      img('1496747613729-02e3241d429f', 1400),
    ],
    featured: true,
  },
  {
    id: 'p09',
    slug: 'leather-shoulder-bag',
    name: 'Leather Shoulder Bag',
    subtitle: 'Vegetable-tanned, structured',
    price: 510,
    currency: '€',
    category: 'accessories',
    collection: 'aw-reserve',
    description:
      'A structured shoulder bag in vegetable-tanned bovine leather. Magnetic flap, single interior pocket, brass hardware.',
    details: [
      'Vegetable-tanned bovine leather',
      'Brass hardware',
      'Suede lining',
      'Made in Italy',
    ],
    sizes: ['One size'],
    colors: [
      { name: 'Tan', hex: '#9B6E3F' },
      { name: 'Black', hex: '#0E0E0E' },
    ],
    images: [
      img('1547949003-97960816d757', 1400),
      img('1590874103328-eac38a683ce7', 1400),
    ],
    featured: true,
    isNew: true,
  },
  {
    id: 'p10',
    slug: 'cashmere-scarf',
    name: 'Cashmere Scarf',
    subtitle: 'Fringed, double-ply',
    price: 165,
    currency: '€',
    category: 'accessories',
    collection: 'aw-reserve',
    description:
      'A double-ply cashmere scarf with hand-knotted fringe. Generous proportions, woven on traditional looms.',
    details: [
      '100% cashmere',
      'Double-ply',
      'Hand-knotted fringe',
      'Made in Scotland',
    ],
    sizes: ['One size'],
    colors: [
      { name: 'Oat', hex: '#D9CDB6' },
      { name: 'Graphite', hex: '#3A3A3A' },
    ],
    images: [
      img('1523779105320-d1cd346ff52b', 1400),
      img('1601758228045-3c1a6c43c9b0', 1400),
    ],
    featured: true,
  },
  {
    id: 'p11',
    slug: 'cotton-poplin-shirt',
    name: 'Cotton Poplin Shirt',
    subtitle: 'Tight weave, relaxed fit',
    price: 195,
    currency: '€',
    category: 'outerwear',
    collection: 'spring-reserve',
    description:
      'A relaxed-fit shirt in dense cotton poplin. Soft camp collar, mother-of-pearl buttons, curved hem.',
    details: [
      '100% cotton poplin',
      'Mother-of-pearl buttons',
      'Camp collar',
      'Made in Portugal',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Optic White', hex: '#F4F1EA' },
      { name: 'Sky', hex: '#9FB3C8' },
    ],
    images: [
      img('1483985988355-763728e1935b', 1400),
      img('1445205170230-053b83016050', 1400),
    ],
    featured: true,
  },
  {
    id: 'p12',
    slug: 'ribbed-cotton-sock',
    name: 'Ribbed Cotton Sock',
    subtitle: 'Long-staple, ribbed',
    price: 35,
    currency: '€',
    category: 'accessories',
    collection: 'spring-reserve',
    description:
      'A mid-calf ribbed sock in long-staple Egyptian cotton. Reinforced heel and toe, seamless toe closure.',
    details: [
      '88% Egyptian cotton',
      '10% polyamide, 2% elastane',
      'Seamless toe',
      'Made in Italy',
    ],
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Bone', hex: '#E5DCC7' },
      { name: 'Soot', hex: '#2A2A2A' },
    ],
    images: [
      img('1469334031218-e382a71b716b', 1400),
      img('1539109136881-3be0616acf4b', 1400),
    ],
    featured: true,
  },
]

export const featured = products.filter((p) => p.featured)
export const newArrivals = products.filter((p) => p.isNew)

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug)
}

export function getByCategory(category: string) {
  if (category === 'new') return newArrivals
  return products.filter((p) => p.category === category)
}

export function getRelated(slug: string, limit = 4) {
  const p = getProduct(slug)
  if (!p) return featured.slice(0, limit)
  return products.filter((x) => x.slug !== slug && x.category === p.category).slice(0, limit)
}
