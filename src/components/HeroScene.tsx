import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowDownRight } from 'lucide-react'
import { identity } from '../content/site'
import { GiantType, Marquee, Rings, Star, Sticker, useJumpTo } from './kit'

/**
 * Hero — the impact frame.
 *
 * Composition is deliberately broken: the headline bleeds past the viewport
 * edge, a stack of photo cards sits off-axis, stickers overlap type, and the
 * whole cluster drifts toward the pointer. Nothing is centred.
 */
export default function HeroScene() {
  const ref = useRef<HTMLDivElement>(null)
  const [pointer, setPointer] = useState({ x: 0, y: 0 })
  const reduced = useReducedMotion()
  const jump = useJumpTo()

  useEffect(() => {
    if (reduced) return
    const onMove = (event: PointerEvent) => {
      if (window.matchMedia('(pointer: coarse)').matches) return
      const x = (event.clientX / window.innerWidth - 0.5) * 2
      const y = (event.clientY / window.innerHeight - 0.5) * 2
      setPointer({ x, y })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [reduced])

  const drift = (depth: number) => ({
    transform: `translate3d(${pointer.x * depth}px, ${pointer.y * depth}px, 0)`,
    transition: 'transform 500ms cubic-bezier(0.22,1,0.36,1)',
  })

  return (
    <section
      id="top"
      data-scene="hero"
      aria-label="Introduction"
      ref={ref}
      className="scene relative min-h-[100dvh] overflow-hidden"
    >
      {/* background objects */}
      <div className="pointer-events-none absolute inset-0">
        <Rings
          size={760}
          className="absolute -right-[18%] -top-[12%] text-flash/35 md:-right-[8%]"
        />
        <div className="absolute left-[-6%] top-[38%] h-[38vh] w-[38vh] rounded-full bg-punch/25 blur-[90px]" />
        <Star
          size={120}
          className="absolute right-[12%] top-[58%] hidden text-acid animate-spin-slow md:block"
        />
        <div className="halftone absolute bottom-0 left-0 h-[22vh] w-[46vw] text-cream/20" />
      </div>

      <div className="relative flex min-h-[100dvh] flex-col justify-between px-5 pb-6 pt-6 md:px-10 md:pb-8">
        {/* top rail */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[9px] uppercase tracking-[0.32em] opacity-60">
              {identity.location}
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.32em] opacity-90">
              Portfolio — 2026
            </span>
          </div>
          <div className="hidden flex-col items-end gap-1 sm:flex">
            <span className="font-mono text-[9px] uppercase tracking-[0.26em] opacity-90">
              {identity.roleLine}
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.26em] opacity-50">
              Available for work
            </span>
          </div>
        </div>

        {/* the composition */}
        <div className="relative my-6 flex-1">
          {/* photo stack — off-axis, overlapping, parallaxed */}
          <motion.div
            initial={{ opacity: 0, y: 60, rotate: 14 }}
            animate={{ opacity: 1, y: 0, rotate: 8 }}
            transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-[2%] top-[2%] z-10 w-[38vw] max-w-[300px] md:right-[6%] md:top-0 md:w-[26vw]"
            style={drift(16)}
          >
            <div className="border-[3px] border-cream/90 bg-ink shadow-[10px_10px_0_#FF2E93]">
              <img
                src="/media/art-01.jpg"
                alt="Collage artwork in electric orange, hot pink and acid lime"
                className="block h-full w-full object-cover"
                loading="eager"
              />
            </div>
            <span className="mt-2 block font-mono text-[8px] uppercase tracking-[0.24em] opacity-60">
              Fig. 01 — Collage study
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 80, rotate: -12 }}
            animate={{ opacity: 1, y: 0, rotate: -6 }}
            transition={{ duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-[4%] left-[4%] z-10 hidden w-[20vw] max-w-[220px] md:block"
            style={drift(-22)}
          >
            <div className="border-[3px] border-cream/85 bg-ink shadow-[-10px_10px_0_#C8FF3D]">
              <img
                src="/media/art-06.jpg"
                alt="Overlapping translucent colour study"
                className="block h-full w-full object-cover"
              />
            </div>
          </motion.div>

          {/* headline, set to bleed */}
          <div className="relative z-20 mt-[18vh] md:mt-[14vh]">
            <GiantType
              as="h1"
              className="text-[clamp(3.4rem,13vw,12rem)] uppercase"
            >
              <motion.span
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
                className="block"
              >
                CREATIVITY
              </motion.span>
              <motion.span
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.14 }}
                className="block text-flash"
              >
                DOESN&rsquo;T
              </motion.span>
              <motion.span
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.23 }}
                className="block"
              >
                FOLLOW RULES.
              </motion.span>
            </GiantType>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Sticker color="bg-acid" text="text-ink" rotate={-4}>
                {identity.heroSub}
              </Sticker>
              <Sticker color="bg-ink" text="text-cream" rotate={3} className="border border-cream/40">
                {identity.concept}
              </Sticker>
            </div>
          </div>
        </div>

        {/* bottom rail */}
        <div className="relative z-20 flex items-end justify-between gap-6">
          <button
            type="button"
            onClick={() => jump('about')}
            className="group flex items-center gap-3 text-left"
          >
            <span className="grid h-11 w-11 place-items-center rounded-full border border-cream/40 transition-colors group-hover:bg-cream group-hover:text-ink">
              <ArrowDownRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
            </span>
            <span className="font-mono text-[9px] uppercase leading-relaxed tracking-[0.24em] opacity-70">
              Scroll to
              <br />
              enter
            </span>
          </button>

          <div className="max-w-[34ch] text-right">
            <p className="font-mono text-[9px] uppercase leading-relaxed tracking-[0.2em] opacity-60">
              {identity.roles.join(' · ')}
            </p>
          </div>
        </div>
      </div>

      {/* marquee divider — the seam into the next scene */}
      <div className="relative z-20 border-y border-cream/20 bg-flash py-2 text-ink">
        <Marquee speed="fast">
          <span className="font-display text-[13px] font-bold uppercase tracking-[0.14em]">
            {identity.marquee}
          </span>
        </Marquee>
      </div>
    </section>
  )
}
