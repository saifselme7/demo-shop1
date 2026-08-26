export interface Collection {
  slug: string
  title: string
  subtitle: string
  description: string
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
    title: 'AW — Reserve',
    subtitle: 'Cold-weather essentials',
    description:
      'Brushed wools, cashmere, and structured outerwear. The considered cold-weather wardrobe.',
    image: img('premium_photo-1723651300444-c663962dcb92b', 1800),
    pieces: 24,
  },
  {
    slug: 'spring-reserve',
    title: 'Spring — Reserve',
    subtitle: 'Linen, poplin and silk',
    description:
      'Lightweight tailoring in Irish linen, sandwashed silk, and crisp cotton poplin.',
    image: img('premium_photo-1664300166849-dc66a719ee0f', 1800),
    pieces: 18,
  },
  {
    slug: 'atelier-archive',
    title: 'Atelier — Archive',
    subtitle: 'Foundational pieces',
    description:
      'A studied archive of foundational pieces — patterns refined, never replaced.',
    image: img('premium_photo-1663045469848-7df171d1fe04', 1800),
    pieces: 12,
  },
]
