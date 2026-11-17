import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'

let instance: Lenis | null = null

type Listener = (lenis: Lenis | null) => void
const listeners = new Set<Listener>()

/** React-facing hook: the live Lenis instance, or null while it boots. */
export function useLenis() {
  const [lenis, setLenis] = useState<Lenis | null>(() => instance)
  useEffect(() => {
    const listener: Listener = (next) => setLenis(next)
    listeners.add(listener)
    listener(instance)
    return () => {
      listeners.delete(listener)
    }
  }, [])
  return lenis
}

/** Respect the OS reduced-motion setting — no inertia smoothing at all. */
function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/**
 * Coarse pointers (phones/tablets) get a gentler curve so the page keeps up with
 * the thumb; fine pointers (mouse/trackpad) get a slightly longer glide.
 */
function isCoarsePointer() {
  return typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
}

export function useSmoothScroll() {
  const ref = useRef<Lenis | null>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return

    const coarse = isCoarsePointer()

    const lenis = new Lenis({
      // wheel/trackpad
      lerp: coarse ? 0.115 : 0.09,
      wheelMultiplier: coarse ? 1 : 0.95,
      smoothWheel: true,
      // touch — without syncTouch, Lenis leaves touch scrolling to the browser,
      // which is why mobile previously felt unsmoothed.
      syncTouch: true,
      syncTouchLerp: 0.075,
      touchInertiaExponent: coarse ? 1.9 : 1.7,
      touchMultiplier: 1,
      // keep keyboard/scrollbar semantics predictable
      gestureOrientation: 'vertical',
      autoRaf: false,
    })

    ref.current = lenis
    instance = lenis
    // notify subscribers (ScrollTrigger sync) that Lenis now owns the scroll
    listeners.forEach((listener) => listener(lenis))

    let frame = 0
    let running = true

    const raf = (time: number) => {
      if (!running) return
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    // Pause the loop when the tab is hidden — saves battery, avoids a jump on return.
    const onVisibility = () => {
      if (document.hidden) {
        running = false
        cancelAnimationFrame(frame)
      } else if (!running) {
        running = true
        lenis.resize()
        frame = requestAnimationFrame(raf)
      }
    }
    // Re-measure on resize/orientation change so sticky sections and the
    // horizontal rail keep correct limits after the mobile URL bar resizes.
    const onResize = () => lenis.resize()

    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)

    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
      running = false
      cancelAnimationFrame(frame)
      lenis.destroy()
      ref.current = null
      instance = null
      listeners.forEach((listener) => listener(null))
    }
  }, [])

  return ref
}

/** Programmatic scroll that goes through Lenis when it is active. */
export function scrollToId(id: string, offset = 0) {
  const el = document.getElementById(id)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - offset
  if (instance) {
    instance.scrollTo(top, { duration: prefersReducedMotion() ? 0 : 1.1 })
    return
  }
  window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
}

/** Delegates to the active Lenis instance, so anchors and the top button stay smooth. */
export function scrollToTop() {
  if (instance) {
    instance.scrollTo(0, { duration: prefersReducedMotion() ? 0 : 1.1 })
    return
  }
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
}

export function getLenis() {
  return instance
}
