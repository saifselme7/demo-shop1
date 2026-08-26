import { LocalizedString } from './products'

export interface Collection {
  slug: string
  title: LocalizedString
  subtitle: LocalizedString
  description: LocalizedString
  image: string
  pieces: number
}

const img = (id: string, w = 1600) => {
  const full = id.startsWith('photo-') || id.startsWith('premium_photo-') ? id : `photo-${id}`
  return `https://images.unsplash.com/${full}?auto=format&fit=crop&w=${w}&q=80`
}

export const collections: Collection[] = [
  {
    slug: 'aw-reserve',
    title: { en: 'AW — Reserve', ar: 'خريف وشتا — تشكيلة خاصة' },
    subtitle: { en: 'Cold-weather essentials', ar: 'أساسيات الجو البارد' },
    description: {
      en: 'Brushed wools, cashmere, and structured outerwear. The considered cold-weather wardrobe.',
      ar: 'صوف ممشط، كشمير، وملابس خارجية بقصة مظبوطة. دولاب الشتا معمول بحساب.',
    },
    image: img('premium_photo-1723651300444-c663962dcb92b', 1800),
    pieces: 24,
  },
  {
    slug: 'spring-reserve',
    title: { en: 'Spring — Reserve', ar: 'ربيع — تشكيلة خاصة' },
    subtitle: { en: 'Linen, poplin and silk', ar: 'كتان وبوبلين وحرير' },
    description: {
      en: 'Lightweight tailoring in Irish linen, sandwashed silk, and crisp cotton poplin.',
      ar: 'تفصيل خفيف من كتان إيرلندي وحرير مغسول وقطن بوبلين ناشف.',
    },
    image: img('premium_photo-1664300166849-dc66a719ee0f', 1800),
    pieces: 18,
  },
  {
    slug: 'atelier-archive',
    title: { en: 'Atelier — Archive', ar: 'الاستوديو — الأرشيف' },
    subtitle: { en: 'Foundational pieces', ar: 'قطع أساسية' },
    description: {
      en: 'A studied archive of foundational pieces — patterns refined, never replaced.',
      ar: 'أرشيف مدروس من القطع الأساسية — القصات بتتطور، مش بتتغير.',
    },
    image: img('premium_photo-1663045469848-7df171d1fe04', 1800),
    pieces: 12,
  },
]
