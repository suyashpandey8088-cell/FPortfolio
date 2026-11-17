import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { useContent, useLockBody } from '../store/content'

const EASE = [0.16, 1, 0.3, 1] as const

export default function FullscreenViewer() {
  const { viewer, closeViewer, stepViewer } = useContent()
  useLockBody(Boolean(viewer))

  useEffect(() => {
    if (!viewer) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeViewer()
      if (event.key === 'ArrowRight') stepViewer(1)
      if (event.key === 'ArrowLeft') stepViewer(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [viewer, closeViewer, stepViewer])

  const item = viewer?.items[viewer.index]
  const isSignal = item?.accent === 'signal'
  const ratioClass =
    item?.ratio === 'story' ? 'aspect-[9/16] h-[76vh] w-auto' : 'aspect-[4/5] h-auto max-h-[70vh] w-auto'

  return (
    <AnimatePresence>
      {viewer && item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.32 }}
          className="fixed inset-0 z-[100] flex flex-col bg-black/90 backdrop-blur-2xl"
          role="dialog"
          aria-modal="true"
          aria-label={item.title}
        >
          {/* top bar */}
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
            <div className="flex items-center gap-3">
              <span
                className={`grid h-8 w-8 place-items-center rounded-full border ${
                  isSignal ? 'border-signal/50 text-signal' : 'border-gold/50 text-gold'
                }`}
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                </svg>
              </span>
              <div>
                <p className="text-[12px] font-semibold text-white">{item.handle}</p>
                <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/40">
                  {item.type} · {String(viewer.index + 1).padStart(2, '0')} / {String(viewer.items.length).padStart(2, '0')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={item.href}
                target="_blank"
                rel="noreferrer noopener"
                className={`hidden rounded-full border px-3 py-1.5 font-mono text-[8.5px] uppercase tracking-[0.18em] transition-colors sm:block ${
                  isSignal
                    ? 'border-signal/40 text-signal hover:bg-signal/15'
                    : 'border-gold/40 text-gold hover:bg-gold/15'
                }`}
              >
                Open profile ↗
              </a>
              <button
                type="button"
                onClick={closeViewer}
                aria-label="Close preview"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/20 text-white/70 transition-colors hover:border-white hover:text-white"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* body */}
          <div className="relative flex flex-1 items-center justify-center gap-4 overflow-hidden px-3 py-5 md:px-8">
            <button
              type="button"
              onClick={() => stepViewer(-1)}
              aria-label="Previous item"
              className="absolute left-2 z-10 grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/40 text-white/70 backdrop-blur transition-colors hover:border-white hover:text-white md:left-6"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9">
                <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className="flex h-full w-full max-w-6xl flex-col items-center justify-center gap-5 lg:flex-row lg:items-center">
              <motion.div
                key={item.image + viewer.index}
                initial={{ opacity: 0, scale: 0.955, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.5, ease: EASE }}
                className={`relative overflow-hidden rounded-sm ring-1 ring-white/15 ${
                  item.ratio === 'story' ? 'h-[68vh] aspect-[9/16]' : 'max-h-[68vh] aspect-[4/5]'
                }`}
              >
                <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              </motion.div>

              <div className="w-full max-w-sm shrink-0 lg:w-80">
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: 14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.08, ease: EASE }}
                >
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[7.5px] uppercase tracking-[0.18em] ${
                      isSignal ? 'border-signal/45 text-signal' : 'border-gold/45 text-gold'
                    }`}
                  >
                    <span className={`h-1 w-1 rounded-full ${isSignal ? 'bg-signal' : 'bg-gold'}`} />
                    {item.type}
                  </span>
                  <h3 className="mt-3 text-[clamp(1.2rem,2.4vw,1.7rem)] font-semibold leading-tight text-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[12.5px] leading-relaxed text-white/55">{item.caption}</p>
                  {item.tags && (
                    <p className="mt-3 font-mono text-[9.5px] leading-relaxed text-white/30">{item.tags}</p>
                  )}
                  <div className="mt-5 border-t border-white/10 pt-4">
                    <div className="flex items-center gap-4 text-white/45">
                      <span className="flex items-center gap-1.5">
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                          <path d="M12 20s-7-4.4-7-9.3A4.1 4.1 0 0 1 12 7.8a4.1 4.1 0 0 1 7 2.9c0 4.9-7 9.3-7 9.3Z" />
                        </svg>
                        <span className="font-mono text-[9px]">—</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                          <path d="M21 12a8.5 8.5 0 0 1-12.5 7.5L3 21l1.5-5.4A8.5 8.5 0 1 1 21 12Z" />
                        </svg>
                        <span className="font-mono text-[9px]">—</span>
                      </span>
                      <svg viewBox="0 0 24 24" className="ml-auto h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <path d="M6 3h12v18l-6-4.5L6 21z" />
                      </svg>
                    </div>
                    <p className="mt-2 font-mono text-[7.5px] uppercase tracking-[0.16em] text-white/25">
                      Engagement figures withheld until verified
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => stepViewer(1)}
              aria-label="Next item"
              className="absolute right-2 z-10 grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/40 text-white/70 backdrop-blur transition-colors hover:border-white hover:text-white md:right-6"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9">
                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* thumbnails */}
          <div className="scrollbar-none flex items-center gap-1.5 overflow-x-auto border-t border-white/10 px-4 py-3">
            {viewer.items.map((thumb, index) => (
              <button
                key={index}
                type="button"
                onClick={() => stepViewer(index - viewer.index)}
                aria-label={`Go to ${thumb.title}`}
                className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-sm ring-1 transition-all ${
                  index === viewer.index
                    ? isSignal
                      ? 'ring-2 ring-signal opacity-100'
                      : 'ring-2 ring-gold opacity-100'
                    : 'ring-white/15 opacity-45 hover:opacity-80'
                }`}
              >
                <img src={thumb.image} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
            <span className="ml-auto hidden shrink-0 pl-4 font-mono text-[8px] uppercase tracking-[0.18em] text-white/25 sm:block">
              ← → to browse · esc to close
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
