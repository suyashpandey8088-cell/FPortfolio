import { motion } from 'framer-motion'
import { Editable, Reveal } from './primitives'
import { useContent } from '../store/content'
import { scrollToTop } from '../hooks/useSmoothScroll'

export function Attribution() {
  const { content } = useContent()

  return (
    <section
      id="attribution"
      className="relative overflow-hidden border-b border-white/10 bg-charcoal/65 py-20 md:py-28"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(217,174,98,0.12),transparent_62%)]" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[70%] -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

      <div className="relative mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="kicker flex items-center gap-3 text-gold/80">
                <span className="h-1 w-1 rounded-full bg-gold" />
                Attribution
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-5 text-[clamp(1.7rem,4.6vw,3.4rem)] font-[900] uppercase leading-[1.02] tracking-tight text-bone">
                <Editable path="attribution.title" multiline as="span" className="block" />
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-2xl text-[0.98rem] leading-relaxed text-bone/60">
                <Editable path="attribution.body" multiline as="span" />
              </p>
            </Reveal>
            <Reveal delay={0.22}>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-bone/40">
                <Editable path="attribution.foot" multiline as="span" />
              </p>
            </Reveal>

            <div className="mt-9 flex flex-wrap gap-2">
              {content.accounts.map((account) => (
                <a
                  key={account.id}
                  href={account.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={`group flex items-center gap-3 rounded-full border px-4 py-2 transition-colors ${
                    account.id === 'combat'
                      ? 'border-signal/35 hover:bg-signal/10'
                      : 'border-gold/35 hover:bg-gold/10'
                  }`}
                >
                  <img src={account.avatar} alt="" className="h-6 w-6 rounded-full object-cover" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-bone/75">
                    {account.username}
                  </span>
                  <span
                    className={`text-[10px] transition-transform duration-300 group-hover:translate-x-0.5 ${
                      account.id === 'combat' ? 'text-signal' : 'text-gold'
                    }`}
                  >
                    ↗
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={0.1}>
              <div className="rounded-sm border border-white/10 bg-white/[0.02] p-6">
                <p className="kicker text-bone/35">Direct experience, not borrowed</p>
                <div className="mt-5 space-y-4">
                  {[
                    {
                      title: 'Sole manager',
                      body: 'Deleena is the only person running each account’s content and community.',
                    },
                    {
                      title: 'Not a friend’s page',
                      body: 'Neither account is presented as someone else’s feed or a favour.',
                    },
                    {
                      title: 'Not a collaboration',
                      body: 'No co-managed, group or agency-shared credit on either account.',
                    },
                    {
                      title: 'Verified only',
                      body: 'No follower, reach, engagement or growth number is invented here.',
                    },
                  ].map((item, index) => (
                    <div key={item.title} className="flex gap-3">
                      <span className="mt-1 font-mono text-[9px] text-gold/60">{String(index + 1).padStart(2, '0')}</span>
                      <div>
                        <p className="text-[12.5px] font-semibold uppercase tracking-wide text-bone/80">
                          {item.title}
                        </p>
                        <p className="mt-1 text-[11.5px] leading-relaxed text-bone/45">{item.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 border-t border-white/10 pt-4">
                  <p className="font-mono text-[8.5px] uppercase leading-relaxed tracking-[0.16em] text-bone/30">
                    Imagery on this page is representative of each account’s visual direction. Live posts, counts and
                    engagement should always be read on Instagram itself.
                  </p>
                  <p className="mt-2 font-mono text-[8px] leading-relaxed tracking-[0.12em] text-bone/25">
                    Placeholder photography:{' '}
                    <a
                      href="https://unsplash.com/license"
                      target="_blank"
                      rel="noreferrer noopener"
                      className="underline decoration-bone/20 underline-offset-2 hover:text-bone/50"
                    >
                      Unsplash License
                    </a>
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  const { content } = useContent()

  return (
    <footer className="relative overflow-hidden bg-ink/70 pb-10 pt-20">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-[radial-gradient(ellipse_at_50%_100%,rgba(217,174,98,0.18),transparent_65%)]" />

      <div className="relative mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-8 border-b border-white/10 pb-10">
          <div>
            <p className="kicker text-bone/30">Behind the feed · social media management</p>
            <h2 className="mt-3 text-[clamp(2.2rem,7vw,5.6rem)] font-[900] uppercase leading-[0.9] tracking-tightest text-bone">
              <Editable path="footer.name" as="span" className="block" />
            </h2>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.24em] text-gold/80">
              <Editable path="footer.role" as="span" />
            </p>
          </div>
          <div className="max-w-sm">
            <p className="text-sm leading-relaxed text-bone/55">
              <Editable path="footer.cta" multiline as="span" />
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {content.accounts.map((account) => (
                <a
                  key={account.id}
                  href={account.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="rounded-full border border-white/15 px-3.5 py-2 font-mono text-[9px] uppercase tracking-[0.18em] text-bone/60 transition-colors hover:border-bone/40 hover:text-bone"
                >
                  {account.username} ↗
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-[8.5px] uppercase tracking-[0.18em] text-bone/25">
            Both accounts personally handled and managed by Deleena Venkatesh
          </p>
          <motion.button
            type="button"
            onClick={() => scrollToTop()}
            whileHover={{ y: -2 }}
            className="font-mono text-[8.5px] uppercase tracking-[0.18em] text-bone/35 hover:text-gold"
          >
            Back to top ↑
          </motion.button>
        </div>
      </div>
    </footer>
  )
}
