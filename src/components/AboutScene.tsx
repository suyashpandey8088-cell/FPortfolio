import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import { about, identity } from '../content/site'
import { GiantType, RevealFrame, SceneIndex, Star, Sticker } from './kit'

/**
 * About — a cream editorial spread.
 *
 * This is the one light scene in the first half: wide margins, a serif voice,
 * a portrait plate that overlaps the headline, and the CV facts set as
 * marginalia rather than a résumé table.
 */
export default function AboutScene() {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const plate = useTransform(scrollYProgress, [0, 1], reduced ? ['0%', '0%'] : ['-8%', '8%'])

  return (
    <section
      id="about"
      data-scene="about"
      aria-label="About Deleena"
      ref={ref}
      className="scene relative overflow-hidden"
    >
      <div className="mx-auto max-w-[1500px] px-5 py-16 md:px-10 md:py-24">
        <SceneIndex n="01" title="The creative mind" />

        {/* headline + portrait plate, deliberately overlapping */}
        <div className="relative mt-8">
          <GiantType as="h2" className="text-[clamp(2.8rem,9.5vw,9rem)] uppercase">
            NOT BUILT
            <br />
            TO <span className="font-sherif italic lowercase tracking-normal">blend</span> IN.
          </GiantType>

          <motion.figure
            style={{ y: plate }}
            className="absolute -right-2 top-[6%] w-[34vw] max-w-[260px] md:-right-6 md:top-[-6%] md:w-[22vw]"
          >
            <RevealFrame>
              <div className="border-[3px] border-ink bg-paper shadow-[9px_9px_0_#FF2E93]">
                <img
                  src="/media/art-05.jpg"
                  alt="Sculptural textile and liquid-metal study in warm light"
                  className="block aspect-[4/5] w-full object-cover"
                  loading="lazy"
                />
              </div>
            </RevealFrame>
            <figcaption className="mt-2 font-mono text-[8px] uppercase tracking-[0.22em] opacity-60">
              Studio texture study — 2025
            </figcaption>
          </motion.figure>

          <div className="mt-6 max-w-[46ch] md:mt-10">
            <p className="font-sherif text-[clamp(1.15rem,2.3vw,1.7rem)] leading-[1.35]">
              {about.lead}
            </p>
          </div>
        </div>

        {/* the body + marginalia grid — asymmetric on purpose */}
        <div className="mt-14 grid gap-10 md:mt-20 md:grid-cols-12">
          <div className="md:col-span-6 md:col-start-2">
            <p className="text-[clamp(0.95rem,1.35vw,1.08rem)] leading-[1.75] opacity-85">{about.body}</p>

            <div className="mt-8 flex flex-wrap gap-2">
              {about.interests.map((interest) => (
                <span
                  key={interest}
                  className="border border-ink/25 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em]"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* education plate, set like a caption block */}
          <aside className="relative md:col-span-4 md:col-start-9">
            <div className="border-t-2 border-ink pt-3">
              <p className="font-mono text-[9px] uppercase tracking-[0.26em] opacity-55">
                Education
              </p>
              <p className="mt-2 font-display text-[clamp(1.1rem,1.9vw,1.5rem)] font-bold leading-tight">
                {about.education.degree}
              </p>
              <p className="mt-1 text-[0.9rem] opacity-70">{about.education.school}</p>
              <p className="mt-3 font-sherif text-[0.95rem] italic opacity-65">
                {about.education.note}
              </p>
            </div>

            <div className="mt-8 border-t-2 border-ink pt-3">
              <p className="font-mono text-[9px] uppercase tracking-[0.26em] opacity-55">
                Based
              </p>
              <p className="mt-2 font-display text-[1.1rem] font-bold">{identity.location}</p>
            </div>

            <Star size={54} className="mt-8 text-punch animate-spin-slow" />
            <Sticker color="bg-ink" text="text-paper" rotate={-6} className="mt-4">
              Systems thinker · self-directed
            </Sticker>
          </aside>
        </div>
      </div>

      {/* cream scene ends with a hard colour band into the next identity */}
      <div className="h-3 w-full bg-flash" />
    </section>
  )
}
