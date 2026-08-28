import { useEffect, useState } from 'react'
import { INTRO_HERO_PLAY_EVENT } from '../components/ui/Loader'

/**
 * Tracks the initial-load intro (full-screen Loader) lifecycle.
 *
 * - On the FIRST full page load the Loader is mounted and dispatches
 *   `saif:intro-hero-play` the moment its curtain begins to lift.
 * - On client-side navigation (back to "/") there is no Loader, so the
 *   hook reports ready immediately.
 * - A safety timeout guarantees the Hero never gets stuck waiting if the
 *   Loader/its event is absent for any reason.
 *
 * The flag lives at MODULE scope (not sessionStorage): it stays true across
 * SPA navigation in the same JS context, but resets on a hard page reload —
 * where the Loader is always mounted again and its event should be awaited.
 */
let introPlayed = false

export function useIntroHeroPlay(): boolean {
  const [ready, setReady] = useState(introPlayed)

  useEffect(() => {
    if (introPlayed) {
      setReady(true)
      return
    }

    let done = false
    const complete = () => {
      if (done) return
      done = true
      introPlayed = true
      setReady(true)
    }

    const onPlay = () => complete()
    window.addEventListener(INTRO_HERO_PLAY_EVENT, onPlay, { once: true })

    // Safety net: never wait on the intro indefinitely.
    const safety = window.setTimeout(complete, 4500)

    return () => {
      window.removeEventListener(INTRO_HERO_PLAY_EVENT, onPlay)
      window.clearTimeout(safety)
    }
  }, [])

  return ready
}
