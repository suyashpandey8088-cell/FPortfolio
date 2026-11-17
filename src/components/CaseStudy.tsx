import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import type { Account } from '../content/accounts'
import { accountBase, useContent } from '../store/content'
import { Editable, EditableList, Reveal } from './primitives'

const EASE = [0.22, 1, 0.36, 1] as const

export default function CaseStudy({
  account,
  initialOpen = false,
  initialSection = 0,
}: {
  account: Account
  initialOpen?: boolean
  initialSection?: number
}) {
  const [open, setOpen] = useState(initialOpen)
  const [activeSection, setActiveSection] = useState(initialSection)
  const { content, editing, set, openViewer } = useContent()
  const isCombat = account.id === 'combat'
  const base = accountBase(content.accounts, account.id, 'caseStudy')
  const accent = isCombat ? 'signal' : 'gold'
  const accentText = isCombat ? 'text-signal' : 'text-gold'
  const accentBorder = isCombat ? 'border-signal/45' : 'border-gold/45'
  const accentBg = isCombat ? 'bg-signal' : 'bg-gold'

  const verified = (value: string) => {
    const cleaned = (value ?? '').trim()
    return Boolean(cleaned) && cleaned !== '—' && cleaned !== '-' && cleaned !== 'N/A'
  }

  const section = account.caseStudy.sections[activeSection]

  return (
    <div className={`relative mt-16 overflow-hidden rounded-sm border ${isCombat ? 'border-white/12' : 'border-white/12'}`}>
      {/* collapsed / toggle header */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={`group relative flex w-full items-center justify-between gap-6 px-6 py-7 text-left transition-colors md:px-10 ${
          isCombat ? 'hover:bg-signal/[0.045]' : 'hover:bg-gold/[0.045]'
        }`}
        aria-expanded={open}
      >
        <div className="flex items-start gap-5">
          <span
            className={`mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-transform duration-500 group-hover:rotate-90 ${
              open ? `${accentBg} border-transparent text-ink` : `${accentBorder} ${accentText}`
            }`}
          >
            {open ? (
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M5 12h14" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M12 5v14M5 12h14" strokeLinecap="round" />
              </svg>
            )}
          </span>
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-bone/35">
              Social media case study · {account.name}
            </p>
            <h4 className="mt-1.5 text-[clamp(1.3rem,3vw,2.1rem)] font-semibold uppercase leading-none tracking-tight text-bone">
              {open ? 'The full case study' : 'Open the case study'}
            </h4>
            <p className="mt-2 max-w-xl text-[12.5px] leading-relaxed text-bone/45">
              <Editable path={`${base}.standfirst`} multiline as="span" />
            </p>
          </div>
        </div>
        <div className="hidden shrink-0 items-center gap-6 sm:flex">
          <div className="text-right">
            <p className="tabnum font-mono text-[10px] uppercase tracking-[0.16em] text-bone/30">
              7 chapters
            </p>
            <p className={`mt-1 font-mono text-[9px] uppercase tracking-[0.18em] ${accentText}`}>
              {open ? 'Close −' : 'Expand +'}
            </p>
          </div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.65, ease: EASE }}
            className="overflow-hidden border-t border-white/10"
          >
            <div className="grid gap-8 px-6 py-8 md:px-10 md:py-10 lg:grid-cols-12">
              {/* chapter nav */}
              <div className="lg:col-span-3">
                <p className="kicker text-bone/30">Chapters</p>
                <div className="mt-4 flex gap-1.5 overflow-x-auto lg:flex-col lg:gap-0 lg:overflow-visible">
                  {account.caseStudy.sections.map((item, index) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveSection(index)}
                      className={`group flex shrink-0 items-center gap-3 border-b border-white/6 py-2.5 text-left transition-colors lg:w-full ${
                        activeSection === index ? 'text-bone' : 'text-bone/35 hover:text-bone/70'
                      }`}
                    >
                      <span className={`font-mono text-[9px] tabnum ${activeSection === index ? accentText : ''}`}>
                        {item.no}
                      </span>
                      <span className="whitespace-nowrap text-[12px] font-medium leading-tight lg:whitespace-normal">
                        {item.title}
                      </span>
                      <span
                        className={`ml-auto hidden h-1 w-1 rounded-full lg:block ${activeSection === index ? accentBg : 'bg-transparent'}`}
                      />
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setActiveSection(account.caseStudy.sections.length)}
                    className={`group flex shrink-0 items-center gap-3 border-b border-white/6 py-2.5 text-left lg:w-full ${
                      activeSection === account.caseStudy.sections.length
                        ? 'text-bone'
                        : 'text-bone/35 hover:text-bone/70'
                    }`}
                  >
                    <span className={`font-mono text-[9px] tabnum ${activeSection === account.caseStudy.sections.length ? accentText : ''}`}>
                      08
                    </span>
                    <span className="whitespace-nowrap text-[12px] font-medium leading-tight lg:whitespace-normal">
                      Performance metrics
                    </span>
                  </button>
                </div>

                <div className={`mt-6 rounded-sm border p-4 ${accentBorder} ${isCombat ? 'bg-signal/[0.04]' : 'bg-gold/[0.04]'}`}>
                  <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-bone/40">Attribution</p>
                  <p className="mt-2 text-[11.5px] leading-relaxed text-bone/65">
                    Personally handled and managed by Deleena Venkatesh.
                  </p>
                </div>
              </div>

              {/* chapter body */}
              <div className="lg:col-span-9">
                <AnimatePresence mode="wait">
                  {activeSection < account.caseStudy.sections.length ? (
                    <motion.div
                      key={section.id}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4, ease: EASE }}
                    >
                      <div className="flex items-baseline gap-4">
                        <span className={`font-mono text-[10px] ${accentText}`}>{section.no}</span>
                        <div className="h-px flex-1 bg-white/10" />
                        <span className="font-mono text-[8.5px] uppercase tracking-[0.22em] text-bone/25">
                          <Editable path={`${base}.sections.${activeSection}.kicker`} as="span" />
                        </span>
                      </div>
                      <h5 className="mt-5 text-[clamp(1.5rem,3.4vw,2.3rem)] font-semibold uppercase leading-[1.04] tracking-tight text-bone">
                        <Editable path={`${base}.sections.${activeSection}.title`} as="span" />
                      </h5>
                      <div className="mt-5 space-y-4">
                        {section.body.map((_, index) => (
                          <Editable
                            key={index}
                            path={`${base}.sections.${activeSection}.body.${index}`}
                            as="p"
                            multiline
                            className="max-w-3xl text-[0.94rem] leading-[1.75] text-bone/60"
                          />
                        ))}
                      </div>
                      <div className="mt-6 grid gap-x-8 gap-y-1.5 sm:grid-cols-2">
                        <EditableList
                          path={`${base}.sections.${activeSection}.bullets`}
                          items={section.bullets}
                          className="space-y-2 sm:col-span-2 sm:grid sm:grid-cols-2 sm:gap-x-8 sm:space-y-0"
                          itemClassName="py-1.5"
                          accent={isCombat ? 'signal' : 'gold'}
                        />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="metrics"
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4, ease: EASE }}
                    >
                      <div className="flex items-baseline gap-4">
                        <span className={`font-mono text-[10px] ${accentText}`}>08</span>
                        <div className="h-px flex-1 bg-white/10" />
                        <span className="font-mono text-[8.5px] uppercase tracking-[0.22em] text-bone/25">
                          Verified only
                        </span>
                      </div>
                      <h5 className="mt-5 text-[clamp(1.5rem,3.4vw,2.3rem)] font-semibold uppercase leading-[1.04] tracking-tight text-bone">
                        Performance metrics
                      </h5>
                      <p className="mt-4 max-w-2xl text-[0.94rem] leading-relaxed text-bone/60">
                        No follower count, engagement rate, reach figure or business growth number is
                        published here until it can be verified. Every field is editable, so verified values
                        can be dropped in directly from Instagram Insights.
                      </p>

                      <div className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-white/10 bg-white/10 sm:grid-cols-3">
                        {account.caseStudy.metrics
                          .map((metric, index) => ({ metric, index }))
                          .filter(({ metric }) => editing || verified(metric.value))
                          .map(({ metric, index }) => (
                            <div
                              key={metric.id}
                              className={`p-4 ${isCombat ? 'bg-[#0b0b0d]' : 'bg-[#0d0a06]'}`}
                            >
                              <Editable
                                path={`${base}.metrics.${index}.value`}
                                as="p"
                                className="tabnum text-[clamp(1.5rem,3vw,2.1rem)] font-semibold leading-none text-bone"
                                ariaLabel={`${metric.label} value`}
                              />
                              <p className="mt-2 text-[10.5px] leading-tight text-bone/55">
                                <Editable path={`${base}.metrics.${index}.label`} as="span" />
                              </p>
                              <p className="mt-1 font-mono text-[7.5px] uppercase tracking-[0.14em] text-bone/25">
                                <Editable path={`${base}.metrics.${index}.source`} as="span" />
                              </p>
                              {editing && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    set(`${base}.metrics`, account.caseStudy.metrics.filter((_, i) => i !== index))
                                  }
                                  className="mt-2 font-mono text-[7.5px] uppercase tracking-widest text-red-400/70 hover:text-red-400"
                                >
                                  remove
                                </button>
                              )}
                            </div>
                          ))}
                      </div>

                      {!editing && account.caseStudy.metrics.every((metric) => !verified(metric.value)) && (
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          {account.caseStudy.metrics.map((metric) => (
                            <span
                              key={metric.id}
                              className="rounded-full border border-white/12 px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.14em] text-bone/35"
                            >
                              {metric.label}
                            </span>
                          ))}
                        </div>
                      )}

                      {editing && (
                        <button
                          type="button"
                          onClick={() =>
                            set(`${base}.metrics`, [
                              ...account.caseStudy.metrics,
                              { id: `m-${Date.now()}`, label: 'New metric', value: '—', source: 'Source' },
                            ])
                          }
                          className="mt-3 rounded-full border border-gold/40 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-gold/80 hover:bg-gold/10"
                        >
                          + Add metric
                        </button>
                      )}

                      <div className={`mt-6 flex items-start gap-3 rounded-sm border p-4 ${accentBorder}`}>
                        <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${accentBg}`} />
                        <p className="text-[11.5px] leading-relaxed text-bone/50">
                          <Editable path={`${base}.metricNote`} multiline as="span" />
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          openViewer(
                            account.gallery.map((item) => ({
                              image: item.image,
                              type: item.type,
                              title: item.title,
                              caption: item.caption,
                              tags: item.tags,
                              href: account.url,
                              handle: account.username,
                              accent: isCombat ? ('signal' as const) : ('gold' as const),
                            })),
                            0,
                          )
                        }
                        className={`mt-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-[9px] uppercase tracking-[0.2em] transition-colors ${
                          isCombat
                            ? 'border-white/15 text-bone/70 hover:border-signal hover:text-signal'
                            : 'border-white/15 text-bone/70 hover:border-gold hover:text-gold'
                        }`}
                      >
                        Open the full feed preview
                        <span>→</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
