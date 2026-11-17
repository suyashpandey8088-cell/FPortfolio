import { useEffect, useRef } from 'react'

/**
 * ScrollContinuum — one immersive layer that carries the whole page.
 *
 * Unlike a per-section background, this is a single fixed stage that reads the
 * page as a sequence of chapters (marked with `data-chapter`) and continuously
 * morp(h)s its world between them:
 *
 *   hero → intro → tunnel → padma → study → combat → study → close
 *
 * Three layers, all driven by one scroll sample:
 *   1. haze   — three radial fields that slide + recolour as chapters pass
 *   2. contour — warped horizontal bands, amplitude tied to the chapter mood
 *   3. dust    — depth-parallax motes that stretch with scroll *velocity*
 *
 * Engineering notes:
 *   - one passive, frame-throttled scroll read; one RAF loop
 *   - chapter bands are measured once per layout change, never per frame
 *   - the world state is temporally smoothed, so chapter changes never cut
 *   - reduced motion → a static chapter gradient, no canvas at all
 *   - low-power/narrow devices → fewer motes, capped DPR, ~30fps
 *   - the loop pauses on visibilitychange
 */

type Dust = 'gold' | 'signal' | 'steel' | 'mixed'

type World = {
  a: string
  b: string
  c: string
  dust: Dust
  /** mote count multiplier 0..1 */
  density: number
  /** contour amplitude multiplier 0..1 */
  contour: number
  /** drift speed multiplier */
  speed: number
  label: string
}

const WORLDS: Record<string, World> = {
  hero: {
    a: 'rgba(217,174,98,0.20)', b: 'rgba(120,92,41,0.16)', c: 'rgba(255,236,200,0.05)',
    dust: 'gold', density: 0.45, contour: 0.35, speed: 0.6, label: 'Opening',
  },
  intro: {
    a: 'rgba(226,186,112,0.20)', b: 'rgba(138,106,47,0.17)', c: 'rgba(255,226,176,0.06)',
    dust: 'gold', density: 0.6, contour: 0.5, speed: 0.7, label: 'The work',
  },
  tunnel: {
    a: 'rgba(240,164,72,0.22)', b: 'rgba(255,58,33,0.16)', c: 'rgba(255,214,150,0.07)',
    dust: 'mixed', density: 0.95, contour: 0.8, speed: 1.25, label: 'The tunnel',
  },
  padma: {
    a: 'rgba(206,158,74,0.19)', b: 'rgba(94,66,26,0.16)', c: 'rgba(255,214,150,0.06)',
    dust: 'gold', density: 0.7, contour: 0.45, speed: 0.6, label: 'Padma Jewels',
  },
  'padma-study': {
    a: 'rgba(180,146,94,0.13)', b: 'rgba(74,58,34,0.14)', c: 'rgba(236,220,190,0.05)',
    dust: 'gold', density: 0.38, contour: 0.32, speed: 0.4, label: 'Padma — case study',
  },
  combat: {
    a: 'rgba(255,58,33,0.18)', b: 'rgba(90,15,6,0.18)', c: 'rgba(255,140,110,0.06)',
    dust: 'signal', density: 0.85, contour: 0.6, speed: 1.1, label: 'Combat Crew 25',
  },
  'combat-study': {
    a: 'rgba(150,96,86,0.13)', b: 'rgba(52,30,28,0.16)', c: 'rgba(220,208,204,0.05)',
    dust: 'signal', density: 0.38, contour: 0.3, speed: 0.4, label: 'Combat — case study',
  },
  close: {
    a: 'rgba(142,147,155,0.11)', b: 'rgba(60,50,32,0.15)', c: 'rgba(217,174,98,0.05)',
    dust: 'steel', density: 0.3, contour: 0.25, speed: 0.35, label: 'Closing',
  },
}

const FALLBACK = WORLDS.close

function worldFor(name: string): World {
  return WORLDS[name] ?? FALLBACK
}

function parseRgba(value: string) {
  const match = value.match(/rgba?\(([^)]+)\)/)
  if (!match) return [0, 0, 0, 0]
  const p = match[1].split(',').map((n) => parseFloat(n.trim()))
  return [p[0], p[1], p[2], p[3] ?? 1]
}

const mix = (from: string, to: string, t: number) => {
  const [r1, g1, b1, a1] = parseRgba(from)
  const [r2, g2, b2, a2] = parseRgba(to)
  const n = (x: number, y: number) => Math.round(x + (y - x) * t)
  const f = (x: number, y: number) => (x + (y - x) * t).toFixed(3)
  return `rgba(${n(r1, r2)},${n(g1, g2)},${n(b1, b2)},${f(a1, a2)})`
}

const dustColor = (dust: Dust, alpha: number) =>
  dust === 'signal'
    ? `rgba(255,122,92,${alpha.toFixed(3)})`
    : dust === 'steel'
      ? `rgba(196,202,212,${alpha.toFixed(3)})`
      : dust === 'mixed'
        ? `rgba(238,214,178,${alpha.toFixed(3)})`
        : `rgba(233,205,150,${alpha.toFixed(3)})`

const smoothstep = (t: number) => {
  const x = Math.min(1, Math.max(0, t))
  return x * x * (3 - 2 * x)
}

type Band = { name: string; start: number; end: number }
type Particle = { x: number; y: number; z: number; r: number; drift: number; phase: number }

export default function ScrollContinuum() {
  const hazeRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chapterRef = useRef<HTMLSpanElement>(null)
  const railRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const haze = hazeRef.current
    const canvas = canvasRef.current
    if (!haze || !canvas) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    /* ── capability probe ─────────────────────────────────────────────────── */
    const nav = navigator as Navigator & { deviceMemory?: number; hardwareConcurrency?: number }
    const narrow = window.matchMedia('(max-width: 767px)').matches
    const lowPower =
      (nav.hardwareConcurrency ?? 4) <= 4 || (nav.deviceMemory ?? 4) <= 4 || narrow

    /* ── chapter bands ────────────────────────────────────────────────────── */
    let bands: Band[] = []
    const measure = () => {
      const y = window.scrollY
      bands = [...document.querySelectorAll<HTMLElement>('[data-chapter]')]
        .map((el) => {
          const rect = el.getBoundingClientRect()
          const start = rect.top + y
          return { name: el.dataset.chapter || 'close', start, end: start + rect.height }
        })
        .filter((band) => band.end > band.start)
        .sort((a, b) => a.start - b.start)
    }

    /** continuous position in the chapter sequence, e.g. 2.4 = 40% through chapter 2 */
    const chapterPosition = (scrollY: number) => {
      if (!bands.length) return 0
      const centre = scrollY + window.innerHeight / 2
      if (centre <= bands[0].start) return 0
      for (let i = 0; i < bands.length; i += 1) {
        const band = bands[i]
        if (centre < band.end) {
          const within = (centre - band.start) / Math.max(1, band.end - band.start)
          return i + Math.min(1, Math.max(0, within))
        }
      }
      return bands.length - 1
    }

    const worldAt = (position: number) => {
      if (!bands.length) return FALLBACK
      const index = Math.max(0, Math.min(bands.length - 1, Math.floor(position)))
      const nextIndex = Math.min(bands.length - 1, index + 1)
      const t = smoothstep(position - index)
      const from = worldFor(bands[index].name)
      const to = worldFor(bands[nextIndex].name)
      return {
        a: mix(from.a, to.a, t),
        b: mix(from.b, to.b, t),
        c: mix(from.c, to.c, t),
        dust: t < 0.5 ? from.dust : to.dust,
        density: from.density + (to.density - from.density) * t,
        contour: from.contour + (to.contour - from.contour) * t,
        speed: from.speed + (to.speed - from.speed) * t,
        label: t < 0.5 ? from.label : to.label,
      }
    }

    measure()

    /* ── static fallback for reduced motion ───────────────────────────────── */
    if (reduced) {
      const initial = worldAt(chapterPosition(window.scrollY))
      haze.style.background = `radial-gradient(60% 45% at 22% 18%, ${initial.a}, transparent 70%),
        radial-gradient(55% 42% at 80% 76%, ${initial.b}, transparent 72%)`
      const onScroll = () => {
        const w = worldAt(chapterPosition(window.scrollY))
        haze.style.background = `radial-gradient(60% 45% at 22% 18%, ${w.a}, transparent 70%),
          radial-gradient(55% 42% at 80% 76%, ${w.b}, transparent 72%)`
        if (chapterRef.current) chapterRef.current.textContent = w.label
      }
      const onResize = () => {
        measure()
        onScroll()
      }
      window.addEventListener('scroll', onScroll, { passive: true })
      window.addEventListener('resize', onResize)
      onScroll()
      return () => {
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', onResize)
      }
    }

    /* ── canvas setup ─────────────────────────────────────────────────────── */
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let dpr = 1
    let width = 0
    let height = 0
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, lowPower ? 1.5 : 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const maxParticles = lowPower ? 34 : 78
    const particles: Particle[] = []
    for (let i = 0; i < maxParticles; i += 1) {
      particles.push({
        x: Math.random(),
        y: Math.random(),
        z: 0.2 + Math.random() * 0.8,
        r: 0.5 + Math.random() * 1.5,
        drift: 0.4 + Math.random() * 1.2,
        phase: Math.random() * Math.PI * 2,
      })
    }

    /* ── scroll sampling ──────────────────────────────────────────────────── */
    let scrollY = window.scrollY
    let target = chapterPosition(scrollY)
    let position = target
    let velocity = 0
    let smoothVelocity = 0
    let ticking = false

    const readScroll = () => {
      const previous = scrollY
      scrollY = window.scrollY
      velocity = scrollY - previous
      ticking = false
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(readScroll)
    }

    const onResize = () => {
      resize()
      measure()
      target = chapterPosition(scrollY)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)

    /* fonts settle after load and shift layout — re-measure once they do */
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        measure()
        target = chapterPosition(window.scrollY)
      })
    }

    /* ── loop ─────────────────────────────────────────────────────────────── */
    let raf = 0
    let running = true
    let last = 0
    let clock = 0
    const budget = lowPower ? 1000 / 30 : 0
    let lastLabel = ''

    const frame = (time: number) => {
      if (!running) return
      raf = requestAnimationFrame(frame)
      if (budget && time - last < budget) return

      const delta = last ? Math.min(64, time - last) : 16
      last = time
      clock += delta / 1000

      target = chapterPosition(scrollY)
      // temporal smoothing — chapter changes ease instead of cutting
      position += (target - position) * 0.085
      smoothVelocity += (velocity - smoothVelocity) * 0.12
      velocity *= 0.86

      const world = worldAt(position)
      const energy = Math.min(1, Math.abs(smoothVelocity) / 55)

      /* 1. haze — slides and recolours with the chapter */
      const driftX = Math.sin(clock * 0.12 * world.speed) * 3
      haze.style.background = `radial-gradient(58% 44% at ${20 + position * 6 + driftX}% ${
        10 + (position % 1) * 34
      }%, ${world.a}, transparent 70%),
        radial-gradient(52% 40% at ${82 - position * 5 - driftX}% ${
          88 - (position % 1) * 26
        }%, ${world.b}, transparent 72%),
        radial-gradient(78% 54% at 50% ${44 + (position % 1) * 16}%, ${world.c}, transparent 78%)`

      /* 2. contour field + 3. dust */
      ctx.clearRect(0, 0, width, height)

      const amplitude = (14 + world.contour * 46) * (1 + energy * 0.9)
      const lines = lowPower ? 3 : 5
      ctx.lineWidth = 1
      for (let line = 0; line < lines; line += 1) {
        const yBase = height * (0.18 + line * 0.17) + Math.sin(clock * 0.3 + line) * 6
        const phase = clock * (0.16 + line * 0.05) * world.speed + line * 1.7
        ctx.beginPath()
        const steps = lowPower ? 6 : 10
        for (let step = 0; step <= steps; step += 1) {
          const x = (step / steps) * width
          const wave =
            Math.sin((step / steps) * Math.PI * 2 + phase) * amplitude +
            Math.sin((step / steps) * Math.PI * 4.2 + phase * 1.6) * amplitude * 0.35
          const y = yBase + wave
          if (step === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        const gradient = ctx.createLinearGradient(0, 0, width, 0)
        const alpha = 0.05 + world.contour * 0.05 + energy * 0.04
        gradient.addColorStop(0, dustColor(world.dust, 0))
        gradient.addColorStop(0.5, dustColor(world.dust, alpha))
        gradient.addColorStop(1, dustColor(world.dust, 0))
        ctx.strokeStyle = gradient
        ctx.stroke()
      }

      const activeCount = Math.round(maxParticles * (0.35 + world.density * 0.65))
      for (let i = 0; i < activeCount; i += 1) {
        const p = particles[i]
        const drift = Math.sin(clock * 0.22 * p.drift + p.phase) * 12 * p.z
        const rise = (clock * 8 * p.z * world.speed) % (height + 140)
        const px = p.x * width + drift
        let py = p.y * height - rise - position * 26 * p.z
        py = ((py % height) + height) % height

        const alpha = (0.08 + p.z * 0.26) * (lowPower ? 0.85 : 1)
        const radius = p.r * (0.7 + p.z * 1.4)
        // velocity stretch: flicks pull the motes into streaks
        const stretch = 1 + energy * 5 * p.z

        ctx.beginPath()
        ctx.fillStyle = dustColor(world.dust, alpha)
        ctx.ellipse(px, py, radius, radius * stretch, 0, 0, Math.PI * 2)
        ctx.fill()
      }

      /* HUD */
      if (chapterRef.current && world.label !== lastLabel) {
        lastLabel = world.label
        chapterRef.current.textContent = world.label
      }
      if (railRef.current) {
        const total = Math.max(1, bands.length - 1)
        railRef.current.style.transform = `scaleX(${Math.min(1, position / total)})`
      }
    }

    raf = requestAnimationFrame(frame)

    const onVisibility = () => {
      if (document.hidden) {
        running = false
        cancelAnimationFrame(raf)
      } else if (!running) {
        running = true
        last = 0
        raf = requestAnimationFrame(frame)
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          ref={hazeRef}
          className="absolute inset-0"
          style={{
            background: `radial-gradient(58% 44% at 20% 10%, ${WORLDS.hero.a}, transparent 70%),
              radial-gradient(52% 40% at 82% 88%, ${WORLDS.hero.b}, transparent 72%)`,
          }}
        />
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
        {/* legibility, always: vertical wash + vignette above the artwork */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,7,0.55)_0%,rgba(8,8,7,0.10)_28%,rgba(8,8,7,0.10)_72%,rgba(8,8,7,0.62)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_50%,transparent_45%,rgba(8,8,7,0.55)_100%)]" />
      </div>

      {/* persistent chapter HUD — you always know where you are in the journey */}
      <div className="pointer-events-none fixed bottom-5 left-5 z-[70] hidden select-none items-center gap-3 md:flex">
        <div className="flex w-28 flex-col gap-1.5">
          <span className="font-mono text-[8px] uppercase tracking-[0.28em] text-bone/30">Chapter</span>
          <span
            ref={chapterRef}
            className="truncate font-mono text-[9.5px] uppercase tracking-[0.18em] text-bone/70"
          >
            Opening
          </span>
          <div className="h-px w-full bg-white/12">
            <div ref={railRef} className="h-px origin-left bg-gradient-to-r from-gold to-signal" style={{ transform: 'scaleX(0)' }} />
          </div>
        </div>
      </div>
    </>
  )
}
