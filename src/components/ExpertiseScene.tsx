import { useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { expertise } from '../content/site'
import { GiantType, Marquee, SceneIndex, Star, Sticker } from './kit'

/**
 * Expertise — a cobalt wall of type.
 *
 * No grid of three cards. The ten disciplines are set as a broken typographic
 * list: alternating alignment, mixed faces, each row expanding on hover into a
 * colour block with its note. On touch, tapping a row does the same thing.
 */

const FACE: Record<string, string> = {
  solid: 'font-display font-bold uppercase',
  outline: 'font-display font-bold uppercase outline-type',
  invert: 'font-sherif italic lowercase',
  stripe: 'font-cond uppercase tracking-[0.02em]',
  serif: 'font-sherif italic',
  condensed: 'font-cond uppercase',
}

export default function ExpertiseScene() {
  const [active, setActive] = useState<string | null>(null)
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)

  return (
    <section
      id="expertise"
      data-scene="expertise"
      aria-label="Areas of expertise"
      ref={ref}
      className="scene relative overflow-hidden"
    >
      {/* background: giant watermarked word + rings */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="select-none whitespace-nowrap font-display text-[24vw] font-bold uppercase leading-none text-cream/[0.045]">
          EXPERTISE
        </span>
      </div>
      <div className="pointer-events-none absolute -left-[14%] top-[10%] h-[52vh] w-[52vh] rounded-full bg-acid/20 blur-[110px]" />
      <div className="pointer-events-none absolute -right-[10%] bottom-[6%] h-[42vh] w-[42vh] rounded-full bg-punch/25 blur-[110px]" />

      <div className="relative mx-auto max-w-[1500px] px-5 py-16 md:px-10 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SceneIndex n="02" title="The creative universe" />
            <GiantType as="h2" className="mt-8 text-[clamp(2.6rem,8.5vw,7.6rem)] uppercase">
              TOO MANY
              <br />
              WAYS TO <span className="text-acid">CREATE.</span>
            </GiantType>
          </div>
          <div className="max-w-[30ch] pb-3">
            <p className="font-mono text-[9px] uppercase leading-relaxed tracking-[0.2em] opacity-60">
              Ten disciplines, one obsession: make it worth looking at.
            </p>
            <Star size={30} className="mt-4 text-acid animate-spin-slow" />
          </div>
        </div>

        {/* the type wall */}
        <div className="mt-10 border-t border-cream/25 md:mt-14">
          {expertise.map((skill, index) => {
            const isOpen = active === skill.id
            const alignRight = index % 3 === 1
            return (
              <motion.button
                key={skill.id}
                type="button"
                onMouseEnter={() => setActive(skill.id)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(skill.id)}
                onBlur={() => setActive(null)}
                onClick={() => setActive(isOpen ? null : skill.id)}
                initial={false}
                animate={reduced ? undefined : { backgroundColor: isOpen ? '#C8FF3D' : 'rgba(0,0,0,0)' }}
                transition={{ duration: 0.28 }}
                className={`group relative block w-full border-b border-cream/25 px-1 py-3 text-left md:py-4 ${
                  isOpen ? 'text-ink' : 'text-cream'
                }`}
              >
                <div
                  className={`flex flex-wrap items-baseline gap-x-5 gap-y-1 md:flex-nowrap ${
                    alignRight ? 'md:justify-end md:text-right' : ''
                  }`}
                >
                  <span className="font-mono text-[9px] tracking-[0.24em] opacity-50">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={`${FACE[skill.variant]} text-[clamp(1.5rem,4.6vw,3.4rem)] leading-[0.95] tracking-tighter2`}
                  >
                    {skill.title}
                  </span>
                  <motion.span
                    initial={false}
                    animate={reduced ? undefined : { opacity: isOpen ? 1 : 0, x: isOpen ? 0 : -8 }}
                    transition={{ duration: 0.3 }}
                    className="basis-full font-mono text-[9px] uppercase tracking-[0.18em] opacity-80 md:ml-auto md:basis-auto"
                  >
                    {skill.note}
                  </motion.span>
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>

      <div className="border-y border-cream/25 bg-cobalt py-2 text-cream">
        <Marquee speed="normal">
          <span className="font-display text-[12px] font-bold uppercase tracking-[0.16em]">
            WEBSITE DESIGN ✳ AI VIDEO ✳ POSTER DESIGN ✳ REELS ✳ SOCIAL MEDIA ✳ VIDEO EDITING ✳ STORYTELLING ✳ PHOTOGRAPHY ✳ TYPOGRAPHY ✳ RESEARCH ✳
          </span>
        </Marquee>
      </div>
    </section>
  )
}
