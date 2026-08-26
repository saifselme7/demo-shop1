export interface LocalizedString {
  en: string
  ar: string
}

export interface LocalizedArray {
  en: string[]
  ar: string[]
}

export interface Product {
  id: string
  slug: string
  name: LocalizedString
  subtitle: LocalizedString
  price: number
  currency: string
  category: string
  collection: string
  description: LocalizedString
  details: LocalizedArray
  sizes: string[]
  colors: { name: string; hex: string; label: LocalizedString }[]
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
    name: { en: 'Oversized Wool Coat', ar: 'معطف صوف واسع' },
    subtitle: { en: 'Brushed merino, mid-length', ar: 'صوف ميرينو ممشط، طول متوسط' },
    price: 685,
    currency: '€',
    category: 'outerwear',
    collection: 'aw-reserve',
    description: {
      en: 'A loose, architectural coat cut from brushed merino. Raglan sleeves, concealed placket, and a weighted hem that falls without resistance.',
      ar: 'معطف بقصة واسعة معمولة من صوف ميرينو ممشط. أكمام رجلان، مردة مخفية، وذيل تقيل بينزل بانسيابية.',
    },
    details: {
      en: [
        '100% Italian merino wool',
        'Concealed horn-button placket',
        'Bemberg cupro lining',
        'Made in Portugal',
      ],
      ar: [
        '١٠٠٪ صوف ميرينو إيطالي',
        'مردة بأزرار قرن مخفية',
        'بطانة كوبرا بيمبرج',
        'صناعة برتغالي',
      ],
    },
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Charcoal', hex: '#3A3A38', label: { en: 'Charcoal', ar: 'فحمي' } },
      { name: 'Camel', hex: '#A88B66', label: { en: 'Camel', ar: 'جملي' } },
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
    name: { en: 'Cashmere Mock Neck', ar: 'بلوفر كشمير برقبة عالية' },
    subtitle: { en: '8-gauge, undyed fibre', ar: 'تريكو ٨ جيدج، ألياف طبيعية' },
    price: 320,
    currency: '€',
    category: 'knitwear',
    collection: 'aw-reserve',
    description: {
      en: 'A relaxed mock-neck pullover knitted from undyed Mongolian cashmere. Boxy through the body, with a ribbed funnel collar.',
      ar: 'بلوفر برقبة عالية معمول من كشمير منغولي طبيعي من غير صبغة. قصة واسعة ومريحة مع ياقة مضلعة.',
    },
    details: {
      en: [
        '100% grade-A Mongolian cashmere',
        '8-gauge plain knit',
        'Ribbed funnel collar and cuffs',
        'Made in Scotland',
      ],
      ar: [
        '١٠٠٪ كشمير منغولي درجة أولى',
        'تريكو سادة ٨ جيدج',
        'ياقة وأساور مضلعة',
        'صناعة اسكتلندي',
      ],
    },
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Oat', hex: '#D9CDB6', label: { en: 'Oat', ar: 'شوفان' } },
      { name: 'Stone', hex: '#A39782', label: { en: 'Stone', ar: 'حجري' } },
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
    name: { en: 'Wide Pleated Trouser', ar: 'بنطلون واسع بكسرات' },
    subtitle: { en: 'Tropical wool, double-pleat', ar: 'صوف استوائي، كسرتين' },
    price: 295,
    currency: '€',
    category: 'trousers',
    collection: 'aw-reserve',
    description: {
      en: 'High-rise, double-pleated trouser in pressed tropical wool. Full through the leg, gently tapered at the hem.',
      ar: 'بنطلون بوسط عالي وكسرتين معمول من صوف استوائي مكوي. واسع من فوق ونازل بضيق خفيف عند الرجل.',
    },
    details: {
      en: [
        '96% virgin wool, 4% elastane',
        'Double front pleats',
        'Hook-and-eye closure',
        'Made in Italy',
      ],
      ar: [
        '٩٦٪ صوف بكر، ٤٪ إيلاستين',
        'كسرتين قدام',
        'قفلة خطاف',
        'صناعة إيطالي',
      ],
    },
    sizes: ['28', '30', '32', '34', '36'],
    colors: [
      { name: 'Anthracite', hex: '#2F2F2D', label: { en: 'Anthracite', ar: 'أنثراسيت' } },
      { name: 'Sand', hex: '#C7B79A', label: { en: 'Sand', ar: 'رملي' } },
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
    name: { en: 'Bias-Cut Silk Slip', ar: 'فستان حرير بقصة مايلة' },
    subtitle: { en: 'Sandwashed silk, floor-length', ar: 'حرير مغسول، طويل لحد الأرض' },
    price: 380,
    currency: '€',
    category: 'dresses',
    collection: 'aw-reserve',
    description: {
      en: 'A floor-length bias-cut slip in sandwashed silk. Cowl neckline, thin adjustable straps, and a fluid, weighted fall.',
      ar: 'فستان حرير طويل بقصة مايلة معمول من حرير مغسول. ياقة منسدلة وحمالات رفيعة بتتظبط ونزلة انسيابية وتقيلة.',
    },
    details: {
      en: [
        '100% sandwashed silk',
        'Bias cut',
        'Adjustable straps',
        'Made in France',
      ],
      ar: [
        '١٠٠٪ حرير مغسول',
        'قصة مايلة',
        'حمالات بتتظبط',
        'صناعة فرنساوي',
      ],
    },
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Bone', hex: '#E5DCC7', label: { en: 'Bone', ar: 'عظمي' } },
      { name: 'Ink', hex: '#1B1B1B', label: { en: 'Ink', ar: 'حبر' } },
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
    name: { en: 'Structured Linen Blazer', ar: 'بليزر كتان بقصة مظبوطة' },
    subtitle: { en: 'Irish linen, half-canvas', ar: 'كتان إيرلندي، نص مبطن' },
    price: 410,
    currency: '€',
    category: 'outerwear',
    collection: 'spring-reserve',
    description: {
      en: 'A half-canvas single-breasted blazer in dry-finish Irish linen. Soft shoulder, notch lapel, and patch pockets.',
      ar: 'بليزر بزرار واحد معمول من كتان إيرلندي ناشف. كتف ناعم وياقة مقصوصة وجيوب خارجية.',
    },
    details: {
      en: [
        '100% Irish linen',
        'Half-canvas construction',
        'Patch pockets',
        'Made in Portugal',
      ],
      ar: [
        '١٠٠٪ كتان إيرلندي',
        'نص مبطن',
        'جيوب خارجية',
        'صناعة برتغالي',
      ],
    },
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Ecru', hex: '#E8E0D3', label: { en: 'Ecru', ar: 'أوف وايت' } },
      { name: 'Coal', hex: '#232323', label: { en: 'Coal', ar: 'فحم' } },
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
    name: { en: 'Merino Roll Neck', ar: 'بلوفر ميرينو برقبة عالية' },
    subtitle: { en: 'Extra-fine, second-skin', ar: 'ميرينو ناعم جدًا، زي تاني جلد' },
    price: 180,
    currency: '€',
    category: 'knitwear',
    collection: 'spring-reserve',
    description: {
      en: 'A long-sleeve roll neck in extra-fine 18.5-micron merino. Slim through the body, layered or alone.',
      ar: 'بلوفر بكم طويل ورقبة عالية من ميرينو ١٨.٥ ميكرون ناعم جدًا. مظبوط على الجسم، يتلبس لوحده أو تحت حاجة.',
    },
    details: {
      en: [
        '100% extra-fine merino',
        '18.5 micron',
        'Fully fashioned',
        'Made in Italy',
      ],
      ar: [
        '١٠٠٪ ميرينو ناعم جدًا',
        '١٨.٥ ميكرون',
        'تفصيل كامل',
        'صناعة إيطالي',
      ],
    },
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Ivory', hex: '#EDE5D3', label: { en: 'Ivory', ar: 'عاجي' } },
      { name: 'Slate', hex: '#444444', label: { en: 'Slate', ar: 'رمادي غامق' } },
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
    name: { en: 'Cotton Twill Chino', ar: 'بنطلون شينو قطن' },
    subtitle: { en: 'Garment-dyed, straight-leg', ar: 'مصبوغ بعد التفصيل، قصة مستقيمة' },
    price: 220,
    currency: '€',
    category: 'trousers',
    collection: 'spring-reserve',
    description: {
      en: 'A straight-leg chino in 8-oz garment-dyed cotton twill. Mid-rise, slanted front pockets, clean unbroken hem.',
      ar: 'بنطلون شينو بقصة مستقيمة من قطن تِويل ٨ أونصة مصبوغ بعد التفصيل. وسط متوسط وجيوب مايلة وذيل نضيف.',
    },
    details: {
      en: [
        '8-oz cotton twill',
        'Garment-dyed',
        'Slanted front pockets',
        'Made in Portugal',
      ],
      ar: [
        'قطن تِويل ٨ أونصة',
        'مصبوغ بعد التفصيل',
        'جيوب مايلة قدام',
        'صناعة برتغالي',
      ],
    },
    sizes: ['28', '30', '32', '34', '36'],
    colors: [
      { name: 'Faded Olive', hex: '#6A6F4D', label: { en: 'Faded Olive', ar: 'زيتوني باهت' } },
      { name: 'Washed Black', hex: '#2C2C2C', label: { en: 'Washed Black', ar: 'أسود مغسول' } },
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
    name: { en: 'Wrap Wool Dress', ar: 'فستان صوف ملفوف' },
    subtitle: { en: 'Crispa crepe, ankle-length', ar: 'كريب كريسبا، طول للكاحل' },
    price: 440,
    currency: '€',
    category: 'dresses',
    collection: 'spring-reserve',
    description: {
      en: 'An ankle-length wrap dress in matte Crispa crepe. Soft collar, self-tie waist, and a deep inverted pleat.',
      ar: 'فستان ملفوف طوله للكاحل من كريب كريسبا مطفي. ياقة ناعمة ورباط على الوسط وكسرة عميقة.',
    },
    details: {
      en: [
        'Crispa crepe, 96% wool',
        'Self-tie waist',
        'Inverted centre pleat',
        'Made in Italy',
      ],
      ar: [
        'كريب كريسبا، ٩٦٪ صوف',
        'رباط على الوسط',
        'كسرة مقلوبة في النص',
        'صناعة إيطالي',
      ],
    },
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Clay', hex: '#A4715A', label: { en: 'Clay', ar: 'طيني' } },
      { name: 'Black', hex: '#0E0E0E', label: { en: 'Black', ar: 'أسود' } },
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
    name: { en: 'Leather Shoulder Bag', ar: 'شنطة كتف جلد' },
    subtitle: { en: 'Vegetable-tanned, structured', ar: 'جلد مدبوغ نباتي، بقصة مظبوطة' },
    price: 510,
    currency: '€',
    category: 'accessories',
    collection: 'aw-reserve',
    description: {
      en: 'A structured shoulder bag in vegetable-tanned bovine leather. Magnetic flap, single interior pocket, brass hardware.',
      ar: 'شنطة كتف بقصة مظبوطة من جلد بقري مدبوغ نباتي. قفل مغناطيسي وجيب داخلي واحد وإكسسوارات نحاس.',
    },
    details: {
      en: [
        'Vegetable-tanned bovine leather',
        'Brass hardware',
        'Suede lining',
        'Made in Italy',
      ],
      ar: [
        'جلد بقري مدبوغ نباتي',
        'إكسسوارات نحاس',
        'بطانة شمواه',
        'صناعة إيطالي',
      ],
    },
    sizes: ['One size'],
    colors: [
      { name: 'Tan', hex: '#9B6E3F', label: { en: 'Tan', ar: 'هافان' } },
      { name: 'Black', hex: '#0E0E0E', label: { en: 'Black', ar: 'أسود' } },
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
    name: { en: 'Cashmere Scarf', ar: 'سكارف كشمير' },
    subtitle: { en: 'Fringed, double-ply', ar: 'بشراشيب، طبقتين' },
    price: 165,
    currency: '€',
    category: 'accessories',
    collection: 'aw-reserve',
    description: {
      en: 'A double-ply cashmere scarf with hand-knotted fringe. Generous proportions, woven on traditional looms.',
      ar: 'سكارف كشمير طبقتين بشراشيب معمولة بالإيد. مقاس كبير ومنسوج على نول تقليدي.',
    },
    details: {
      en: [
        '100% cashmere',
        'Double-ply',
        'Hand-knotted fringe',
        'Made in Scotland',
      ],
      ar: [
        '١٠٠٪ كشمير',
        'طبقتين',
        'شراشيب معمولة بالإيد',
        'صناعة اسكتلندي',
      ],
    },
    sizes: ['One size'],
    colors: [
      { name: 'Oat', hex: '#D9CDB6', label: { en: 'Oat', ar: 'شوفان' } },
      { name: 'Graphite', hex: '#3A3A3A', label: { en: 'Graphite', ar: 'جرافيتي' } },
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
    name: { en: 'Cotton Poplin Shirt', ar: 'قميص قطن بوبلين' },
    subtitle: { en: 'Tight weave, relaxed fit', ar: 'نسيج محكم، قصة واسعة' },
    price: 195,
    currency: '€',
    category: 'outerwear',
    collection: 'spring-reserve',
    description: {
      en: 'A relaxed-fit shirt in dense cotton poplin. Soft camp collar, mother-of-pearl buttons, curved hem.',
      ar: 'قميص بقصة واسعة من قطن بوبلين محكم. ياقة كامب ناعمة وأزرار صدف وذيل مقوس.',
    },
    details: {
      en: [
        '100% cotton poplin',
        'Mother-of-pearl buttons',
        'Camp collar',
        'Made in Portugal',
      ],
      ar: [
        '١٠٠٪ قطن بوبلين',
        'أزرار صدف',
        'ياقة كامب',
        'صناعة برتغالي',
      ],
    },
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Optic White', hex: '#F4F1EA', label: { en: 'Optic White', ar: 'أبيض ناصع' } },
      { name: 'Sky', hex: '#9FB3C8', label: { en: 'Sky', ar: 'سماوي' } },
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
    name: { en: 'Ribbed Cotton Sock', ar: 'شراب قطن مضلع' },
    subtitle: { en: 'Long-staple, ribbed', ar: 'قطن طويل التيلة، مضلع' },
    price: 35,
    currency: '€',
    category: 'accessories',
    collection: 'spring-reserve',
    description: {
      en: 'A mid-calf ribbed sock in long-staple Egyptian cotton. Reinforced heel and toe, seamless toe closure.',
      ar: 'شراب مضلع لنص الساق من قطن مصري طويل التيلة. كعب ومقدمة مقويين وقفلة من غير خياطة.',
    },
    details: {
      en: [
        '88% Egyptian cotton',
        '10% polyamide, 2% elastane',
        'Seamless toe',
        'Made in Italy',
      ],
      ar: [
        '٨٨٪ قطن مصري',
        '١٠٪ بولي أميد، ٢٪ إيلاستين',
        'قفلة من غير خياطة',
        'صناعة إيطالي',
      ],
    },
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Bone', hex: '#E5DCC7', label: { en: 'Bone', ar: 'عظمي' } },
      { name: 'Soot', hex: '#2A2A2A', label: { en: 'Soot', ar: 'هباب' } },
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

export function getLocalizedProduct(product: Product, lang: 'en' | 'ar') {
  return {
    ...product,
    localizedName: product.name[lang],
    localizedSubtitle: product.subtitle[lang],
    localizedDescription: product.description[lang],
    localizedDetails: product.details[lang],
    localizedColors: product.colors.map((c) => ({ ...c, localizedLabel: c.label[lang] })),
  }
}
