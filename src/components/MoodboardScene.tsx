import { useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { moodboard } from '../content/site'
import { GiantType, SceneIndex, Sticker } from './kit'

/**
 * Moodboard — a pinned, draggable collage.
 *
 * Eight pieces scattered on a dark field with deliberate overlap and rotation.
 * Each drifts at a different rate as you scroll, and pointer movement shifts the
 * whole board in parallax, so it behaves like paper pinned to a wall.
 */
export default function MoodboardScene() {
  const ref = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const reduced = useReducedMotion()

  const onMove = (event: React.PointerEvent) => {
    if (reduced) return
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    setTilt({ x, y })
  }

  /* fixed scatter so the composition is art-directed, never random at runtime */
  const layout = [
    { top: '6%', left: '4%', w: 26, rot: -5, depth: 22 },
    { top: '2%', left: '34%', w: 20, rot: 3, depth: 34 },
    { top: '10%', left: '58%', w: 30, rot: -3, depth: 16 },
    { top: '44%', left: '2%', w: 22, rot: 5, depth: 40 },
    { top: '52%', left: '26%', w: 26, rot: -7, depth: 24 },
    { top: '40%', left: '54%', w: 18, rot: 6, depth: 46 },
    { top: '68%', left: '72%', w: 22, rot: -4, depth: 30 },
    { top: '74%', left: '38%', w: 20, rot: 8, depth: 20 },
  ]

  return (
    <section
      id="moodboard"
      data-scene="moodboard"
      aria-label="Creative moodboard"
      ref={ref}
      className="scene relative overflow-hidden"
    >
      <div className="relative mx-auto max-w-[1600px] px-5 py-16 md:px-10 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SceneIndex n="07" title="Moodboard" />
            <GiantType as="h2" className="mt-8 text-[clamp(2.3rem,7vw,6rem)] uppercase">
              WHAT INSPIRES
              <br />
              THE <span className="text-punch">WORK.</span>
            </GiantType>
          </div>
          <Sticker color="bg-punch" text="text-cream" rotate={4}>
            Move your cursor
          </Sticker>
        </div>

        {/* the collage */}
        <div
          onPointerMove={onMove}
          onPointerLeave={() => setTilt({ x: 0, y: 0 })}
          className="relative mt-10 h-[74vh] min-h-[520px] w-full"
        >
          {moodboard.map((piece, index) => {
            const spot = layout[index % layout.length]
            const shift = {
              transform: `translate3d(${tilt.x * spot.depth}px, ${tilt.y * spot.depth}px, 0) rotate(${spot.rot}deg)`,
              transition: 'transform 600ms cubic-bezier(0.22,1,0.36,1)',
              top: spot.top,
              left: spot.left,
              width: `${spot.w}%`,
            }

            return (
              <motion.figure
                key={piece.id}
                style={shift}
                initial={reduced ? undefined : { opacity: 0, y: 40 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.8, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="absolute border-[2px] border-cream/85 bg-ink shadow-[7px_7px_0_rgba(0,0,0,0.55)]"
              >
                {piece.kind === 'photo' && 'src' in piece && (
                  <img
                    src={piece.src}
                    alt={piece.caption}
                    loading="lazy"
                    className="block aspect-square w-full object-cover"
                  />
                )}
                {piece.kind === 'colour' && 'hex' in piece && (
                  <div className="grid aspect-square w-full place-items-end p-2" style={{ backgroundColor: piece.hex }}>
                    <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-ink">
                      {piece.hex}
                    </span>
                  </div>
                )}
                {piece.kind === 'type' && 'text' in piece && (
                  <div className="grid aspect-square w-full place-items-center bg-punch">
                    <span className="font-display text-[clamp(2.4rem,6vw,5rem)] font-bold leading-none text-ink">
                      {piece.text}
                    </span>
                  </div>
                )}
                <figcaption className="absolute -bottom-5 left-0 font-mono text-[8px] uppercase tracking-[0.18em] opacity-50">
                  {piece.caption}
                </figcaption>
              </motion.figure>
            )
          })}
        </div>
      </div>
    </section>
  )
}
