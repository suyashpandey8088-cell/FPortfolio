import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import { impact } from '../content/site'
import { GiantType, Marquee, SceneIndex, Star } from './kit'

/**
 * Impact — giant numbers, but only the countable ones.
 *
 * Every figure here is derived from what actually exists: two accounts, six
 * portfolio projects, ten disciplines, five tools. No follower counts, no
 * engagement rates, no invented growth. The brief asks for verified
 * achievements only, and this is the honest set.
 */
export default function ImpactScene() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15%' })
  const reduced = useReducedMotion()

  return (
    <section
      id="impact"
      data-scene="impact"
      aria-label="Creative impact"
      ref={ref}
      className="scene relative overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="stripes absolute inset-y-0 right-0 w-[26%] text-ink/15" />
        <Star size={80} className="absolute left-[8%] top-[14%] text-neon animate-spin-slow" />
      </div>

      <div className="relative mx-auto max-w-[1500px] px-5 py-16 md:px-10 md:py-24">
        <SceneIndex n="08" title="Creative impact" />
        <GiantType as="h2" className="mt-8 text-[clamp(2.4rem,7.6vw,6.8rem)] uppercase">
          NOT JUST CREATION.
          <br />
          <span className="outline-type-thick">EXECUTION.</span>
        </GiantType>

        <div className="mt-12 grid gap-px border border-cream/25 bg-cream/25 sm:grid-cols-2 lg:grid-cols-4">
          {impact.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={reduced ? undefined : { opacity: 0, y: 28 }}
              animate={inView && !reduced ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="bg-blood p-5 md:p-6"
            >
              <span className="font-display text-[clamp(3.4rem,9vw,7rem)] font-bold leading-[0.8] tracking-tightest tabular-nums">
                {stat.value}
              </span>
              <p className="mt-4 font-display text-[0.95rem] font-bold uppercase leading-tight tracking-tighter2">
                {stat.label}
              </p>
              <p className="mt-2 font-mono text-[8px] uppercase leading-relaxed tracking-[0.16em] opacity-60">
                {stat.note}
              </p>
            </motion.div>
          ))}
        </div>

        <p className="mt-6 max-w-[62ch] font-mono text-[9px] uppercase leading-relaxed tracking-[0.16em] opacity-55">
          Figures above count work, not reach. No follower or engagement numbers are claimed anywhere
          on this site — none have been independently verified.
        </p>
      </div>

      <div className="border-y border-cream/25 bg-ink py-2 text-cream">
        <Marquee speed="fast">
          <span className="font-display text-[12px] font-bold uppercase tracking-[0.16em]">
            IDEAS ✳ DESIGNS ✳ IMPACT ✳ IDEAS ✳ DESIGNS ✳ IMPACT ✳
          </span>
        </Marquee>
      </div>
    </section>
  )
}
