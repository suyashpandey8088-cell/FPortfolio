import { useEffect } from 'react'
import type Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SCENES } from '../content/site'

/**
 * GSAP's ESM interop cannot register plugins at module scope — in Node (SSR,
 * tests) the default export is not the configured instance. Defer to first use
 * in the browser only, and make it idempotent.
 */
let registered = false
export function ensureGsap() {
  if (registered || typeof window === 'undefined') return
  gsap.registerPlugin(ScrollTrigger)
  registered = true
}

/**
 * useScrollScenes — the colour engine.
 *
 * Each section carries `data-scene="<id>"`. As a scene reaches the upper third
 * of the viewport, the document's `--scene-bg` / `--scene-fg` / `--scene-accent`
 * variables are written, and every `.scene` element cross-fades to the new
 * identity via CSS transition. This is what makes the page change colour as you
 * scroll without a single hard cut.
 *
 * Returns the Lenis instance is handled elsewhere; this hook only owns colour.
 */
export function useScrollScenes(enabled = true) {
  useEffect(() => {
    if (!enabled) return
    ensureGsap()
    const root = document.documentElement
    const byId = new Map(SCENES.map((scene) => [scene.id, scene]))
    const nodes = [...document.querySelectorAll<HTMLElement>('[data-scene]')]
    if (!nodes.length) return

    const apply = (id: string) => {
      const scene = byId.get(id)
      if (!scene) return
      if (root.dataset.scene === id) return
      root.dataset.scene = id
      root.style.setProperty('--scene-bg', scene.bg)
      root.style.setProperty('--scene-fg', scene.fg)
      root.style.setProperty('--scene-accent', scene.accent)
    }

    apply(nodes[0].dataset.scene || SCENES[0].id)

    const triggers = nodes.map((node) =>
      ScrollTrigger.create({
        trigger: node,
        start: 'top 40%',
        end: 'bottom 40%',
        onEnter: () => apply(node.dataset.scene as string),
        onEnterBack: () => apply(node.dataset.scene as string),
      }),
    )

    return () => triggers.forEach((trigger) => trigger.kill())
  }, [enabled])
}

/**
 * Keeps GSAP's ScrollTrigger in step with Lenis.
 *
 * Lenis owns the scroll position, so ScrollTrigger must be told to update on
 * every Lenis frame rather than relying on native scroll events — otherwise
 * pinned sections drift by a few pixels and choreography lands late.
 */
export function useScrollTriggerSync(lenis: Lenis | null) {
  useEffect(() => {
    if (!lenis) return
    ensureGsap()
    ScrollTrigger.refresh()

    /* Lenis already owns its own RAF loop (see useSmoothScroll), so we only
       need to tell ScrollTrigger to re-evaluate on each Lenis scroll event. */
    const update = () => ScrollTrigger.update()
    lenis.on('scroll', update)
    gsap.ticker.lagSmoothing(0)

    const onResize = () => ScrollTrigger.refresh()
    window.addEventListener('resize', onResize)
    document.fonts?.ready.then(() => ScrollTrigger.refresh())

    return () => {
      lenis.off('scroll', update)
      window.removeEventListener('resize', onResize)
    }
  }, [lenis])
}

export { gsap, ScrollTrigger }
