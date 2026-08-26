import { useState } from 'react'
import MagneticButton from '../components/ui/MagneticButton'
import { Reveal, RevealText } from '../components/ui/Reveal'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  return (
    <section className="py-20 md:py-32 bg-ink text-paper">
      <div className="container-ecru-wide grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <span className="eyebrow text-paper/60 mb-3 block">— Newsletter</span>
          <RevealText
            as="h2"
            text="Quiet dispatches from the atelier."
            className="font-display text-4xl md:text-6xl lg:text-7xl tracking-ultra-tight leading-[0.95] text-paper"
          />
        </div>
        <div className="lg:col-span-5 flex flex-col justify-end">
          <Reveal>
            <p className="mb-8 text-[14px] leading-relaxed text-paper/70">
              Occasional correspondence — new pieces, atelier notes, and short essays on considered
              manufacture. Never frequent, never loud.
            </p>
            {submitted ? (
              <p className="border-b border-paper/30 pb-4 font-serif italic text-lg">
                Thank you. Look for us shortly.
              </p>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (email) setSubmitted(true)
                }}
                className="flex items-center gap-4 border-b border-paper/30 pb-4"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="flex-1 bg-transparent text-[14px] text-paper placeholder:text-paper/40 focus:outline-none"
                  data-cursor="hover"
                />
                <MagneticButton type="submit" variant="ghost" className="text-paper">
                  Subscribe →
                </MagneticButton>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
