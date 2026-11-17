import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Mail, Send } from 'lucide-react'
import { contact, identity } from '../content/site'
import { GiantType, Magnetic, Marquee, Rings, SceneIndex, Star, Sticker } from './kit'

/**
 * Contact — the finale, staged as a loud print poster.
 *
 * The form is deliberately minimal and posts nowhere: it composes a mailto:
 * so it works with no backend, no third-party service and no broken endpoint.
 */
export default function ContactScene() {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const subject = encodeURIComponent(`New project — ${name || 'website enquiry'}`)
    const body = encodeURIComponent(`${message}\n\n— ${name}`)
    window.location.href = `mailto:${identity.email}?subject=${subject}&body=${body}`
    setSent(true)
  }

  return (
    <section
      id="contact"
      data-scene="contact"
      aria-label="Contact"
      className="scene relative overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0">
        <Rings size={720} className="absolute -right-[20%] -top-[14%] text-ink/12" />
        <div className="halftone absolute bottom-0 left-0 h-[30vh] w-[40vw] text-ink/20" />
        <Star size={100} className="absolute right-[10%] top-[52%] hidden text-ink/70 animate-spin-slow md:block" />
      </div>

      <div className="relative mx-auto max-w-[1500px] px-5 pb-10 pt-16 md:px-10 md:pt-24">
        <SceneIndex n="09" title="Contact" />

        <GiantType as="h2" className="mt-8 text-[clamp(2.6rem,9vw,8rem)] uppercase">
          LET&rsquo;S MAKE
          <br />
          SOMETHING
          <br />
          <span className="font-sherif italic lowercase tracking-normal">unforgettable.</span>
        </GiantType>

        <div className="mt-10 grid gap-10 md:grid-cols-12">
          {/* the form */}
          <form onSubmit={onSubmit} className="md:col-span-6">
            <p className="font-mono text-[9px] uppercase tracking-[0.24em] opacity-70">
              {contact.line}
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <label className="flex flex-col gap-1.5">
                <span className="font-mono text-[8px] uppercase tracking-[0.24em] opacity-60">
                  Your name
                </span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  placeholder="Who is asking?"
                  className="border border-ink/40 bg-transparent px-3 py-2.5 font-grotesk text-[0.95rem] placeholder:text-ink/35 focus:border-ink focus:outline-none"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="font-mono text-[8px] uppercase tracking-[0.24em] opacity-60">
                  The project
                </span>
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  required
                  rows={4}
                  placeholder="What are we making?"
                  className="resize-none border border-ink/40 bg-transparent px-3 py-2.5 font-grotesk text-[0.95rem] placeholder:text-ink/35 focus:border-ink focus:outline-none"
                />
              </label>

              <Magnetic strength={0.18} className="w-fit">
                <button
                  type="submit"
                  className="group inline-flex items-center gap-3 bg-ink px-5 py-3 font-mono text-[10px] uppercase tracking-[0.22em] text-cream transition-colors hover:bg-grape"
                >
                  {sent ? 'Opening mail…' : 'Send the brief'}
                  <Send className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </Magnetic>

              <p className="font-mono text-[8px] uppercase tracking-[0.18em] opacity-50">
                Opens your mail client — no data is stored.
              </p>
            </div>
          </form>

          {/* links */}
          <div className="md:col-span-4 md:col-start-9">
            <div className="flex flex-col gap-2">
              <a
                href={`mailto:${identity.email}`}
                className="group flex items-center justify-between border-b border-ink/30 py-3"
              >
                <span className="flex items-center gap-2 font-display text-[clamp(0.95rem,1.8vw,1.2rem)] font-bold uppercase tracking-tighter2">
                  <Mail className="h-4 w-4" /> {identity.email}
                </span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>

              {contact.socials.map((social) => (
                <a
                  key={social.url}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group flex items-center justify-between border-b border-ink/30 py-3"
                >
                  <span className="flex flex-col">
                    <span className="font-mono text-[8px] uppercase tracking-[0.22em] opacity-55">
                      {social.label}
                    </span>
                    <span className="font-display text-[clamp(0.95rem,1.8vw,1.2rem)] font-bold uppercase tracking-tighter2">
                      {social.handle}
                    </span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              ))}
            </div>

            <Sticker color="bg-ink" text="text-cream" rotate={-4} className="mt-6">
              {identity.location} · Available for work
            </Sticker>
          </div>
        </div>

        {/* signoff */}
        <div className="mt-16 border-t-2 border-ink pt-6">
          <p className="font-display text-[clamp(1.6rem,5vw,3.4rem)] font-bold uppercase leading-none tracking-tightest">
            {contact.signoff}
          </p>
        </div>
      </div>

      <div className="border-y border-ink/25 bg-ink py-2 text-cream">
        <Marquee speed="fast">
          <span className="font-display text-[12px] font-bold uppercase tracking-[0.16em]">
            {identity.concept} ✳ {identity.concept} ✳
          </span>
        </Marquee>
      </div>

      <footer className="relative px-5 py-6 md:px-10">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-3">
          <span className="font-mono text-[8px] uppercase tracking-[0.22em] opacity-60">
            © {new Date().getFullYear()} {identity.name}
          </span>
          <span className="font-mono text-[8px] uppercase tracking-[0.22em] opacity-60">
            Designed and built by Deleena — not generated from a template
          </span>
        </div>
      </footer>
    </section>
  )
}
