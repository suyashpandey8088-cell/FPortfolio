import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useContent, type ViewerItem } from '../store/content'
import { Reveal } from './primitives'
import { IgIcon } from './InstagramProfile'

type Card = ViewerItem & { label: string; name: string; index: number }

function ShowcaseCard({ card, onOpen }: { card: Card; onOpen: () => void }) {
  const isSignal = card.accent === 'signal'
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`group relative shrink-0 overflow-hidden rounded-sm border border-white/10 ${
        card.ratio === 'story'
          ? 'aspect-[9/14] w-[clamp(190px,18vw,270px)]'
          : card.index % 3 === 0
            ? 'aspect-[4/5] w-[clamp(215px,21vw,300px)]'
            : 'aspect-square w-[clamp(225px,22vw,315px)]'
      }`}
    >
      <img
        src={card.image}
        alt={card.title}
        loading="lazy"
        className="h-full w-full object-cover opacity-80 grayscale-[25%] transition-all duration-[1.4s] ease-swift group-hover:scale-[1.06] group-hover:opacity-100 group-hover:grayscale-0"
      />
      <span
        className={`absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${
          isSignal
            ? 'bg-gradient-to-t from-[#190402] via-[#190402]/20 to-transparent'
            : 'bg-gradient-to-t from-[#150e05] via-[#150e05]/20 to-transparent'
        }`}
      />
      <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/45 px-2 py-0.5 backdrop-blur-sm">
        <span className={`h-1 w-1 rounded-full ${isSignal ? 'bg-signal' : 'bg-gold'}`} />
        <span className="font-mono text-[7.5px] uppercase tracking-[0.16em] text-white/80">{card.type}</span>
      </span>
      <span className="absolute right-3 top-3 font-mono text-[9px] text-white/40">
        {String(card.index + 1).padStart(2, '0')}
      </span>
      <span className="absolute inset-x-0 bottom-0 translate-y-2 p-4 text-left opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
        <span className={`font-mono text-[8px] uppercase tracking-[0.2em] ${isSignal ? 'text-signal' : 'text-gold'}`}>
          {card.handle}
        </span>
        <span className="mt-1 block text-[13px] font-semibold leading-tight text-white">{card.title}</span>
        <span className="mt-1.5 line-clamp-2 block text-[10.5px] leading-snug text-white/55">{card.caption}</span>
      </span>
      <span className="absolute inset-x-0 bottom-0 p-3 transition-opacity duration-300 group-hover:opacity-0">
        <span className="flex items-center gap-1.5">
          <IgIcon name={card.type === 'Reel' ? 'play' : 'grid'} className="h-3 w-3 text-white/50" />
          <span className="truncate font-mono text-[8px] uppercase tracking-[0.16em] text-white/50">{card.label}</span>
        </span>
      </span>
    </button>
  )
}

export default function HorizontalShowcase() {
  const { content, openViewer } = useContent()
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [distance, setDistance] = useState(0)

  const cards: Card[] = content.accounts.flatMap((account) =>
    account.gallery.slice(0, 5).map((item, index) => ({
      image: item.image,
      type: item.type,
      title: item.title,
      caption: item.caption,
      tags: item.tags,
      href: item.url ?? account.url,
      handle: account.username,
      accent: account.id === 'combat' ? ('signal' as const) : ('gold' as const),
      label: account.name,
      name: account.name,
      index,
    })),
  )

  useEffect(() => {
    let lastWidth = -1
    const measure = () => {
      const width = trackRef.current?.scrollWidth ?? 0
      const next = Math.max(0, width - window.innerWidth + 80)
      // avoid churn: only update when the usable width actually changed, so the
      // mobile URL bar collapsing does not trigger a reflow every frame
      if (width === lastWidth) return
      lastWidth = width
      setDistance(next)
    }
    measure()
    const observer = new ResizeObserver(measure)
    if (trackRef.current) observer.observe(trackRef.current)
    window.addEventListener('resize', measure)
    window.addEventListener('orientationchange', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
      window.removeEventListener('orientationchange', measure)
    }
  }, [cards.length])

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance])

  const open = (index: number) => openViewer(cards, index)

  return (
    <section
      ref={sectionRef}
      id="showcase"
      className="relative hidden border-b border-white/10 bg-ash/65 md:block"
      style={{ height: `calc(100dvh + ${distance}px)` }}
    >
      <div className="sticky top-0 flex h-[100dvh] flex-col justify-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,rgba(217,174,98,0.10),transparent_58%)]" />

        <div className="relative mx-auto flex w-full max-w-[1600px] items-end justify-between px-6 pb-6 md:px-10">
          <Reveal>
            <p className="kicker flex items-center gap-3 text-bone/35">
              <span className="h-1 w-1 rounded-full bg-gold" />
              Both feeds, side by side
            </p>
            <h2 className="mt-3 max-w-md text-[clamp(1.4rem,2.6vw,2.2rem)] font-semibold uppercase leading-[1.05] tracking-tight text-bone">
              One manager. Two visual languages.
            </h2>
          </Reveal>
          <div className="hidden items-center gap-4 lg:flex">
            <p className="max-w-[16rem] text-right text-[11.5px] leading-relaxed text-bone/40">
              Scroll to move the rail. Hover a frame to read it; click to open the full preview.
            </p>
            <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-gold/70">
              Drag-free →
            </span>
          </div>
        </div>

        <motion.div ref={trackRef} style={{ x }} className="relative flex w-max items-center gap-3 px-6 will-change-transform md:px-10">
          {cards.map((card, index) => (
            <ShowcaseCard key={`${card.image}-${index}`} card={card} onOpen={() => open(index)} />
          ))}
          <div className="flex w-[26vw] shrink-0 flex-col justify-center pl-6">
            <p className="kicker text-bone/30">End of rail</p>
            <p className="mt-2 max-w-[16rem] text-sm leading-relaxed text-bone/50">
              Every frame here belongs to an account personally managed by Deleena Venkatesh.
            </p>
          </div>
        </motion.div>

        <div className="relative mx-auto mt-6 w-full max-w-[1600px] px-6 md:px-10">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10">
              <motion.div
                style={{ scaleX: scrollYProgress }}
                className="h-px origin-left bg-gradient-to-r from-gold to-signal"
              />
            </div>
            <span className="font-mono text-[8.5px] uppercase tracking-[0.2em] text-bone/25">
              {String(cards.length).padStart(2, '0')} frames
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export function MobileShowcase() {
  const { content, openViewer } = useContent()
  const cards: Card[] = content.accounts.flatMap((account) =>
    account.gallery.slice(0, 4).map((item, index) => ({
      image: item.image,
      type: item.type,
      title: item.title,
      caption: item.caption,
      tags: item.tags,
      href: item.url ?? account.url,
      handle: account.username,
      accent: account.id === 'combat' ? ('signal' as const) : ('gold' as const),
      label: account.name,
      name: account.name,
      index,
    })),
  )

  return (
    <section className="border-b border-white/10 bg-ash/65 py-12 md:hidden">
      <div className="px-6">
        <p className="kicker flex items-center gap-3 text-bone/35">
          <span className="h-1 w-1 rounded-full bg-gold" />
          Both feeds, side by side
        </p>
        <h2 className="mt-3 text-2xl font-semibold uppercase leading-tight tracking-tight text-bone">
          One manager. Two visual languages.
        </h2>
      </div>
      <div className="scrollbar-none mt-6 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-6 pb-2">
        {cards.map((card, index) => (
          <div key={`${card.image}-${index}`} className="snap-start">
            <ShowcaseCard card={card} onOpen={() => openViewer(cards, index)} />
          </div>
        ))}
      </div>
    </section>
  )
}
