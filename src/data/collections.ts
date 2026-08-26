export interface Collection {
  slug: string
  title: string
  subtitle: string
  description: string
  image: string
  pieces: number
}

const img = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

export const collections: Collection[] = [
  {
    slug: 'aw-reserve',
    title: 'AW — Reserve',
    subtitle: 'Cold-weather essentials',
    description:
      'Brushed wools, cashmere, and structured outerwear. The considered cold-weather wardrobe.',
    image: img('1490481651871-ab68de25d43e', 1800),
    pieces: 24,
  },
  {
    slug: 'spring-reserve',
    title: 'Spring — Reserve',
    subtitle: 'Linen, poplin and silk',
    description:
      'Lightweight tailoring in Irish linen, sandwashed silk, and crisp cotton poplin.',
    image: img('1485231183945-8c42f0d6e7a1', 1800),
    pieces: 18,
  },
  {
    slug: 'atelier-archive',
    title: 'Atelier — Archive',
    subtitle: 'Foundational pieces',
    description:
      'A studied archive of foundational pieces — patterns refined, never replaced.',
    image: img('1483985988355-763728e1935b', 1800),
    pieces: 12,
  },
]
