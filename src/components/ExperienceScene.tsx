import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from 'framer-motion'
import { experience } from '../content/site'
import { GiantType, SceneIndex, Star } from './kit'

/**
 * Experience — a drawn timeline rather than a résumé table.
 *
 * A single vertical rule draws itself as you scroll (scaleY driven by scroll
 * progress), the two roles alternate sides, and each responsibility is set as a
 * numbered stamp so the section reads as a designed object, not a CV.
 */
export default function ExperienceScene() {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.6'] })
  const drawn = useSpring(scrollYProgress, { stiffness: 90, damping: 24, restDelta: 0.001 })
  const scaleY = useTransform(drawn, [0, 1], [0, 1])

  return (
    <section
      id="experience"
      data-scene="experience"
      aria-label="Experience"
      ref={ref}
      className="scene relative overflow-hidden"
    >
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SceneIndex n="05" title="The creative journey" />
            <GiantType as="h2" className="mt-8 text-[clamp(2.3rem,7vw,6rem)] uppercase">
              EVERY PROJECT
              <br />
              LEAVES A <span className="text-blood">MARK.</span>
            </GiantType>
          </div>
          <Star size={44} className="text-blood animate-spin-slow" />
        </div>

        {/* timeline */}
        <div className="relative mt-14 md:mt-20">
          {/* the rule */}
          <div className="absolute left-[7px] top-0 h-full w-[2px] bg-ink/15 md:left-1/2 md:-translate-x-1/2" />
          <motion.div
            style={reduced ? { scaleY: 1 } : { scaleY }}
            className="absolute left-[7px] top-0 h-full w-[2px] origin-top bg-blood md:left-1/2 md:-translate-x-1/2"
          />

          <div className="flex flex-col gap-12 md:gap-20">
            {experience.map((role, index) => {
              const right = index % 2 === 1
              return (
                <div
                  key={role.id}
                  className={`relative pl-8 md:w-1/2 md:pl-0 ${
                    right ? 'md:ml-auto md:pl-12' : 'md:pr-12 md:text-right'
                  }`}
                >
                  {/* node */}
                  <span
                    className={`absolute top-2 grid h-4 w-4 place-items-center rounded-full border-2 border-blood bg-paper ${
                      right ? 'left-0 md:-left-[8px]' : 'left-0 md:-right-[8px] md:left-auto'
                    }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-blood" />
                  </span>

                  <motion.div
                    initial={reduced ? undefined : { opacity: 0, y: 26 }}
                    whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-12%' }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <p className="font-mono text-[9px] uppercase tracking-[0.26em] opacity-55">
                      {role.kind} · {role.period}
                    </p>
                    <h3 className="mt-2 font-display text-[clamp(1.5rem,3.6vw,2.6rem)] font-bold uppercase leading-[0.95] tracking-tighter2">
                      {role.title}
                    </h3>

                    <ul
                      className={`mt-5 flex flex-col gap-1.5 ${right ? '' : 'md:items-end'}`}
                    >
                      {role.points.map((point, pointIndex) => (
                        <li
                          key={point}
                          className={`flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.14em] opacity-75 ${
                            right ? '' : 'md:flex-row-reverse'
                          }`}
                        >
                          <span className="text-blood">{String(pointIndex + 1).padStart(2, '0')}</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="h-3 w-full bg-blood" />
    </section>
  )
}
