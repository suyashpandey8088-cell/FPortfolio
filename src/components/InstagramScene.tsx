import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, X } from 'lucide-react'
import { accountsSeed } from '../content/accounts'
import { GiantType, Marquee, SceneIndex, Star, Sticker } from './kit'

/**
 * Instagram — two accounts, presented as two competing visual identities.
 *
 * Deliberately *not* a row of screenshots: each account is a composed plate
 * with its own type, palette and grid rhythm, and opens into a mini case study
 * covering what the management actually involved.
 *
 * No follower counts, engagement rates or growth numbers appear anywhere —
 * none have been verified.
 */

type Account = (typeof accountsSeed)[number]

export default function InstagramScene() {
  const [open, setOpen] = useState<Account | null>(null)

  return (
    <>
      <section
        id="instagram"
        data-scene="instagram"
        aria-label="Instagram account management"
        className="scene relative overflow-hidden"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="graph-paper absolute inset-0 text-cream/[0.06]" />
          <div className="absolute -left-[12%] top-[20%] h-[56vh] w-[56vh] rounded-full bg-lilac/20 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-[1500px] px-5 py-16 md:px-10 md:py-24">
          <SceneIndex n="04" title="Digital presence" />
          <GiantType as="h2" className="mt-8 text-[clamp(2.4rem,7.6vw,6.8rem)] uppercase">
            THE ART OF BUILDING
            <br />
            A <span className="text-lilac">DIGITAL PRESENCE.</span>
          </GiantType>

          <div className="mt-6 flex max-w-[52ch] flex-col gap-3">
            <p className="font-sherif text-[clamp(1.05rem,2vw,1.4rem)] leading-[1.4] opacity-90">
              Two accounts, both handled personally — end to end, from the content calendar to the
              final export.
            </p>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] opacity-55">
              No borrowed metrics. The work is the evidence.
            </p>
          </div>

          {/* the two plates */}
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {accountsSeed.map((account) => (
              <AccountPlate key={account.id} account={account} onOpen={() => setOpen(account)} />
            ))}
          </div>
        </div>

        <div className="border-y border-cream/20 bg-grape py-2 text-cream">
          <Marquee>
            <span className="font-display text-[12px] font-bold uppercase tracking-[0.16em]">
              @PADMAJEWELS ✳ @COMBATCREW25 ✳ CONTENT PLANNING ✳ REELS ✳ SCHEDULING ✳ VISUAL VOICE ✳
            </span>
          </Marquee>
        </div>
      </section>

      <AccountStudy account={open} onClose={() => setOpen(null)} />
    </>
  )
}

function AccountPlate({ account, onOpen }: { account: Account; onOpen: () => void }) {
  const isCombat = account.id === 'combat'
  const accent = isCombat ? '#FF2E93' : '#F5FF3D'
  const grid = account.gallery.slice(0, 6)

  return (
    <button type="button" onClick={onOpen} className="group block w-full text-left">
      <div className="relative border border-cream/25 p-4 md:p-6">
        {/* header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={account.avatar}
              alt={`${account.name} avatar`}
              className="h-12 w-12 rounded-full object-cover"
              style={{ outline: `2px solid ${accent}`, outlineOffset: '2px' }}
            />
            <div>
              <p className="font-mono text-[8px] uppercase tracking-[0.24em] opacity-55">
                Account {account.index}
              </p>
              <p className="font-display text-[1.05rem] font-bold uppercase leading-tight">
                {account.name}
              </p>
              <p className="font-mono text-[9px] opacity-60">{account.username}</p>
            </div>
          </div>
          <span
            className="grid h-9 w-9 place-items-center rounded-full text-ink transition-transform duration-500 group-hover:rotate-45"
            style={{ backgroundColor: accent }}
          >
            <ExternalLink className="h-4 w-4" />
          </span>
        </div>

        {/* 3×2 grid — each image sits in a different treatment so it never reads as a screenshot */}
        <div className="mt-5 grid grid-cols-3 gap-1.5">
          {grid.map((item, index) => (
            <div
              key={item.id}
              className={`relative overflow-hidden ${index === 0 ? 'col-span-2 row-span-2' : ''}`}
            >
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="aspect-square h-full w-full object-cover transition-transform duration-700 ease-swift group-hover:scale-[1.05]"
              />
              {index === 0 && (
                <div className="absolute inset-0 flex items-end p-3">
                  <span
                    className="px-2 py-1 font-mono text-[8px] uppercase tracking-[0.2em] text-ink"
                    style={{ backgroundColor: accent }}
                  >
                    Feed — latest
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* management summary */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {account.responsibilities.slice(0, 4).map((item) => (
            <span
              key={item}
              className="border border-cream/20 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.16em] opacity-70"
            >
              {item}
            </span>
          ))}
        </div>

        <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.2em] opacity-50">
          Open case study →
        </p>
      </div>
    </button>
  )
}

/* ── mini case study ─────────────────────────────────────────────────────── */

function AccountStudy({ account, onClose }: { account: Account | null; onClose: () => void }) {
  if (!account) return null
  const isCombat = account.id === 'combat'
  const accent = isCombat ? '#FF2E93' : '#F5FF3D'

  return (
    <AnimatePresence>
      {account && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[180] overflow-y-auto bg-ink text-cream"
          role="dialog"
          aria-modal="true"
          aria-label={`${account.name} case study`}
        >
          <div
            className="sticky top-0 z-10 flex items-center justify-between px-5 py-3 md:px-10"
            style={{ backgroundColor: '#0A0908' }}
          >
            <span className="font-mono text-[9px] uppercase tracking-[0.28em] opacity-60">
              Account {account.index} — case study
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
            <div className="flex flex-wrap items-center gap-3">
              <Sticker color="bg-cream" text="text-ink" rotate={-3}>
                {account.status}
              </Sticker>
              <a
                href={account.url}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] underline underline-offset-4 opacity-70 hover:opacity-100"
              >
                {account.username} <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <h2 className="mt-5 font-display text-[clamp(2rem,6vw,4.6rem)] font-bold uppercase leading-[0.9] tracking-tightest">
              {account.name}
            </h2>
            <p className="mt-4 max-w-[52ch] font-sherif text-[clamp(1.05rem,1.9vw,1.4rem)] leading-[1.4]">
              {account.tagline}
            </p>

            <div className="mt-10 grid gap-8 md:grid-cols-12">
              <div className="md:col-span-7">
                <h3 className="font-mono text-[9px] uppercase tracking-[0.28em] opacity-55">
                  Responsibilities
                </h3>
                <ul className="mt-4">
                  {account.responsibilities.map((item, index) => (
                    <li
                      key={item}
                      className="flex items-baseline gap-4 border-b border-cream/10 py-2.5"
                    >
                      <span className="font-mono text-[9px] opacity-40">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="font-display text-[clamp(0.95rem,1.7vw,1.2rem)] font-bold leading-tight">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="md:col-span-4 md:col-start-9">
                <h3 className="font-mono text-[9px] uppercase tracking-[0.28em] opacity-55">
                  The approach
                </h3>
                <p className="mt-4 border-l-2 pl-4 font-sherif text-[1.05rem] italic leading-[1.5]" style={{ borderColor: accent }}>
                  {isCombat
                    ? 'Build a visual language that matches the energy of the sport: high contrast, fast cuts, nothing polite. Consistency over novelty — the grid has to hold up when it is full.'
                    : 'Let the material do the work. Warm light, generous space, and a grid rhythm that treats each piece like a plate in a magazine rather than a product on a shelf.'}
                </p>
                <Star size={40} className="mt-6 animate-spin-slow" />
              </div>
            </div>

            {/* full gallery */}
            <h3 className="mt-12 font-mono text-[9px] uppercase tracking-[0.28em] opacity-55">
              From the grid
            </h3>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {account.gallery.map((item) => (
                <div key={item.id} className="overflow-hidden">
                  <img
                    src={item.image}
                    alt=""
                    loading="lazy"
                    className="aspect-square w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
