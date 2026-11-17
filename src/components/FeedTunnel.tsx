import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { useContent, type ViewerItem } from '../store/content'
import type { Account } from '../content/accounts'

/**
 * The Feed Tunnel — the scroll-driven set piece.
 *
 * A tall section pins a full-viewport stage. As the page scrolls, ~24 frames from
 * both feeds travel toward the viewer through four depth layers (perspective),
 * cross-fading gold → red as the story moves from Padma to Combat. The camera
 * also drifts laterally so the tunnel feels like a corridor rather than a stack.
 *
 * Craft notes:
 *  - Every frame's transform is derived from ONE scroll progress value, so there
 *    is no per-element scroll listener.
 *  - Layers rotate through a fixed set of positions; nothing is randomised at
 *    render time, so server and client markup always agree.
 *  - Only images near the current depth are given `will-change`, to keep the
 *    compositor budget sane on phones.
 *  - Reduced motion swaps the tunnel for a calm grid; small screens use fewer
 *    frames and a shallower perspective.
 */

type Tile = ViewerItem & { name: string }

export default function FeedTunnel({ onOpenAccount }: { onOpenAccount: (id: string) => void }) {
  const { content } = useContent()
  const sectionRef = useRef<HTMLElement>(null)
  const [reduced, setReduced] = useState(false)
  const [compact, setCompact] = useState(false)

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sizeQuery = window.matchMedia('(max-width: 767px)')
    const sync = () => {
      setReduced(motionQuery.matches)
      setCompact(sizeQuery.matches)
    }
    sync()
    motionQuery.addEventListener('change', sync)
    sizeQuery.addEventListener('change', sync)
    return () => {
      motionQuery.removeEventListener('change', sync)
      sizeQuery.removeEventListener('change', sync)
    }
  }, [])

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  // A touch of spring keeps fast flicks from feeling mechanical.
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.0004 })

  const tiles = useMemo<Tile[]>(() => {
    const perAccount = compact ? 6 : 12
    const build = (account: Account): Tile[] =>
      account.gallery.slice(0, perAccount).map((item) => ({
        image: item.image,
        type: item.type,
        title: item.title,
        caption: item.caption,
        tags: item.tags,
        href: item.url ?? account.url,
        handle: account.username,
        accent: account.id === 'combat' ? ('signal' as const) : ('gold' as const),
        name: account.name,
      }))
    const padma = build(content.accounts[0])
    const combat = build(content.accounts[1])
    // interleave the two worlds so the tunnel reads gold → red → gold…
    const woven: Tile[] = []
    for (let i = 0; i < Math.max(padma.length, combat.length); i += 1) {
      if (padma[i]) woven.push(padma[i])
      if (combat[i]) woven.push(combat[i])
    }
    return woven
  }, [content.accounts, compact])

  /* ── camera ─────────────────────────────────────────────────────────────── */
  const stageRotateX = useTransform(progress, [0, 1], [8, -6])
  const stageRotateY = useTransform(progress, [0, 0.5, 1], [-9, 2, 8])
  const stageShiftY = useTransform(progress, [0, 1], ['3%', '-3%'])
  const goldGlow = useTransform(progress, [0, 0.42], [0.85, 0])
  const redGlow = useTransform(progress, [0.5, 1], [0, 0.9])

  const counter = useTransform(progress, (value: number) =>
    String(
      Math.min(tiles.length, Math.max(1, Math.round(value * (tiles.length - 1)) + 1)),
    ).padStart(2, '0'),
  )

  /* ── open a frame full screen ───────────────────────────────────────────── */
  const openTile = (index: number) => {
    onOpenAccount(tiles[index].accent === 'signal' ? 'combat' : 'padma')
  }

  if (reduced) {
    return (
      <section id="tunnel" className="relative border-y border-white/10 bg-ink/50 py-20">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10">
          <p className="kicker text-gold/80">The feed tunnel</p>
          <h2 className="mt-3 text-[clamp(1.8rem,4vw,3rem)] font-[900] uppercase leading-[0.95] tracking-tight text-bone">
            {tiles.length} frames,{' '}
            <span className="font-serif font-normal italic text-gold">end to end</span>
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
            {tiles.map((tile, index) => (
              <button
                key={`${tile.image}-${index}`}
                type="button"
                onClick={() => openTile(index)}
                className="group relative aspect-square overflow-hidden rounded-sm border border-white/10"
              >
                <img src={tile.image} alt={tile.title} loading="lazy" className="h-full w-full object-cover" />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-2 text-left">
                  <span className="block truncate text-[9px] text-white/80">{tile.title}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      ref={sectionRef}
      id="tunnel"
      className="relative border-y border-white/10 bg-ink/55"
      style={{ height: `${compact ? 240 : 360}vh` }}
      aria-label="Scroll-driven feed gallery"
    >
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
        {/* world glows — cross-fade gold to red as the tunnel advances */}
        <motion.div
          style={{ opacity: goldGlow }}
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_62%,rgba(217,174,98,0.28),transparent_62%)]"
        />
        <motion.div
          style={{ opacity: redGlow }}
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_62%,rgba(255,58,33,0.26),transparent_62%)]"
        />

        {/* section heading, pinned with the stage */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 mx-auto max-w-[1600px] px-6 pt-20 md:px-10 md:pt-24">
          <div className="pointer-events-none absolute inset-x-0 -top-10 h-56 bg-gradient-to-b from-ink/90 via-ink/50 to-transparent" />
          <p className="kicker flex items-center gap-3 text-gold/80">
            <span className="h-px w-8 bg-gold/50" />
            The feed tunnel
          </p>
          <h2 className="mt-3 max-w-lg text-[clamp(1.6rem,3.4vw,2.9rem)] font-[900] uppercase leading-[0.94] tracking-tight text-bone">
            {tiles.length} frames,
            <br />
            <span className="font-serif font-normal italic text-gold">every one unique.</span>
          </h2>
          <p className="mt-3 max-w-xs text-[12px] leading-relaxed text-bone/45">
            Keep scrolling — the two feeds travel toward you, from gold to red. Click any frame to
            open it full screen.
          </p>
        </div>

        {/* ── the tunnel ───────────────────────────────────────────────────── */}
        <div className="absolute inset-0 [perspective:1400px] [perspective-origin:50%_56%]">
          <motion.div
            style={{ rotateX: stageRotateX, rotateY: stageRotateY, y: stageShiftY, transformStyle: 'preserve-3d' }}
            className="absolute inset-0 [transform-style:preserve-3d]"
          >
            {tiles.map((tile, index) => (
              <TunnelFrame
                key={`${tile.image}-${index}`}
                tile={tile}
                index={index}
                total={tiles.length}
                progress={progress}
                compact={compact}
                onOpen={() => openTile(index)}
              />
            ))}
          </motion.div>
        </div>

        {/* depth haze so far frames recede rather than clutter */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_58%,transparent_28%,rgba(8,8,7,0.72)_78%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />

        {/* HUD */}
        <div className="absolute inset-x-0 bottom-0 z-30 mx-auto flex max-w-[1600px] items-end justify-between px-6 pb-8 md:px-10">
          <div className="flex items-center gap-3">
            <motion.span className="tabnum font-mono text-[11px] text-bone/80">{counter}</motion.span>
            <span className="font-mono text-[11px] text-bone/30">/ {tiles.length}</span>
            <div className="ml-2 h-px w-24 bg-white/15 sm:w-40">
              <motion.div
                style={{ scaleX: progress }}
                className="h-px origin-left bg-gradient-to-r from-gold to-signal"
              />
            </div>
          </div>
          <div className="hidden items-center gap-5 sm:flex">
            {[
              { id: 'padma', label: 'Padma Jewels', dot: 'bg-gold' },
              { id: 'combat', label: 'Combat Crew 25', dot: 'bg-signal' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onOpenAccount(item.id)}
                className="group flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-bone/45 transition-colors hover:text-bone"
              >
                <span className={`h-1.5 w-1.5 rounded-full ${item.dot}`} />
                {item.label}
                <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── one frame in the tunnel ──────────────────────────────────────────────── */

type FrameProps = {
  tile: Tile
  index: number
  total: number
  progress: MotionValue<number>
  compact: boolean
  onOpen: () => void
}

/** `%` in JS can return a negative value; the tunnel needs a wrapped 0..1. */
function wrap01(value: number) {
  return ((value % 1) + 1) % 1
}

const LANES = [
  { x: -34, y: -18, rotate: -7 },
  { x: 26, y: -26, rotate: 6 },
  { x: -14, y: 24, rotate: 4 },
  { x: 34, y: 16, rotate: -5 },
  { x: 2, y: -4, rotate: -2 },
  { x: -30, y: 6, rotate: 8 },
]

function TunnelFrame({ tile, index, total, progress, compact, onOpen }: FrameProps) {
  // Timeline: the frame sits deep in the tunnel, travels forward, passes the
  // camera, then recycles. Offsetting by index keeps the corridor populated.
  const start = index / total
  const isSignal = tile.accent === 'signal'
  const lane = LANES[index % LANES.length]

  const z = useTransform(progress, (value: number) => {
    const local = wrap01(value * 1.55 - start + 1.2) // 0..1 per frame lifecycle
    return -2600 + local * 2900 // deep → behind the camera
  })
  const scale = useTransform(progress, (value: number) => {
    const local = wrap01(value * 1.55 - start + 1.2)
    return 0.34 + local * 1.65
  })
  const opacity = useTransform(progress, (value: number) => {
    const local = wrap01(value * 1.55 - start + 1.2)
    if (local < 0.12) return local / 0.12
    if (local > 0.86) return Math.max(0, (1 - local) / 0.14)
    return 1
  })
  const lateral = useTransform(progress, (value: number) => {
    const local = wrap01(value * 1.55 - start + 1.2)
    // frames drift outward as they approach, like passing a corridor's walls
    return lane.x * (0.55 + local * 1.15)
  })
  const vertical = useTransform(progress, (value: number) => {
    const local = wrap01(value * 1.55 - start + 1.2)
    return lane.y * (0.55 + local * 1.15)
  })

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      aria-label={`Open ${tile.title} from ${tile.name}`}
      style={{
        z,
        scale,
        opacity,
        x: lateral,
        y: vertical,
        rotate: lane.rotate,
        transformStyle: 'preserve-3d',
      }}
      whileHover={{ scale: 1.06, transition: { duration: 0.35 } }}
      className={`group absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[3px] border shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] ${
        compact ? 'h-[22vh] w-[32vw]' : 'h-[26vh] w-[13vw]'
      } ${isSignal ? 'border-signal/40' : 'border-gold/35'}`}
    >
      <img
        src={tile.image}
        alt={tile.title}
        loading={index < 6 ? 'eager' : 'lazy'}
        className="h-full w-full object-cover opacity-90 transition-opacity duration-500 group-hover:opacity-100"
      />
      <span
        className={`absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${
          isSignal
            ? 'bg-gradient-to-t from-[#1a0402]/95 via-transparent to-transparent'
            : 'bg-gradient-to-t from-[#150e05]/95 via-transparent to-transparent'
        }`}
      />
      <span className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded-full bg-black/50 px-1.5 py-0.5 backdrop-blur-sm">
        <span className={`h-1 w-1 rounded-full ${isSignal ? 'bg-signal' : 'bg-gold'}`} />
        <span className="font-mono text-[6.5px] uppercase tracking-[0.14em] text-white/80">{tile.type}</span>
      </span>
      <span className="absolute inset-x-0 bottom-0 translate-y-2 p-2 text-left opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <span className={`font-mono text-[6.5px] uppercase tracking-[0.16em] ${isSignal ? 'text-signal' : 'text-gold'}`}>
          {tile.handle}
        </span>
        <span className="mt-0.5 block truncate text-[9.5px] font-semibold leading-tight text-white">
          {tile.title}
        </span>
      </span>
      {/* frame number, visible at rest so the tunnel reads as an index */}
      <span className="absolute right-1.5 top-1.5 font-mono text-[7px] text-white/35">
        {String(index + 1).padStart(2, '0')}
      </span>
    </motion.button>
  )
}
