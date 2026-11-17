import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Editable, SplitLines } from './primitives'
import { useContent } from '../store/content'
import { scrollToId } from '../hooks/useSmoothScroll'

const EASE = [0.22, 1, 0.36, 1] as const

function FloatingTile({
  src,
  label,
  meta,
  className,
  delay,
  rotate,
  accent,
  onClick,
}: {
  src: string
  label: string
  meta: string
  className: string
  delay: number
  rotate: number
  accent: 'gold' | 'signal'
  onClick?: () => void
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 40, rotate: rotate * 2 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{ duration: 1.1, delay, ease: EASE }}
      whileHover={{ rotate: 0, scale: 1.04, zIndex: 20 }}
      className={`group absolute overflow-hidden rounded-[3px] ring-1 ring-white/12 ${className}`}
      aria-label={`Preview ${label}`}
    >
      <img
        src={src}
        alt={label}
        className="h-full w-full object-cover transition-transform duration-[1.4s] ease-swift group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-70 transition-opacity group-hover:opacity-95" />
      <div className="absolute inset-x-0 bottom-0 p-3 text-left">
        <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-white/55">{meta}</p>
        <p className="mt-0.5 text-[11px] font-medium leading-tight text-white">{label}</p>
      </div>
      <span
        className={`absolute right-2 top-2 h-1.5 w-1.5 rounded-full ${
          accent === 'gold' ? 'bg-gold' : 'bg-signal'
        }`}
      />
    </motion.button>
  )
}

export default function Hero({ onOpenAccount }: { onOpenAccount: (id: string) => void }) {
  const { content, editing } = useContent()
  const [mounted, setMounted] = useState(false)
  const [pointer, setPointer] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setMounted(true)
  }, [])

  const padma = content.accounts[0]
  const combat = content.accounts[1]

  return (
    <section
      id="top"
      className="relative min-h-[100svh] w-full overflow-hidden border-b border-white/10"
      onPointerMove={(event) => {
        const { innerWidth, innerHeight } = window
        setPointer({ x: event.clientX / innerWidth - 0.5, y: event.clientY / innerHeight - 0.5 })
      }}
    >
      {/* ambient light */}
      <div
        className="pointer-events-none absolute -left-[18%] top-[-10%] h-[70vh] w-[70vh] rounded-full opacity-[0.55] blur-[110px]"
        style={{
          background: 'radial-gradient(circle, rgba(217,174,98,0.42), transparent 68%)',
          transform: `translate3d(${pointer.x * -26}px, ${pointer.y * -18}px, 0)`,
          transition: 'transform 500ms ease-out',
        }}
      />
      <div
        className="pointer-events-none absolute -right-[12%] top-[18%] h-[58vh] w-[58vh] rounded-full opacity-[0.42] blur-[120px]"
        style={{
          background: 'radial-gradient(circle, rgba(255,58,33,0.40), transparent 68%)',
          transform: `translate3d(${pointer.x * 32}px, ${pointer.y * 22}px, 0)`,
          transition: 'transform 600ms ease-out',
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(217,174,98,0.07),transparent_60%)]" />

      {/* vertical grid lines */}
      <div className="pointer-events-none absolute inset-0 mx-auto hidden max-w-[1600px] grid-cols-4 px-6 md:grid">
        {[0, 1, 2, 3].map((index) => (
          <div key={index} className="border-l border-white/[0.055] last:border-r" />
        ))}
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1600px] flex-col px-6 pb-6 pt-5 md:px-10">
        {/* nav */}
        <header className="flex items-center justify-between">
          <motion.a
            href="#top"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="group flex items-center gap-3"
          >
            <span className="relative grid h-9 w-9 place-items-center rounded-full border border-gold/40">
              <span className="font-serif text-base italic leading-none text-gold">dv</span>
              <span className="absolute inset-0 rounded-full border border-gold/20 transition-transform duration-700 group-hover:scale-125 group-hover:opacity-0" />
            </span>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.28em] text-bone/60 sm:block">
              Deleena Venkatesh
            </span>
          </motion.a>

          <nav className="hidden items-center gap-7 md:flex">
            {[
              { label: 'Feed', id: 'feed' },
              { label: 'Padma Jewels', id: 'account-padma' },
              { label: 'Combat Crew 25', id: 'account-combat' },
              { label: 'Approach', id: 'attribution' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToId(item.id, 40)}
                className="link-underline font-mono text-[10px] uppercase tracking-[0.22em] text-bone/55 transition-colors hover:text-bone"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 font-mono text-[9px] uppercase tracking-[0.24em] text-bone/45 sm:flex">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-emerald-400" />
              2 accounts managed
            </span>
            <button
              type="button"
              onClick={() => scrollToId('feed', 30)}
              className="rounded-full bg-bone px-4 py-2 font-mono text-[9px] uppercase tracking-[0.2em] text-ink transition-colors hover:bg-gold"
            >
              View work
            </button>
          </div>
        </header>

        {/* body */}
        <div className="mt-auto grid flex-1 grid-cols-1 items-end gap-10 pb-3 pt-10 md:pt-14 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-7 xl:col-span-7">
            <motion.p
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
              className="kicker flex items-center gap-3 text-gold/90"
            >
              <span className="h-px w-10 bg-gold/60" />
              <Editable path="hero.eyebrow" className="kicker text-gold/90" />
            </motion.p>

            <h1 className="mt-5 font-sans text-[clamp(3.1rem,10.6vw,8.9rem)] font-[900] leading-[0.82] tracking-tightest text-bone">
              <span className="block">
                <SplitLines text="BEHIND" delay={0.25} />
              </span>
              <span className="block">
                <span className="overflow-hidden inline-block">
                  <motion.span
                    initial={{ y: '110%' }}
                    animate={{ y: '0%' }}
                    transition={{ duration: 1.15, delay: 0.34, ease: EASE }}
                    className="inline-flex items-baseline gap-[0.12em]"
                  >
                    <span>THE</span>
                    <span className="font-serif font-normal italic text-gold">Feed</span>
                    <span className="ml-2 align-super font-mono text-[0.16em] font-normal not-italic text-bone/35">
                      Est. 2024
                    </span>
                  </motion.span>
                </span>
                <span className="text-gold">.</span>
              </span>
            </h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="mt-6 max-w-2xl"
            >
              <h2 className="text-[clamp(1.05rem,2.1vw,1.55rem)] font-semibold uppercase leading-[1.22] tracking-[0.02em] text-bone">
                <Editable path="intro.headline" multiline as="span" className="block" />
              </h2>
              <p className="mt-4 max-w-xl text-[0.94rem] leading-relaxed text-bone/60 md:text-base">
                <Editable path="intro.support" multiline as="span" />
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.9 }}
              className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3"
            >
              <button
                type="button"
                onClick={() => scrollToId('feed', 20)}
                className="group relative overflow-hidden rounded-full bg-gold px-6 py-3 font-mono text-[10px] uppercase tracking-[0.22em] text-ink transition-transform hover:-translate-y-0.5"
              >
                <span className="relative z-10">Enter the feed</span>
                <span className="absolute inset-0 -translate-x-full bg-bone transition-transform duration-500 ease-swift group-hover:translate-x-0" />
              </button>
              <a
                href="https://www.instagram.com/padmajewels/"
                target="_blank"
                rel="noreferrer noopener"
                className="link-underline font-mono text-[10px] uppercase tracking-[0.22em] text-bone/60 hover:text-bone"
              >
                @padmajewels ↗
              </a>
              <a
                href="https://www.instagram.com/combatcrew25/"
                target="_blank"
                rel="noreferrer noopener"
                className="link-underline font-mono text-[10px] uppercase tracking-[0.22em] text-bone/60 hover:text-bone"
              >
                @combatcrew25 ↗
              </a>
            </motion.div>
          </div>

          {/* floating collage */}
          <div className="relative hidden h-[46vh] min-h-[340px] lg:col-span-5 lg:block">
            <div className="absolute inset-0">
              <FloatingTile
                src={padma.gallery[0].image}
                label={padma.gallery[0].title}
                meta="@padmajewels · post"
                className="left-[2%] top-[6%] h-[52%] w-[38%]"
                delay={0.55}
                rotate={-6}
                accent="gold"
                onClick={() => onOpenAccount('padma')}
              />
              <FloatingTile
                src={padma.gallery[3].image}
                label={padma.gallery[3].title}
                meta="@padmajewels · reel"
                className="left-[24%] top-[38%] h-[46%] w-[32%]"
                delay={0.7}
                rotate={4}
                accent="gold"
                onClick={() => onOpenAccount('padma')}
              />
              <FloatingTile
                src={combat.gallery[0].image}
                label={combat.gallery[0].title}
                meta="@combatcrew25 · post"
                className="right-[6%] top-[2%] h-[54%] w-[36%]"
                delay={0.62}
                rotate={7}
                accent="signal"
                onClick={() => onOpenAccount('combat')}
              />
              <FloatingTile
                src={combat.gallery[1].image}
                label={combat.gallery[1].title}
                meta="@combatcrew25 · reel"
                className="right-[18%] bottom-[2%] h-[40%] w-[30%]"
                delay={0.78}
                rotate={-3}
                accent="signal"
                onClick={() => onOpenAccount('combat')}
              />

              {/* floating badges */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.15, duration: 0.7, ease: EASE }}
                className="glass absolute left-0 top-[44%] flex items-center gap-2 rounded-full border border-white/12 px-3 py-1.5"
                style={{ animation: 'drift 9s ease-in-out infinite' }}
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-gold" strokeWidth="1.6">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.2" cy="6.8" r="1" className="fill-gold stroke-none" />
                </svg>
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-bone/70">
                  Managed end to end
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.3, duration: 0.7, ease: EASE }}
                className="glass absolute bottom-[26%] left-[46%] flex items-center gap-2 rounded-full border border-white/12 px-3 py-1.5"
                style={{ animation: 'drift 11s ease-in-out infinite reverse' }}
              >
                <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-signal" />
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-bone/70">Reels in-house</span>
              </motion.div>
            </div>
          </div>
        </div>

        {/* bottom strip */}
        <div className="mt-6 border-t border-white/10 pt-4">
          <div className="marquee-paused relative flex overflow-hidden">
            <div className="marquee-track flex shrink-0 items-center gap-8 whitespace-nowrap pr-8">
              {[0, 1].map((copy) => (
                <div key={copy} className="flex shrink-0 items-center gap-8">
                  {[
                    'Social media management',
                    '@padmajewels',
                    'Content strategy',
                    '@combatcrew25',
                    'Reels editing',
                    'Community management',
                    'Art direction',
                    'Content calendars',
                  ].map((item) => (
                    <span
                      key={`${copy}-${item}`}
                      className="flex items-center gap-8 font-mono text-[10px] uppercase tracking-[0.26em] text-bone/40"
                    >
                      {item}
                      <span className="text-gold/50">✦</span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* side scroll cue */}
      <div className="pointer-events-none absolute bottom-24 left-2 hidden items-center gap-3 xl:flex" style={{ writingMode: 'vertical-rl' }}>
        <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-bone/30">Scroll to explore</span>
        <span className="h-14 w-px bg-gradient-to-b from-gold/70 to-transparent" />
      </div>
    </section>
  )
}
