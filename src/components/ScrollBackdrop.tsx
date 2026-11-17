import { useEffect, useRef } from 'react'

/**
 * Scroll-driven atmospheric background.
 *
 * Design constraints:
 *  - Fixed, behind everything (z-index 0), `pointer-events: none`.
 *  - One canvas + one RAF loop for the whole page — no per-section watchers.
 *  - Reads scroll progress from a single passive scroll listener, throttled to
 *    animation frames, so it never competes with Lenis for layout.
 *  - Degrades in three steps: reduced-motion → static gradient; low-power device
 *    → fewer particles, no blur; capable device → full effect.
 *  - Pauses entirely when the tab is hidden or the section is off screen.
 */

type Palette = {
  /** two radial haze colours that cross-fade along the scroll */
  a: string
  b: string
  c: string
  /** particle tint */
  dust: string
}

const PALETTES: Palette[] = [
  // 0 → hero / intro : warm gold, jewellery world
  { a: 'rgba(217,174,98,0.20)', b: 'rgba(138,106,47,0.16)', c: 'rgba(255,236,200,0.06)', dust: 'gold' },
  // 1 → padma panel : deeper amber
  { a: 'rgba(196,146,62,0.17)', b: 'rgba(94,66,26,0.14)', c: 'rgba(255,214,150,0.05)', dust: 'gold' },
  // 2 → combat panel : signal red
  { a: 'rgba(255,58,33,0.16)', b: 'rgba(90,15,6,0.16)', c: 'rgba(255,140,110,0.05)', dust: 'signal' },
  // 3 → attribution / footer : cool steel + faint gold
  { a: 'rgba(142,147,155,0.10)', b: 'rgba(60,50,32,0.14)', c: 'rgba(217,174,98,0.05)', dust: 'mixed' },
]

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function parseRgba(value: string) {
  const match = value.match(/rgba?\(([^)]+)\)/)
  if (!match) return [0, 0, 0, 0]
  const parts = match[1].split(',').map((n) => parseFloat(n.trim()))
  return [parts[0], parts[1], parts[2], parts[3] ?? 1]
}

function mix(from: string, to: string, t: number) {
  const [r1, g1, b1, a1] = parseRgba(from)
  const [r2, g2, b2, a2] = parseRgba(to)
  return `rgba(${Math.round(lerp(r1, r2, t))},${Math.round(lerp(g1, g2, t))},${Math.round(
    lerp(b1, b2, t),
  )},${lerp(a1, a2, t).toFixed(3)})`
}

/** pick the palette pair that brackets the current progress */
function samplePalette(progress: number) {
  const scaled = progress * (PALETTES.length - 1)
  const index = Math.min(PALETTES.length - 2, Math.floor(scaled))
  const t = Math.min(1, Math.max(0, scaled - index))
  const from = PALETTES[index]
  const to = PALETTES[Math.min(PALETTES.length - 1, index + 1)]
  return {
    a: mix(from.a, to.a, t),
    b: mix(from.b, to.b, t),
    c: mix(from.c, to.c, t),
    dust: t < 0.5 ? from.dust : to.dust,
  }
}

type Particle = {
  x: number
  y: number
  z: number
  r: number
  drift: number
  phase: number
}

export default function ScrollBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hazeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const haze = hazeRef.current
    if (!canvas || !haze) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // ── capability probe ────────────────────────────────────────────────────
    const nav = navigator as Navigator & { deviceMemory?: number; hardwareConcurrency?: number }
    const cores = nav.hardwareConcurrency ?? 4
    const memory = nav.deviceMemory ?? 4
    const narrow = window.matchMedia('(max-width: 767px)').matches
    const lowPower = cores <= 4 || memory <= 4 || narrow

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    // Static, but still on-brand, when the user asks for less motion.
    if (reduced) {
      haze.style.background = `radial-gradient(60% 45% at 20% 12%, ${PALETTES[0].a}, transparent 70%),
        radial-gradient(55% 40% at 82% 78%, ${PALETTES[2].a}, transparent 72%)`
      return
    }

    let dpr = Math.min(window.devicePixelRatio || 1, lowPower ? 1.5 : 2)
    let width = 0
    let height = 0

    const particleCount = lowPower ? 26 : 64
    const particles: Particle[] = []

    const seed = () => {
      particles.length = 0
      for (let i = 0; i < particleCount; i += 1) {
        particles.push({
          x: Math.random(),
          y: Math.random(),
          z: 0.25 + Math.random() * 0.75, // depth: drives size + parallax speed
          r: 0.5 + Math.random() * 1.6,
          drift: 0.4 + Math.random() * 1.2,
          phase: Math.random() * Math.PI * 2,
        })
      }
    }

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
    seed()

    // ── scroll progress (passive, frame-throttled) ───────────────────────────
    let target = 0
    let eased = 0
    let ticking = false

    const readScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      target = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      ticking = false
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(readScroll)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', resize)
    readScroll()

    // ── loop ────────────────────────────────────────────────────────────────
    let raf = 0
    let running = true
    let last = 0
    const frameBudget = lowPower ? 1000 / 30 : 0 // cap to 30fps on weak devices
    let t = 0

    const draw = (time: number) => {
      if (!running) return
      raf = requestAnimationFrame(draw)

      if (frameBudget && time - last < frameBudget) return
      const delta = last ? Math.min(48, time - last) : 16
      last = time
      t += delta / 1000

      // smoothing keeps the palette change buttery even with trackpad flicks
      eased = lerp(eased, target, 0.09)
      const pal = samplePalette(eased)

      // haze: two large soft radial fields that slide against the scroll
      const y1 = 6 + eased * 46
      const y2 = 92 - eased * 38
      haze.style.background = `radial-gradient(58% 44% at ${18 + eased * 26}% ${y1}%, ${pal.a}, transparent 70%),
        radial-gradient(52% 40% at ${84 - eased * 30}% ${y2}%, ${pal.b}, transparent 72%),
        radial-gradient(80% 55% at 50% ${40 + eased * 20}%, ${pal.c}, transparent 78%)`

      ctx.clearRect(0, 0, width, height)

      // drifting dust with depth parallax — scroll pushes nearer motes faster
      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i]
        const speed = p.z
        const drift = Math.sin(t * 0.22 * p.drift + p.phase) * 10 * speed
        const rise = (t * 7 * speed) % (height + 120)
        const px = p.x * width + drift
        let py = p.y * height - rise - eased * 90 * speed
        py = ((py % height) + height) % height

        const alpha = (0.10 + p.z * 0.30) * (lowPower ? 0.8 : 1)
        const radius = p.r * (0.7 + p.z * 1.5)

        const tint =
          pal.dust === 'signal'
            ? `rgba(255,120,90,${alpha.toFixed(3)})`
            : pal.dust === 'mixed'
              ? `rgba(226,206,168,${alpha.toFixed(3)})`
              : `rgba(233,205,150,${alpha.toFixed(3)})`

        ctx.beginPath()
        ctx.fillStyle = tint
        ctx.arc(px, py, radius, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    raf = requestAnimationFrame(draw)

    const onVisibility = () => {
      if (document.hidden) {
        running = false
        cancelAnimationFrame(raf)
      } else if (!running) {
        running = true
        last = 0
        raf = requestAnimationFrame(draw)
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* colour field — the part that reads as "the background changes as you scroll" */}
      <div
        ref={hazeRef}
        className="absolute inset-0 opacity-90 transition-none will-change-[background]"
        style={{
          background: `radial-gradient(60% 45% at 20% 12%, ${PALETTES[0].a}, transparent 70%),
            radial-gradient(55% 40% at 82% 78%, ${PALETTES[1].a}, transparent 72%)`,
        }}
      />
      {/* dust */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {/* legibility wash + edge vignette so type always stays readable */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,7,0.55)_0%,rgba(8,8,7,0.10)_28%,rgba(8,8,7,0.10)_72%,rgba(8,8,7,0.62)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_50%,transparent_45%,rgba(8,8,7,0.55)_100%)]" />
    </div>
  )
}
