import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import type { Account } from '../content/accounts'
import { accountBase, useContent, type ViewerItem } from '../store/content'
import { Editable, EditableList, Reveal } from './primitives'
import InstagramProfile, { IgIcon } from './InstagramProfile'

const EASE = [0.22, 1, 0.36, 1] as const

/* ── horizontal reel rail ─────────────────────────────────────────────────── */

function ReelRail({ account }: { account: Account }) {
  const { openViewer } = useContent()
  const rail = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const isCombat = account.id === 'combat'

  const items: ViewerItem[] = account.reels.map((reel) => ({
    image: reel.image,
    type: 'Reel',
    title: reel.title,
    caption: reel.caption,
    tags: reel.tags,
    href: account.url,
    handle: account.username,
    accent: isCombat ? 'signal' : 'gold',
    ratio: 'story',
  }))

  useEffect(() => {
    const node = rail.current
    if (!node) return
    const onScroll = () => {
      const max = node.scrollWidth - node.clientWidth
      setProgress(max > 0 ? node.scrollLeft / max : 0)
    }
    node.addEventListener('scroll', onScroll, { passive: true })
    return () => node.removeEventListener('scroll', onScroll)
  }, [])

  const nudge = (direction: number) => {
    rail.current?.scrollBy({ left: direction * 320, behavior: 'smooth' })
  }

  return (
    <div className="relative">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="kicker text-bone/35">Reels & motion</p>
          <h5 className="mt-1.5 text-lg font-semibold tracking-tight text-bone">Selected reels</h5>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => nudge(-1)}
            aria-label="Scroll reels left"
            className={`grid h-8 w-8 place-items-center rounded-full border transition-colors ${
              isCombat
                ? 'border-white/15 text-white/60 hover:border-signal hover:text-signal'
                : 'border-white/15 text-white/60 hover:border-gold hover:text-gold'
            }`}
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => nudge(1)}
            aria-label="Scroll reels right"
            className={`grid h-8 w-8 place-items-center rounded-full border transition-colors ${
              isCombat
                ? 'border-white/15 text-white/60 hover:border-signal hover:text-signal'
                : 'border-white/15 text-white/60 hover:border-gold hover:text-gold'
            }`}
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={rail}
        className="scrollbar-none -mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2"
      >
        {items.map((reel, index) => (
          <button
            key={index}
            type="button"
            onClick={() => openViewer(items, index)}
            className="group relative aspect-[9/14] w-[46%] shrink-0 snap-start overflow-hidden rounded-sm border border-white/10 sm:w-[31%] lg:w-[23%]"
          >
            <img
              src={reel.image}
              alt={reel.title}
              loading="lazy"
              className="reel-kb h-full w-full object-cover opacity-80 transition-opacity duration-500 group-hover:opacity-100"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/30" />
            <span className="absolute inset-x-0 top-0 z-10 h-[2px] overflow-hidden bg-white/10">
              <span className={`reel-sweep block h-full ${isCombat ? 'bg-signal' : 'bg-gold'}`} />
            </span>
            <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/45 px-1.5 py-0.5 backdrop-blur-sm">
              <IgIcon name="play" className="h-2 w-2 text-white" />
              <span className="font-mono text-[7px] uppercase tracking-[0.16em] text-white/80">Reel</span>
            </span>
            <span className="absolute inset-0 grid place-items-center">
              <span
                className={`grid h-9 w-9 scale-90 place-items-center rounded-full border text-white opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:scale-100 group-hover:opacity-100 ${
                  isCombat ? 'border-signal/70 bg-signal/25' : 'border-gold/70 bg-gold/20'
                }`}
              >
                <IgIcon name="play" className="ml-0.5 h-3.5 w-3.5" />
              </span>
            </span>
            <span className="absolute inset-x-0 bottom-0 p-2.5 text-left">
              <span className="block text-[11px] font-semibold leading-tight text-white">{reel.title}</span>
              <span className="mt-0.5 block truncate font-mono text-[7.5px] uppercase tracking-[0.1em] text-white/45">
                {account.username}
              </span>
            </span>
          </button>
        ))}
      </div>

      <div className="mt-2 h-px w-full bg-white/10">
        <div
          className={`h-px transition-[width] duration-200 ${isCombat ? 'bg-signal' : 'bg-gold'}`}
          style={{ width: `${Math.max(12, progress * 100)}%` }}
        />
      </div>
    </div>
  )
}

/* ── responsibilities marquee ─────────────────────────────────────────────── */

function ResponsibilityStrip({ account }: { account: Account }) {
  const isCombat = account.id === 'combat'
  return (
    <div className="marquee-paused relative overflow-hidden border-y border-white/10 py-3">
      <div className={`marquee-track flex shrink-0 whitespace-nowrap ${isCombat ? 'fast' : 'marquee-slow'}`}>
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {account.responsibilities.map((item) => (
              <span
                key={`${copy}-${item}`}
                className="flex items-center gap-4 pr-4 font-mono text-[9px] uppercase tracking-[0.24em] text-bone/40"
              >
                {item}
                <span className={isCombat ? 'text-signal/70' : 'text-gold/70'}>/</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── main panel ───────────────────────────────────────────────────────────── */

export default function AccountPanel({ account }: { account: Account }) {
  const { content } = useContent()
  const isCombat = account.id === 'combat'
  const base = accountBase(content.accounts, account.id)
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const drift = useTransform(scrollYProgress, [0, 1], ['-3%', '3%'])

  return (
    <section
      id={`account-${account.id}`}
      ref={ref}
      className={`relative overflow-hidden border-b ${
        isCombat ? 'border-white/10 bg-transparent' : 'border-white/10 bg-transparent'
      }`}
    >
      {/* world-specific ambience */}
      {isCombat ? (
        <>
          <div className="pointer-events-none absolute inset-0 opacity-[0.5] [background-image:repeating-linear-gradient(0deg,rgba(255,255,255,0.028)_0px,rgba(255,255,255,0.028)_1px,transparent_1px,transparent_4px)]" />
          <div className="pointer-events-none absolute -right-[10%] top-[6%] h-[46vh] w-[46vh] rounded-full bg-signal/[0.16] blur-[130px]" />
          <div className="pointer-events-none absolute -left-[6%] bottom-[8%] h-[34vh] w-[34vh] rounded-full bg-steel/[0.10] blur-[120px]" />
        </>
      ) : (
        <>
          <div className="pointer-events-none absolute inset-0 opacity-[0.6] [background-image:radial-gradient(circle_at_1px_1px,rgba(217,174,98,0.14)_1px,transparent_0)] [background-size:34px_34px]" />
          <div className="pointer-events-none absolute -left-[8%] top-[10%] h-[48vh] w-[48vh] rounded-full bg-gold/[0.14] blur-[130px]" />
          <div className="pointer-events-none absolute -right-[6%] bottom-[6%] h-[36vh] w-[36vh] rounded-full bg-gold-deep/[0.18] blur-[120px]" />
        </>
      )}

      {/* giant watermark index */}
      <motion.span
        style={{ x: drift }}
        aria-hidden
        className={`pointer-events-none absolute -top-6 select-none font-[900] leading-none opacity-[0.05] ${
          isCombat ? 'right-2 font-cond text-[38vw]' : 'left-2 font-serif italic text-[34vw]'
        }`}
      >
        {account.index}
      </motion.span>

      <div className="relative mx-auto max-w-[1600px] px-6 py-20 md:px-10 md:py-28">
        {/* section header */}
        <div className="flex flex-wrap items-center justify-between gap-6">
          <Reveal>
            <div className="flex items-center gap-4">
              <span
                className={`grid h-11 w-11 place-items-center rounded-full border font-mono text-[11px] ${
                  isCombat ? 'border-signal/50 text-signal' : 'border-gold/50 text-gold'
                }`}
              >
                {account.index}
              </span>
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-bone/35">
                  {isCombat ? 'Account 02 — combat sports' : 'Account 01 — fine jewellery'}
                </p>
                <p className={`mt-0.5 text-[11px] ${isCombat ? 'text-signal/90' : 'text-gold/90'}`}>
                  {account.tagline}
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <a
              href={account.url}
              target="_blank"
              rel="noreferrer noopener"
              className={`group inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-[9px] uppercase tracking-[0.2em] transition-colors ${
                isCombat
                  ? 'border-white/15 text-bone/70 hover:border-signal hover:text-signal'
                  : 'border-white/15 text-bone/70 hover:border-gold hover:text-gold'
              }`}
            >
              <IgIcon name="verified" className="h-3.5 w-3.5" />
              {account.username}
              <span className="transition-transform duration-300 group-hover:translate-x-0.5">↗</span>
            </a>
          </Reveal>
        </div>

        {/* headline */}
        <div className="mt-8">
          <Reveal y={34}>
            <h3
              className={`text-[clamp(2.4rem,7.6vw,6.4rem)] leading-[0.86] text-bone ${
                isCombat
                  ? 'font-cond font-normal tracking-[0.01em]'
                  : 'font-serif italic tracking-[-0.015em]'
              }`}
            >
              <Editable path={`${base}.name`} as="span" className="block" />
            </h3>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-2xl text-[0.95rem] leading-relaxed text-bone/55">
              <Editable path={`${base}.overview`} multiline as="span" />
            </p>
          </Reveal>
        </div>

        <div className="mt-10">
          <ResponsibilityStrip account={account} />
        </div>

        {/* profile + details */}
        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5 xl:col-span-4">
            <Reveal delay={0.05}>
              <div className="lg:sticky lg:top-8">
                <div className="mx-auto max-w-[430px]">
                  <InstagramProfile account={account} variant={isCombat ? 'combat' : 'padma'} />
                </div>
                <p className="mx-auto mt-3 max-w-[430px] text-center font-mono text-[8.5px] uppercase leading-relaxed tracking-[0.2em] text-bone/25">
                  Instagram-inspired showcase · imagery representative of feed
                </p>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7 xl:col-span-8">
            <div className="grid gap-8 md:grid-cols-2">
              <Reveal delay={0.05}>
                <div>
                  <p className="kicker text-bone/35">Profile identity</p>
                  <p className="mt-2 text-[12px] leading-relaxed text-bone/35">
                    The showcase to the left mirrors how the account presents itself on Instagram — the same
                    username, profile photograph, bio and highlights.
                  </p>
                  <div className="mt-4 space-y-2.5">
                    {[
                      { label: 'Username', field: 'username' },
                      { label: 'Category', field: 'category' },
                    ].map((row) => (
                      <div key={row.field} className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-2">
                        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-bone/30">{row.label}</span>
                        <Editable
                          path={`${base}.${row.field}`}
                          as="span"
                          className="text-right font-mono text-[10px] text-bone/80"
                        />
                      </div>
                    ))}
                    <div className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-2">
                      <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-bone/30">Profile URL</span>
                      <a
                        href={account.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className={`text-right font-mono text-[10px] hover:underline ${
                          isCombat ? 'text-signal/90' : 'text-gold/90'
                        }`}
                      >
                        {account.username.replace('@', '')} ↗
                      </a>
                    </div>
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-bone/30">Status</span>
                      <span className="text-right font-mono text-[9px] uppercase tracking-[0.1em] text-emerald-300/80">
                        Personally managed
                      </span>
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.12}>
                <div>
                  <p className="kicker text-bone/35">What Deleena handles</p>
                  <EditableList
                    path={`${base}.responsibilities`}
                    items={account.responsibilities}
                    className="mt-3 space-y-2"
                    itemClassName="border-b border-white/6 pb-2"
                    accent={isCombat ? 'signal' : 'gold'}
                  />
                  <div
                    className={`mt-5 rounded-sm border p-4 ${
                      isCombat ? 'border-signal/25 bg-signal/[0.04]' : 'border-gold/25 bg-gold/[0.04]'
                    }`}
                  >
                    <p className="font-mono text-[8.5px] uppercase tracking-[0.2em] text-bone/40">
                      Management attribution
                    </p>
                    <p className="mt-2 text-[12.5px] leading-relaxed text-bone/70">
                      <Editable path={`${base}.status`} multiline as="span" />
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>

            <div className="mt-10">
              <Reveal delay={0.05}>
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="kicker text-bone/35">Content gallery</p>
                    <h5 className="mt-1.5 text-lg font-semibold tracking-tight text-bone">
                      Selected posts & carousels
                    </h5>
                  </div>
                  <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-bone/25">
                    {String(account.gallery.length).padStart(2, '0')} items · hover to preview
                  </span>
                </div>
              </Reveal>
              <GalleryGrid account={account} />
            </div>

            <div className="mt-10">
              <ReelRail account={account} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function GalleryGrid({ account }: { account: Account }) {
  const { openViewer } = useContent()
  const isCombat = account.id === 'combat'
  const items: ViewerItem[] = account.gallery.map((item) => ({
    image: item.image,
    type: item.type,
    title: item.title,
    caption: item.caption,
    tags: item.tags,
    href: account.url,
    handle: account.username,
    accent: isCombat ? 'signal' : 'gold',
  }))

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {items.map((item, index) => (
        <motion.button
          key={index}
          type="button"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-8%' }}
          transition={{ duration: 0.7, delay: (index % 3) * 0.06, ease: EASE }}
          onClick={() => openViewer(items, index)}
          className={`group relative overflow-hidden rounded-sm border border-white/10 ${
            index % 5 === 0 ? 'aspect-[4/5]' : 'aspect-square'
          }`}
        >
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            className="h-full w-full object-cover opacity-75 grayscale-[20%] transition-all duration-[1.2s] ease-swift group-hover:scale-[1.07] group-hover:opacity-100 group-hover:grayscale-0"
          />
          <span
            className={`absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${
              isCombat
                ? 'bg-gradient-to-t from-[#1a0402]/95 via-[#1a0402]/25 to-transparent'
                : 'bg-gradient-to-t from-[#140d04]/95 via-[#140d04]/25 to-transparent'
            }`}
          />
          <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/40 px-1.5 py-0.5 backdrop-blur-sm">
            <span className={`h-1 w-1 rounded-full ${isCombat ? 'bg-signal' : 'bg-gold'}`} />
            <span className="font-mono text-[7px] uppercase tracking-[0.16em] text-white/75">{item.type}</span>
          </span>
          <span className="absolute inset-x-0 bottom-0 translate-y-3 p-2.5 text-left opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="block text-[11.5px] font-semibold leading-tight text-white">{item.title}</span>
            <span className="mt-1 line-clamp-2 block text-[10px] leading-snug text-white/65">{item.caption}</span>
          </span>
        </motion.button>
      ))}
    </div>
  )
}
