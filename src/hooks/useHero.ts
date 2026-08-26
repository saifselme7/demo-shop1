import { useEffect, useState } from 'react'
import { HeroContent, getActiveHero } from '../services/hero'

export function useHero() {
  const [hero, setHero] = useState<HeroContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    getActiveHero()
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
