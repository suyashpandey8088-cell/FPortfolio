import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Editable, Reveal } from './primitives'
import { useContent } from '../store/content'
import { Tilt } from './primitives'

export default function IntroStatement({ onOpenAccount }: { onOpenAccount: (id: string) => void }) {
  const { content } = useContent()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const lineScale = useTransform(scrollYProgress, [0, 0.5], [0.2, 1])
  const wordX = useTransform(scrollYProgress, [0, 1], ['-4%', '4%'])

  const padma = content.accounts[0]
  const combat = content.accounts[1]

  return (
    <section id="feed" ref={ref} className="relative overflow-hidden border-b border-white/10 bg-ink/70">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="mx-auto max-w-[1600px] px-6 py-24 md:px-10 md:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <span className="kicker flex items-center gap-3 text-bone/40">
              <span className="h-1 w-1 rounded-full bg-gold" />
              <Editable path="intro.eyebrow" className="kicker text-bone/40" />
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-bone/30">
              Section 01 / The work
            </span>
          </Reveal>
        </div>

        <motion.div style={{ x: wordX }} className="mt-10">
          <h2 className="relative font-sans text-[clamp(2.9rem,11vw,9.5rem)] font-[900] leading-[0.86] tracking-tightest text-bone">
            <Reveal y={40}>
              <span className="block">
                BEHIND THE{' '}
                <span className="relative inline-block">
                  <span className="relative z-10 font-serif font-normal italic text-gold">FEED</span>
                  <motion.span
                    style={{ scaleX: lineScale }}
                    className="absolute -bottom-1 left-0 z-0 h-[0.1em] w-full origin-left bg-gold/25"
                  />
                </span>
                <span className="text-gold">.</span>
              </span>
            </Reveal>
          </h2>
        </motion.div>

        <div className="mt-14 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal delay={0.05}>
              <h3 className="max-w-3xl text-[clamp(1.5rem,3.4vw,2.7rem)] font-semibold uppercase leading-[1.06] tracking-[-0.02em] text-bone/95">
                <Editable path="intro.headline" multiline as="span" className="block" />
              </h3>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-7 max-w-2xl text-[1.02rem] leading-relaxed text-bone/60">
                <Editable path="intro.support" multiline as="span" />
              </p>
            </Reveal>
            <Reveal delay={0.25}>
              <div className="mt-9 flex items-start gap-4 border-l border-gold/50 pl-5">
                <p className="max-w-xl text-sm leading-relaxed text-bone/45">
                  <Editable path="intro.note" multiline as="span" />
                </p>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={0.2}>
              <div className="rounded-sm border border-white/10 bg-white/[0.015] p-6">
                <p className="kicker text-bone/35">Attribution</p>
                <p className="mt-3 text-sm leading-relaxed text-bone/65">
                  Both accounts below are personally handled and managed by{' '}
                  <span className="text-gold">Deleena Venkatesh</span>.
                </p>
                <div className="mt-6 space-y-3">
                  {[
                    { label: 'Accounts in this portfolio', value: '02' },
                    { label: 'Managed by', value: 'Deleena Venkatesh' },
                    { label: 'Role scope', value: 'End to end' },
                    { label: 'Collaborative accounts', value: 'None — both hers' },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-2.5"
                    >
                      <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-bone/35">
                        {row.label}
                      </span>
                      <span className="text-right font-mono text-[10px] uppercase tracking-[0.1em] text-bone/75">
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* two worlds split */}
        <div className="mt-20 grid gap-4 md:grid-cols-2 md:gap-5">
          {[padma, combat].map((account, index) => {
            const isCombat = account.id === 'combat'
            return (
              <Reveal key={account.id} delay={index * 0.1}>
                <Tilt strength={5}>
                  <button
                    type="button"
                    onClick={() => onOpenAccount(account.id)}
                    className="group relative block w-full overflow-hidden rounded-sm border border-white/10 text-left"
                  >
                    <div className="relative aspect-[16/11] overflow-hidden">
                      <img
                        src={account.gallery[0].image}
                        alt={`${account.name} preview`}
                        className="h-full w-full scale-105 object-cover opacity-70 grayscale-[35%] transition-all duration-[1.2s] ease-swift group-hover:scale-100 group-hover:opacity-100 group-hover:grayscale-0"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />
                      <div
                        className={`absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 ${
                          isCombat
                            ? 'bg-[radial-gradient(circle_at_70%_20%,rgba(255,58,33,0.3),transparent_60%)]'
                            : 'bg-[radial-gradient(circle_at_30%_20%,rgba(217,174,98,0.28),transparent_60%)]'
                        }`}
                      />
                      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-1 w-6 ${isCombat ? 'bg-signal' : 'bg-gold'}`}
                          />
                          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/50">
                            Account {account.index}
                          </span>
                        </div>
                        <h4
                          className={`mt-2 text-[clamp(1.5rem,3vw,2.4rem)] font-[900] leading-none tracking-tight text-white ${
                            isCombat ? 'font-cond tracking-[0.02em]' : ''
                          }`}
                        >
                          {account.name}
                        </h4>
                        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
                          {account.username} · {account.category}
                        </p>
                      </div>
                      <span className="absolute right-6 top-6 flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-white/70 transition-all duration-500 group-hover:border-white/60 group-hover:bg-white group-hover:text-black">
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7">
                          <path d="M7 17 17 7M9 7h8v8" />
                        </svg>
                      </span>
                    </div>
                  </button>
                </Tilt>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
