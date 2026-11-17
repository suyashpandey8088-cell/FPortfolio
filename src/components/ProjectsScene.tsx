import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { X, ArrowUpRight } from 'lucide-react'
import { projects, type Project } from '../content/site'
import { GiantType, SceneIndex, Star, Sticker } from './kit'
import { gsap, ScrollTrigger, ensureGsap } from '../hooks/useScrollScenes'

/**
 * Projects — a pinned horizontal gallery.
 *
 * Desktop/fine-pointer: the section pins and vertical scroll drives the track
 * sideways through six project plates. Touch and reduced-motion devices get a
 * native horizontal scroller instead — pinned hijacking on a thumb is a
 * usability tax, and the brief explicitly forbids forced page overflow.
 *
 * Clicking a plate opens the case study overlay.
 */
export default function ProjectsScene() {
  const wrap = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState<Project | null>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const pinNode = wrap.current
    const trackNode = track.current
    if (!pinNode || !trackNode) return

    const fine = window.matchMedia('(pointer: fine)').matches
    const wide = window.matchMedia('(min-width: 1024px)').matches
    if (!fine || !wide) return

    ensureGsap()
    const ctx = gsap.context(() => {
      const distance = () => trackNode.scrollWidth - window.innerWidth

      gsap.to(trackNode, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: pinNode,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      })
    }, pinNode)

    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('resize', refresh)
    document.fonts?.ready.then(refresh)

    return () => {
      window.removeEventListener('resize', refresh)
      ctx.revert()
    }
  }, [reduced])

  return (
    <>
      <section
        id="projects"
        data-scene="projects"
        aria-label="Projects"
        ref={wrap}
        className="scene relative overflow-hidden"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="halftone absolute right-0 top-0 h-[30vh] w-[38vw] text-cream/10" />
          <Star size={90} className="absolute left-[6%] top-[16%] text-neon/70 animate-spin-slow" />
        </div>

        <div className="relative flex min-h-[100dvh] flex-col justify-center py-14 md:py-0">
          <div className="mx-auto w-full max-w-[1500px] px-5 md:px-10">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <SceneIndex n="03" title="The visual playground" />
                <GiantType as="h2" className="mt-6 text-[clamp(2.4rem,7.5vw,6.4rem)] uppercase">
                  SIX <span className="font-sherif italic lowercase tracking-normal">ways</span> TO
                  <br />
                  <span className="text-neon">PLAY.</span>
                </GiantType>
              </div>
              <div className="flex max-w-[26ch] flex-col gap-3 pb-2">
                <p className="font-mono text-[9px] uppercase leading-relaxed tracking-[0.2em] opacity-60">
                  Scroll sideways. Open any plate for the full case study.
                </p>
                <Sticker color="bg-neon" text="text-ink" rotate={3}>
                  Scroll → to travel
                </Sticker>
              </div>
            </div>
          </div>

          {/* the travelling track */}
          <div className="mt-8 w-full">
            <div
              ref={track}
              className="flex gap-5 overflow-x-auto px-5 pb-4 md:overflow-visible md:px-10 lg:cursor-grab [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {projects.map((project) => (
                <ProjectPlate key={project.id} project={project} onOpen={() => setOpen(project)} />
              ))}
              <EndPlate />
            </div>
          </div>
        </div>
      </section>

      <CaseStudyOverlay project={open} onClose={() => setOpen(null)} />
    </>
  )
}

function ProjectPlate({ project, onOpen }: { project: Project; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative w-[82vw] shrink-0 text-left sm:w-[58vw] md:w-[44vw] lg:w-[34vw]"
      style={{ color: '#FBF4E2' }}
    >
      <div
        className="relative overflow-hidden border border-cream/20"
        style={{ backgroundColor: project.bg }}
      >
        {/* image, zooming on hover */}
        <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[3/4]">
          <img
            src={project.images[0]}
            alt={project.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-swift group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />

          {/* index + year */}
          <div className="absolute left-4 top-3 flex items-center gap-3">
            <span className="font-mono text-[10px] tracking-[0.28em] opacity-90">{project.index}</span>
            <span className="h-px w-8" style={{ backgroundColor: project.accent }} />
            <span className="font-mono text-[10px] tracking-[0.24em] opacity-70">{project.year}</span>
          </div>

          <div
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full text-ink transition-transform duration-500 group-hover:rotate-45"
            style={{ backgroundColor: project.accent }}
          >
            <ArrowUpRight className="h-4 w-4" />
          </div>

          {/* title over the image */}
          <div className="absolute inset-x-0 bottom-0 p-4">
            <p className="font-mono text-[8.5px] uppercase tracking-[0.24em] opacity-70">
              {project.category}
            </p>
            <h3 className="mt-1.5 font-display text-[clamp(1.2rem,2.6vw,2rem)] font-bold uppercase leading-[0.95] tracking-tighter2">
              {project.title}
            </h3>
          </div>
        </div>
      </div>

      <p className="mt-3 line-clamp-2 max-w-[38ch] font-mono text-[9px] uppercase leading-relaxed tracking-[0.14em] opacity-55">
        {project.blurb}
      </p>
    </button>
  )
}

function EndPlate() {
  return (
    <div className="flex w-[70vw] shrink-0 flex-col justify-center gap-4 px-4 sm:w-[40vw] lg:w-[26vw]">
      <Star size={44} className="text-neon" />
      <p className="font-display text-[clamp(1.4rem,3vw,2.4rem)] font-bold uppercase leading-[0.95] tracking-tighter2">
        And the next one is yours.
      </p>
      <a
        href="#contact"
        className="inline-flex w-fit items-center gap-2 border border-cream/40 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.2em] transition-colors hover:bg-neon hover:text-ink"
      >
        Start something <ArrowUpRight className="h-3.5 w-3.5" />
      </a>
    </div>
  )
}

/* ── case study overlay ──────────────────────────────────────────────────── */

function CaseStudyOverlay({ project, onClose }: { project: Project | null; onClose: () => void }) {
  useEffect(() => {
    if (!project) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
    }
  }, [project, onClose])

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[180] overflow-y-auto bg-ink text-cream"
          role="dialog"
          aria-modal="true"
          aria-label={project.title}
        >
          <motion.div
            initial={{ y: 40 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="min-h-full"
          >
            {/* header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-cream/15 bg-ink/90 px-5 py-3 backdrop-blur-md md:px-10">
              <span className="font-mono text-[9px] uppercase tracking-[0.28em] opacity-60">
                Case study — {project.index}
              </span>
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-2 border border-cream/30 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.2em] transition-colors hover:bg-cream hover:text-ink"
              >
                Close <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="mx-auto max-w-[1200px] px-5 py-10 md:px-10 md:py-16">
              <p className="font-mono text-[9px] uppercase tracking-[0.26em] opacity-60">
                {project.category} · {project.year}
              </p>
              <h2 className="mt-4 font-display text-[clamp(2.2rem,7vw,5.4rem)] font-bold uppercase leading-[0.88] tracking-tightest">
                {project.title}
              </h2>
              <p className="mt-6 max-w-[54ch] font-sherif text-[clamp(1.1rem,2vw,1.5rem)] leading-[1.4]">
                {project.blurb}
              </p>

              {/* image sequence */}
              <div className="mt-10 grid gap-4 md:grid-cols-3">
                {project.images.map((src, index) => (
                  <motion.figure
                    key={src}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-10%' }}
                    transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    className={index === 0 ? 'md:col-span-2' : ''}
                  >
                    <img
                      src={src}
                      alt={`${project.title} — frame ${index + 1}`}
                      loading="lazy"
                      className="block w-full object-cover"
                      style={{ borderTop: `3px solid ${project.accent}` }}
                    />
                  </motion.figure>
                ))}
              </div>

              {/* process + outcome */}
              <div className="mt-12 grid gap-10 border-t border-cream/15 pt-8 md:grid-cols-12">
                <div className="md:col-span-6">
                  <h3 className="font-mono text-[9px] uppercase tracking-[0.28em] opacity-55">
                    Process
                  </h3>
                  <ol className="mt-4 flex flex-col">
                    {project.process.map((step, index) => (
                      <li
                        key={step}
                        className="flex items-baseline gap-4 border-b border-cream/10 py-3"
                      >
                        <span className="font-mono text-[9px] opacity-45">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="font-display text-[clamp(1rem,1.8vw,1.3rem)] font-bold leading-tight">
                          {step}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="md:col-span-5 md:col-start-8">
                  <h3 className="font-mono text-[9px] uppercase tracking-[0.28em] opacity-55">
                    Outcome
                  </h3>
                  <p
                    className="mt-4 border-l-2 pl-4 font-sherif text-[clamp(1.05rem,1.8vw,1.35rem)] italic leading-[1.5]"
                    style={{ borderColor: project.accent }}
                  >
                    {project.outcome}
                  </p>
                  {project.video && (
                    <p className="mt-6 font-mono text-[9px] uppercase tracking-[0.2em] opacity-50">
                      Video available — see the edit reel
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
