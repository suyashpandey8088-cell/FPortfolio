import { useEffect, useRef } from 'react'

/**
 * ScrollContinuum — the page's world. Expressive edition.
 *
 * Reads the page as an ordered sequence of chapters (`data-chapter`), each of
 * which owns a *mood*: a brand colour, a hue wash, contour energy and dust
 * character. Between chapters the world interpolates continuously, and every
 * chapter boundary fires a one-shot *event* — a horizon bloom, a contour snap
 * and a dust burst — so crossing a section is something you feel.
 *
 * Layers, back to front:
 *   1. aura     — two huge drifting colour fields (brand committed)
 *   2. contour  — warped bands + mirrored ghost, whip hard on velocity
 *   3. far dust — sparse specks, parallax
 *   4. bokeh    — near-field blurred orbs, real foreground depth
 *   5. horizon  — glowing seam that flares at chapter boundaries
 *
 * Engineering: one passive frame-throttled scroll read, one RAF loop, chapter
 * bands measured on layout change only (+ once after fonts settle), reduced
 * motion → static per-chapter gradient with no canvas, low-power → far fewer
 * particles at ~30fps, loop paused on visibilitychange.
 */

type Dust = 'gold' | 'signal' | 'steel' | 'mixed'

type Mood = {
  /** brand hue that leads the chapter */
  key: string
  /** secondary hue pulled alongside it */
  alt: string
  a: string
  b: string
  c: string
  dust: Dust
  density: number
  contour: number
  speed: number
  label: string
  /** 0..1 — how strongly this chapter commits to its colour */
  commit: number
}

const MOODS: Record<string, Mood> = {
  hero: {
    key: '236,196,124', alt: '150,110,52',
    a: 'rgba(236,196,124,0.42)', b: 'rgba(150,110,52,0.30)', c: 'rgba(255,240,214,0.12)',
    dust: 'gold', density: 0.5, contour: 0.4, speed: 0.6, label: 'Opening', commit: 0.55,
  },
  intro: {
    key: '244,204,132', alt: '166,124,58',
    a: 'rgba(244,204,132,0.44)', b: 'rgba(166,124,58,0.32)', c: 'rgba(255,232,190,0.13)',
    dust: 'gold', density: 0.66, contour: 0.58, speed: 0.72, label: 'The work', commit: 0.6,
  },
  tunnel: {
    key: '255,158,64', alt: '255,58,33',
    a: 'rgba(255,158,64,0.5)', b: 'rgba(255,58,33,0.34)', c: 'rgba(255,220,168,0.15)',
    dust: 'mixed', density: 1, contour: 0.92, speed: 1.3, label: 'The tunnel', commit: 0.9,
  },
  padma: {
    key: '232,178,86', alt: '120,84,30',
    a: 'rgba(232,178,86,0.54)', b: 'rgba(120,84,30,0.34)', c: 'rgba(255,226,170,0.16)',
    dust: 'gold', density: 0.78, contour: 0.55, speed: 0.62, label: 'Padma Jewels', commit: 0.92,
  },
  'padma-study': {
    key: '206,166,104', alt: '96,74,42',
    a: 'rgba(206,166,104,0.34)', b: 'rgba(96,74,42,0.26)', c: 'rgba(244,228,198,0.10)',
    dust: 'gold', density: 0.44, contour: 0.36, speed: 0.42, label: 'Padma — case study', commit: 0.68,
  },
  combat: {
    key: '255,58,33', alt: '120,18,8',
    a: 'rgba(255,58,33,0.5)', b: 'rgba(120,18,8,0.4)', c: 'rgba(255,152,120,0.15)',
    dust: 'signal', density: 0.92, contour: 0.72, speed: 1.15, label: 'Combat Crew 25', commit: 0.95,
  },
  'combat-study': {
    key: '214,110,88', alt: '74,34,30',
    a: 'rgba(214,110,88,0.34)', b: 'rgba(74,34,30,0.28)', c: 'rgba(236,222,218,0.10)',
    dust: 'signal', density: 0.44, contour: 0.34, speed: 0.42, label: 'Combat — case study', commit: 0.7,
  },
  close: {
    key: '178,186,200', alt: '86,74,54',
    a: 'rgba(178,186,200,0.28)', b: 'rgba(86,74,54,0.24)', c: 'rgba(226,206,160,0.10)',
    dust: 'steel', density: 0.34, contour: 0.3, speed: 0.36, label: 'Closing', commit: 0.45,
  },
}

const FALLBACK = MOODS.close

function moodFor(name: string): Mood {
  return MOODS[name] ?? FALLBACK
}

const rgb = (value: string) => value.split(',').map((n) => parseFloat(n.trim()))

function mixRgb(from: string, to: string, t: number) {
  const [r1, g1, b1] = rgb(from)
  const [r2, g2, b2] = rgb(to)
  const n = (x: number, y: number) => Math.round(x + (y - x) * t)
  return `${n(r1, r2)},${n(g1, g2)},${n(b1, b2)}`
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
    ? `rgba(255,128,96,${alpha.toFixed(3)})`
    : dust === 'steel'
      ? `rgba(206,212,224,${alpha.toFixed(3)})`
      : dust === 'mixed'
        ? `rgba(246,222,182,${alpha.toFixed(3)})`
        : `rgba(240,212,154,${alpha.toFixed(3)})`

const smoothstep = (t: number) => {
  const x = Math.min(1, Math.max(0, t))
  return x * x * (3 - 2 * x)
}

type Band = { name: string; start: number; end: number }
type Mote = { x: number; y: number; z: number; r: number; drift: number; phase: number }

export default function ScrollContinuum() {
  const auraRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chapterRef = useRef<HTMLSpanElement>(null)
  const railRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const aura = auraRef.current
    const canvas = canvasRef.current
    if (!aura || !canvas) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

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

    const moodAt = (position: number) => {
      if (!bands.length) return FALLBACK
      const index = Math.max(0, Math.min(bands.length - 1, Math.floor(position)))
      const nextIndex = Math.min(bands.length - 1, index + 1)
      const t = smoothstep(position - index)
      const from = moodFor(bands[index].name)
      const to = moodFor(bands[nextIndex].name)
      return {
        a: mix(from.a, to.a, t),
        b: mix(from.b, to.b, t),
        c: mix(from.c, to.c, t),
        key: mixRgb(from.key, to.key, t),
        alt: mixRgb(from.alt, to.alt, t),
        dust: t < 0.5 ? from.dust : to.dust,
        density: from.density + (to.density - from.density) * t,
        contour: from.contour + (to.contour - from.contour) * t,
        speed: from.speed + (to.speed - from.speed) * t,
        commit: from.commit + (to.commit - from.commit) * t,
        label: t < 0.5 ? from.label : to.label,
      }
    }

    measure()

    /* ── reduced motion: strong static colour per chapter, no canvas ──────── */
    if (reduced) {
      const paint = () => {
        const w = moodAt(chapterPosition(window.scrollY))
        aura.style.background = `radial-gradient(70% 52% at 24% 16%, ${w.a}, transparent 70%),
          radial-gradient(62% 48% at 78% 80%, ${w.b}, transparent 72%)`
        if (chapterRef.current) chapterRef.current.textContent = w.label
      }
      const onResize = () => {
        measure()
        paint()
      }
      window.addEventListener('scroll', paint, { passive: true })
      window.addEventListener('resize', onResize)
      paint()
      return () => {
        window.removeEventListener('scroll', paint)
        window.removeEventListener('resize', onResize)
      }
    }

    /* ── canvas ───────────────────────────────────────────────────────────── */
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

    const maxMotes = lowPower ? 42 : 110
    const maxBokeh = lowPower ? 5 : 12

    const motes: Mote[] = Array.from({ length: maxMotes }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: 0.15 + Math.random() * 0.85,
      r: 0.6 + Math.random() * 2.2,
      drift: 0.4 + Math.random() * 1.3,
      phase: Math.random() * Math.PI * 2,
    }))

    const bokeh: Mote[] = Array.from({ length: maxBokeh }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: 0.7 + Math.random() * 0.3,
      r: 26 + Math.random() * 72,
      drift: 0.2 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
    }))

    /* ── scroll sampling ──────────────────────────────────────────────────── */
    let scrollY = window.scrollY
    let target = chapterPosition(scrollY)
    let position = target
    let velocity = 0
    let smoothVelocity = 0
    let ticking = false
    let lastChapter = Math.round(target)
    let burst = 0

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
      position += (target - position) * 0.1
      smoothVelocity += (velocity - smoothVelocity) * 0.16
      velocity *= 0.86

      /* chapter boundary → fire a bloom + burst */
      const nearest = Math.round(position)
      if (nearest !== lastChapter) {
        lastChapter = nearest
        burst = 1
      }
      burst *= 0.94

      const mood = moodAt(position)
      const energy = Math.min(1, Math.abs(smoothVelocity) / 30)

      /* 1. aura — two huge fields sliding, colour committed to the chapter */
      const driftX = Math.sin(clock * 0.16 * mood.speed) * 6
      const driftY = Math.cos(clock * 0.11 * mood.speed) * 4
      aura.style.background = `radial-gradient(${64 + mood.commit * 14}% ${50 + mood.commit * 10}% at ${
        22 + position * 5 + driftX
      }% ${12 + (position % 1) * 26 + driftY}%, ${mood.a}, transparent 68%),
        radial-gradient(${56 + mood.commit * 12}% ${44 + mood.commit * 8}% at ${
          80 - position * 4 - driftX
        }% ${84 - (position % 1) * 22 - driftY}%, ${mood.b}, transparent 70%),
        radial-gradient(90% 62% at 50% ${42 + (position % 1) * 18}%, ${mood.c}, transparent 82%)`

      ctx.clearRect(0, 0, width, height)

      /* 2. contour — warped bands, ghosted mirror, whipping on velocity */
      const amplitude = (34 + mood.contour * 118) * (1 + energy * 1.4 + burst * 0.7)
      const lines = lowPower ? 3 : 6
      const steps = lowPower ? 7 : 12
      for (let line = 0; line < lines; line += 1) {
        const yBase = height * (0.1 + line * 0.16) + Math.sin(clock * 0.34 + line) * 10
        const phase = clock * (0.2 + line * 0.06) * mood.speed + line * 1.7
        ctx.beginPath()
        for (let step = 0; step <= steps; step += 1) {
          const x = (step / steps) * width
          const wave =
            Math.sin((step / steps) * Math.PI * 2 + phase) * amplitude +
            Math.sin((step / steps) * Math.PI * 4.6 + phase * 1.7) * amplitude * 0.4
          const y = yBase + wave
          if (step === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        const gradient = ctx.createLinearGradient(0, 0, width, 0)
        const alpha = (0.16 + mood.contour * 0.2 + energy * 0.16) * (1 + burst * 0.8)
        gradient.addColorStop(0, dustColor(mood.dust, 0))
        gradient.addColorStop(0.5, dustColor(mood.dust, Math.min(0.7, alpha)))
        gradient.addColorStop(1, dustColor(mood.dust, 0))
        ctx.strokeStyle = gradient
        ctx.lineWidth = 1 + mood.contour * 1.6 + energy * 1.4
        ctx.stroke()

        /* ghost — brighter reflected band, sells the depth */
        if (!lowPower && line % 2 === 0) {
          ctx.save()
          ctx.globalAlpha = 0.4
          ctx.translate(0, height * 1.9)
          ctx.scale(1, -1)
          ctx.stroke()
          ctx.restore()
        }
      }

      /* 3. far dust */
      const activeMotes = Math.round(maxMotes * (0.4 + mood.density * 0.6))
      for (let i = 0; i < activeMotes; i += 1) {
        const p = motes[i]
        const drift = Math.sin(clock * 0.24 * p.drift + p.phase) * 16 * p.z
        const rise = (clock * 10 * p.z * mood.speed) % (height + 160)
        const px = p.x * width + drift
        let py = p.y * height - rise - position * 34 * p.z
        py = ((py % height) + height) % height

        const alpha = (0.14 + p.z * 0.4) * (lowPower ? 0.9 : 1)
        const radius = p.r * (0.7 + p.z * 1.6)
        const stretch = 1 + energy * 7 * p.z + burst * 2

        ctx.beginPath()
        ctx.fillStyle = dustColor(mood.dust, alpha)
        ctx.ellipse(px, py, radius, radius * stretch, 0, 0, Math.PI * 2)
        ctx.fill()
      }

      /* 4. bokeh — near-field foreground orbs, blurred and warm */
      const activeBokeh = Math.round(maxBokeh * (0.45 + mood.density * 0.55))
      for (let i = 0; i < activeBokeh; i += 1) {
        const b = bokeh[i]
        const drift = Math.sin(clock * 0.18 * b.drift + b.phase) * 44 * b.z
        const rise = (clock * 16 * b.z * mood.speed) % (height + 420)
        const bx = b.x * width + drift
        let by = b.y * height - rise - position * 90 * b.z
        by = ((by % height) + height) % height

        const glow = ctx.createRadialGradient(bx, by, 0, bx, by, b.r)
        glow.addColorStop(0, `rgba(${mood.key},${(0.1 + b.z * 0.1).toFixed(3)})`)
        glow.addColorStop(0.6, `rgba(${mood.alt},${(0.05 + b.z * 0.06).toFixed(3)})`)
        glow.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(bx, by, b.r, 0, Math.PI * 2)
        ctx.fill()
      }

      /* 5. horizon seam — flares at chapter boundaries */
      const seamY = height * (0.52 + Math.sin(clock * 0.16) * 0.05)
      const seam = ctx.createLinearGradient(0, 0, width, 0)
      const seamAlpha = 0.1 + burst * 0.65 + energy * 0.12
      seam.addColorStop(0, 'rgba(0,0,0,0)')
      seam.addColorStop(0.5, `rgba(${mood.key},${Math.min(0.85, seamAlpha).toFixed(3)})`)
      seam.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = seam
      const seamHeight = 1 + burst * 5
      ctx.fillRect(0, seamY - seamHeight / 2, width, seamHeight)

      if (burst > 0.04) {
        const flare = ctx.createRadialGradient(width / 2, seamY, 0, width / 2, seamY, width * 0.6)
        flare.addColorStop(0, `rgba(${mood.key},${(burst * 0.16).toFixed(3)})`)
        flare.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = flare
        ctx.fillRect(0, seamY - height * 0.4, width, height * 0.8)
      }

      /* HUD */
      if (chapterRef.current && mood.label !== lastLabel) {
        lastLabel = mood.label
        chapterRef.current.textContent = mood.label
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
          ref={auraRef}
          className="absolute inset-0"
          style={{
            background: `radial-gradient(70% 52% at 24% 16%, ${MOODS.hero.a}, transparent 70%),
              radial-gradient(62% 48% at 78% 80%, ${MOODS.hero.b}, transparent 72%)`,
          }}
        />
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
        {/*
          Legibility is now bought locally, not with a global scrim: only the
          extreme top/bottom edges darken so the header and footer stay readable
          while the middle of the page lets the world through.
        */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/70 via-ink/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" />
      </div>

      <div className="pointer-events-none fixed bottom-5 left-5 z-[70] hidden select-none items-center gap-3 md:flex">
        <div className="flex w-32 flex-col gap-1.5">
          <span className="font-mono text-[8px] uppercase tracking-[0.28em] text-bone/40">Chapter</span>
          <span
            ref={chapterRef}
            className="truncate font-mono text-[10px] uppercase tracking-[0.16em] text-bone/80"
          >
            Opening
          </span>
          <div className="h-px w-full bg-white/12">
            <div
              ref={railRef}
              className="h-px origin-left bg-gradient-to-r from-gold to-signal"
              style={{ transform: 'scaleX(0)' }}
            />
          </div>
        </div>
      </div>
    </>
  )
}
