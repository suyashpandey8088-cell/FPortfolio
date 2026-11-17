import { useState } from 'react'
import { motion } from 'framer-motion'
import { toolkit } from '../content/site'
import { GiantType, Rings, SceneIndex, Star } from './kit'

/**
 * Toolkit — five tools, treated as physical objects rather than logos in boxes.
 *
 * Each is a plate on a dark stage. Hover lifts it and spills its accent colour
 * behind; touch taps to reveal the same. Only software she actually uses is
 * listed — no invented logos.
 */
export default function ToolkitScene() {
  const [active, setActive] = useState<string | null>(null)

  return (
    <section
      id="toolkit"
      data-scene="toolkit"
      aria-label="Creative toolkit"
      className="scene relative overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0">
        <Rings size={620} className="absolute -left-[14%] top-[12%] text-acid/25" />
        <div className="absolute right-0 top-0 h-[40vh] w-[40vw] bg-punch/15 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-[1500px] px-5 py-16 md:px-10 md:py-24">
        <SceneIndex n="06" title="Creative toolkit" />
        <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
          <GiantType as="h2" className="text-[clamp(2.4rem,7.4vw,6.4rem)] uppercase">
            THE <span className="text-acid">TOOLS</span>
            <br />
            BEHIND IT.
          </GiantType>
          <p className="max-w-[28ch] pb-2 font-mono text-[9px] uppercase leading-relaxed tracking-[0.2em] opacity-55">
            Five programs, used daily. Nothing listed that I would not open on a Monday.
          </p>
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {toolkit.map((tool, index) => {
            const isActive = active === tool.id
            return (
              <motion.button
                key={tool.id}
                type="button"
                onMouseEnter={() => setActive(tool.id)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(tool.id)}
                onBlur={() => setActive(null)}
                onClick={() => setActive(isActive ? null : tool.id)}
                initial={false}
                animate={{ y: isActive ? -10 : 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className={`group relative overflow-hidden border border-cream/20 p-4 text-left ${
                  index % 2 === 0 ? 'lg:mt-0' : 'lg:mt-8'
                }`}
              >
                {/* accent spill */}
                <motion.span
                  initial={false}
                  animate={{ scaleY: isActive ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-x-0 bottom-0 h-full origin-bottom bg-acid"
                />

                <span className="relative flex flex-col gap-6">
                  <span className="flex items-start justify-between">
                    <span
                      className={`font-display text-[2.1rem] font-bold leading-none tracking-tighter2 ${
                        isActive ? 'text-ink' : 'text-cream'
                      }`}
                    >
                      {tool.mark}
                    </span>
                    <span
                      className={`font-mono text-[8px] tracking-[0.2em] ${
                        isActive ? 'text-ink/60' : 'text-cream/40'
                      }`}
                    >
                      0{index + 1}
                    </span>
                  </span>
                  <span>
                    <span
                      className={`block font-display text-[0.98rem] font-bold uppercase leading-tight ${
                        isActive ? 'text-ink' : 'text-cream'
                      }`}
                    >
                      {tool.name}
                    </span>
                    <span
                      className={`mt-1 block font-mono text-[8px] uppercase leading-relaxed tracking-[0.14em] ${
                        isActive ? 'text-ink/70' : 'text-cream/45'
                      }`}
                    >
                      {tool.use}
                    </span>
                  </span>
                </span>
              </motion.button>
            )
          })}
        </div>

        <div className="mt-14 flex items-center gap-4 border-t border-cream/20 pt-6">
          <Star size={22} className="text-acid" />
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] opacity-55">
            Skills: website making · AI video · poster design · reels · social management · photography · illustration · typography · trend research
          </p>
        </div>
      </div>
    </section>
  )
}
