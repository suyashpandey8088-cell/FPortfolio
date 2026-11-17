import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useLenis } from '../hooks/useSmoothScroll'

/* ── 1. marquee ─────────────────────────────────────────────────────────── */

/**
 * Infinite horizontal ticker. Duplicates its content so the loop is seamless,
 * and pauses on hover so text stays readable if someone stops to look.
 */
export function Marquee({
  children,
  speed = 'normal',
  reverse = false,
  className = '',
}: {
  children: React.ReactNode
  speed?: 'slow' | 'normal' | 'fast'
  reverse?: boolean
  className?: string
}) {
  const animation =
    speed === 'fast' ? 'animate-marquee-x-fast' : speed === 'slow' ? 'animate-marquee-x' : 'animate-marquee-x'
  return (
    <div className={`group relative flex overflow-hidden ${className}`} aria-hidden>
      <div
        className={`flex shrink-0 items-center gap-8 pr-8 ${animation} group-hover:[animation-play-state:paused]`}
        style={reverse ? { animationDirection: 'reverse' } : undefined}
      >
        <span className="flex shrink-0 items-center gap-8 pr-8">{children}</span>
        <span className="flex shrink-0 items-center gap-8 pr-8">{children}</span>
      </div>
    </div>
  )
}

/* ── 2. oversized type ──────────────────────────────────────────────────── */

export function GiantType({
  children,
  className = '',
  outline = false,
  as: Tag = 'div',
}: {
  children: React.ReactNode
  className?: string
  outline?: boolean
  as?: 'div' | 'span' | 'h1' | 'h2' | 'h3'
}) {
  return (
    <Tag
      className={`font-display font-bold leading-[0.78] tracking-tightest ${outline ? 'outline-type' : ''} ${className}`}
    >
      {children}
    </Tag>
  )
}

/** A word that scales and skews as it enters — scroll-driven type displacement. */
export function ShiftWord({ children, className = '' }: { children: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: false, margin: '-15% 0px -15% 0px' })
  const reduced = useReducedMotion()
  return (
    <motion.span
      ref={ref}
      className={`inline-block origin-left ${className}`}
      animate={
        reduced
          ? undefined
          : {
              scaleX: inView ? 1 : 1.06,
              skewX: inView ? 0 : -2,
              letterSpacing: inView ? '-0.04em' : '0.01em',
            }
      }
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.span>
  )
}

/* ── 3. reveal ──────────────────────────────────────────────────────────── */

/** Clip-path reveal from below. The default entrance for images and blocks. */
export function RevealFrame({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-8% 0px' })
  const reduced = useReducedMotion()
  if (reduced) return <div className={className}>{children}</div>
  return (
    <motion.div
      ref={ref}
      className={`overflow-hidden ${className}`}
      initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
      animate={inView ? { clipPath: 'inset(0% 0% 0% 0%)' } : undefined}
      transition={{ duration: 1.05, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        initial={{ scale: 1.14 }}
        animate={inView ? { scale: 1 } : undefined}
        transition={{ duration: 1.3, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

/* ── 4. stickers & geometric objects ────────────────────────────────────── */

export function Star({ className = '', size = 40 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden>
      <path
        d="M50 0 L58 38 L100 50 L58 62 L50 100 L42 62 L0 50 L42 38 Z"
        fill="currentColor"
      />
    </svg>
  )
}

/** A filled, rotated label — the "graphic sticker" motif. */
export function Sticker({
  children,
  color = 'bg-acid',
  text = 'text-ink',
  rotate = -8,
  className = '',
}: {
  children: React.ReactNode
  color?: string
  text?: string
  rotate?: number
  className?: string
}) {
  return (
    <span
      className={`inline-block ${color} ${text} px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.2em] ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </span>
  )
}

/** Concentric arc rings — used as a background object, never the subject. */
export function Rings({ className = '', size = 420 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className={className} aria-hidden>
      {[86, 68, 50, 32, 16].map((r, i) => (
        <circle
          key={r}
          cx="100"
          cy="100"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={i % 2 === 0 ? 1.2 : 0.5}
          opacity={1 - i * 0.16}
        />
      ))}
      <line x1="100" y1="0" x2="100" y2="200" stroke="currentColor" strokeWidth="0.4" opacity="0.5" />
      <line x1="0" y1="100" x2="200" y2="100" stroke="currentColor" strokeWidth="0.4" opacity="0.5" />
    </svg>
  )
}

/* ── 5. custom cursor ───────────────────────────────────────────────────── */

/**
 * Blended-difference cursor dot that grows over interactive elements.
 * Only mounts for fine pointers, and never under reduced motion — a cursor
 * cannot lag behind a finger.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [hot, setHot] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return

    const node = dot.current
    if (!node) return

    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let tx = x
    let ty = y
    let raf = 0

    const move = (event: PointerEvent) => {
      tx = event.clientX
      ty = event.clientY
      setVisible(true)
      const target = event.target as HTMLElement | null
      setHot(Boolean(target?.closest('a, button, [data-cursor="hot"]')))
    }
    const leave = () => setVisible(false)

    const loop = () => {
      x += (tx - x) * 0.2
      y += (ty - y) * 0.2
      node.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerleave', leave)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerleave', leave)
    }
  }, [])

  return (
    <div
      ref={dot}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[200] hidden mix-blend-difference md:block"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 220ms' }}
    >
      <div
        className="rounded-full bg-white transition-all duration-300"
        style={{ width: hot ? 46 : 12, height: hot ? 46 : 12 }}
      />
    </div>
  )
}

/* ── 6. magnetic button ─────────────────────────────────────────────────── */

/** Pulls toward the pointer within a small radius, springs back on leave. */
export function Magnetic({
  children,
  className = '',
  strength = 0.28,
}: {
  children: React.ReactNode
  className?: string
  strength?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()

  const onMove = (event: React.PointerEvent) => {
    if (reduced) return
    const node = ref.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    const dx = (event.clientX - (rect.left + rect.width / 2)) * strength
    const dy = (event.clientY - (rect.top + rect.height / 2)) * strength
    node.style.transform = `translate(${dx}px, ${dy}px)`
  }
  const onLeave = () => {
    const node = ref.current
    if (node) node.style.transform = 'translate(0,0)'
  }

  return (
    <span
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`inline-block transition-transform duration-300 ease-swift ${className}`}
    >
      {children}
    </span>
  )
}

/* ── 7. scene wrapper ───────────────────────────────────────────────────── */

/**
 * Every section is a scene: it declares its colour identity, and the colour
 * engine picks it up from `data-scene`.
 */
export function Scene({
  id,
  children,
  className = '',
  label,
}: {
  id: string
  children: React.ReactNode
  className?: string
  label?: string
}) {
  return (
    <section
      id={id}
      data-scene={id}
      aria-label={label}
      className={`scene relative overflow-hidden ${className}`}
    >
      {children}
    </section>
  )
}

/** Small mono index label, set in the scene accent. */
export function SceneIndex({ n, title }: { n: string; title: string }) {
  return (
    <div className="flex items-baseline gap-4">
      <span className="font-mono text-[10px] tracking-[0.3em] opacity-60">{n}</span>
      <span className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-90">{title}</span>
    </div>
  )
}

/* ── 8. scroll helper ───────────────────────────────────────────────────── */

export function useJumpTo() {
  const lenis = useLenis()
  return (id: string) => {
    const target = document.getElementById(id)
    if (!target) return
    if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.4 })
    else target.scrollIntoView({ behavior: 'smooth' })
  }
}
