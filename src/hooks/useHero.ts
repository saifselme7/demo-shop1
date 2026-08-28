import { useEffect, useState } from 'react'
import { HeroContent, getActiveHero } from '../services/hero'

// Module-level cache: the active hero rarely changes. Caching the promise
// means navigating back to Home re-renders the Hero with its real content
// immediately instead of passing through a loading state (which delayed the
// entrance animation and left a static/frozen hero until the user scrolled).
let cachedHero: HeroContent | null = null
let inflight: Promise<HeroContent | null> | null = null

function fetchHero(): Promise<HeroContent | null> {
  if (cachedHero) return Promise.resolve(cachedHero)
  if (!inflight) {
    inflight = getActiveHero()
      .then((data) => {
        cachedHero = data
        return data
      })
      .catch((err) => {
        inflight = null
        throw err
      })
  }
  return inflight
}

export function useHero() {
  const [hero, setHero] = useState<HeroContent | null>(cachedHero)
  const [loading, setLoading] = useState(!cachedHero)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    fetchHero()
      .then((data) => {
        if (mounted) {
          setHero(data)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err.message)
          setLoading(false)
        }
      })
    return () => { mounted = false }
  }, [])

  return { hero, loading, error }
}
