import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { identity } from '../content/site'
import { useJumpTo } from './kit'

const LINKS = [
  { id: 'about', label: 'About' },
  { id: 'expertise', label: 'Expertise' },
  { id: 'projects', label: 'Projects' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'experience', label: 'Experience' },
  { id: 'toolkit', label: 'Toolkit' },
  { id: 'contact', label: 'Contact' },
]

/**
 * Nav — the scroll-responsive control strip. Hidden during the hero so the
 * opening lands clean, then slides in. Keeps the current scene's accent colour
 * so it always belongs to the section it is floating over.
 */
export default function Nav() {
  const [shown, setShown] = useState(false)
  const [open, setOpen] = useState(false)
  const [scene, setScene] = useState('hero')
  const jump = useJumpTo()

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.7)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setScene(document.documentElement.dataset.scene || 'hero')
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-scene'] })
    return () => observer.disconnect()
  }, [])

  const dark = scene === 'about' || scene === 'experience'

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: shown ? 0 : -80, opacity: shown ? 1 : 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-[120] ${shown ? '' : 'pointer-events-none'}`}
      >
        <div
          className={`flex items-center justify-between gap-4 px-5 py-3 md:px-8 ${
            dark ? 'text-ink' : 'text-cream'
          }`}
        >
          <button
            type="button"
            onClick={() => jump('top')}
            className="font-display text-[13px] font-bold uppercase tracking-[0.12em]"
          >
            Deleena V.
          </button>

          <nav className="hidden items-center gap-5 lg:flex">
            {LINKS.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => jump(link.id)}
                className="draw-line relative font-mono text-[9px] uppercase tracking-[0.22em] opacity-70 transition-opacity hover:opacity-100"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={`mailto:${identity.email}`}
              className={`hidden font-mono text-[9px] uppercase tracking-[0.22em] opacity-70 hover:opacity-100 sm:block ${
                dark ? 'text-ink' : 'text-cream'
              }`}
            >
              Hire me
            </a>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-label="Menu"
              aria-expanded={open}
              className={`grid h-9 w-9 place-items-center border lg:hidden ${
                dark ? 'border-ink/30' : 'border-cream/30'
              }`}
            >
              <span className="flex flex-col gap-[3px]">
                <span className={`block h-[1.5px] w-4 ${dark ? 'bg-ink' : 'bg-cream'}`} />
                <span className={`block h-[1.5px] w-4 ${dark ? 'bg-ink' : 'bg-cream'}`} />
                <span className={`block h-[1.5px] w-2.5 ${dark ? 'bg-ink' : 'bg-cream'}`} />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* mobile sheet */}
      <motion.div
        initial={false}
        animate={{ y: open ? 0 : '-100%' }}
        transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
        className="fixed inset-0 z-[110] bg-ink px-6 pb-10 pt-24 text-cream lg:hidden"
      >
        <div className="flex flex-col">
          {LINKS.map((link, index) => (
            <button
              key={link.id}
              type="button"
              onClick={() => {
                setOpen(false)
                window.setTimeout(() => jump(link.id), 260)
              }}
              className="flex items-baseline justify-between border-b border-cream/15 py-4 text-left"
            >
              <span className="font-display text-[clamp(1.9rem,9vw,3rem)] font-bold uppercase leading-none tracking-tightest">
                {link.label}
              </span>
              <span className="font-mono text-[9px] opacity-50">0{index + 1}</span>
            </button>
          ))}
        </div>
        <p className="mt-8 font-mono text-[9px] uppercase tracking-[0.24em] opacity-50">
          {identity.location}
        </p>
      </motion.div>
    </>
  )
}
