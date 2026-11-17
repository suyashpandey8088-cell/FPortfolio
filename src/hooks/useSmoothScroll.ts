import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

let instance: Lenis | null = null

export function useSmoothScroll() {
  const ref = useRef<Lenis | null>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95, touchMultiplier: 1.5 })
    ref.current = lenis
    instance = lenis
    let frame = 0
    const raf = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
      ref.current = null
      instance = null
    }
  }, [])

  return ref
}

export function scrollToId(id: string, offset = 0) {
  const el = document.getElementById(id)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - offset
  if (instance) {
    instance.scrollTo(top, { duration: 1.4 })
    return
  }
  window.scrollTo({ top, behavior: 'smooth' })
}
