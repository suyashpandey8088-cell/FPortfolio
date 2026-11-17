import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star } from './kit'

/**
 * Preloader — a brief, loud title card rather than a spinner.
 *
 * It runs on a fixed clock (not on asset loading) so it can never hang, and it
 * exits by sliding a stack of colour bands off the screen, which is the first
 * beat of the site's language.
 */
export default function Preloader({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const total = reduced ? 500 : 1750
    const started = performance.now()
    let raf = 0

    const tick = (now: number) => {
      const t = Math.min(1, (now - started) / total)
      // ease-out so the number accelerates then settles
      setCount(Math.round((1 - Math.pow(1 - t, 2.4)) * 100))
      if (t < 1) raf = requestAnimationFrame(tick)
      else {
        setGone(true)
        window.setTimeout(onDone, reduced ? 0 : 720)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onDone])

  const bands = ['bg-flash', 'bg-punch', 'bg-acid', 'bg-cobalt']

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          className="fixed inset-0 z-[300] overflow-hidden bg-ink text-cream"
          exit={{ opacity: 1 }}
        >
          {/* stacked colour bands that sweep away on exit */}
          <motion.div className="absolute inset-0 flex" exit={{ y: '-100%' }} transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}>
            {bands.map((band, i) => (
              <motion.div
                key={band}
                className={`h-full flex-1 ${band}`}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 0.14 }}
                exit={{ scaleY: 1 }}
                transition={{ duration: 0.55, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: 'bottom' }}
              />
            ))}
          </motion.div>

          <div className="relative flex h-full flex-col justify-between p-6 md:p-10">
            <div className="flex items-start justify-between">
              <span className="font-mono text-[9px] uppercase tracking-[0.32em] opacity-70">
                Deleena V. — Portfolio
              </span>
              <Star size={22} className="text-cream animate-spin-slow" />
            </div>

            <div className="max-w-[24ch]">
              <motion.h1
                className="font-display text-[clamp(2.4rem,7vw,5.4rem)] font-bold leading-[0.86] tracking-tightest"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                ENTERING DELEENA&rsquo;S CREATIVE WORLD.
              </motion.h1>
            </div>

            <div className="flex items-end justify-between gap-6">
              <div className="flex w-full max-w-[280px] flex-col gap-2">
                <div className="h-[2px] w-full bg-cream/20">
                  <div
                    className="h-full bg-cream transition-[width] duration-150"
                    style={{ width: `${count}%` }}
                  />
                </div>
                <span className="font-mono text-[9px] uppercase tracking-[0.3em] opacity-60">
                  Loading assets
                </span>
              </div>
              <span className="font-display text-[clamp(3rem,10vw,7rem)] font-bold leading-none tabular-nums">
                {String(count).padStart(3, '0')}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
