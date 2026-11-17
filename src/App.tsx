import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import ScrollContinuum from './components/ScrollContinuum'
import Hero from './components/Hero'
import IntroStatement from './components/IntroStatement'
import AccountPanel from './components/AccountPanel'
import CaseStudy from './components/CaseStudy'
import { Attribution, Footer } from './components/Attribution'
import FeedTunnel from './components/FeedTunnel'
import HorizontalShowcase, { MobileShowcase } from './components/HorizontalShowcase'
import FullscreenViewer from './components/FullscreenViewer'
import EditToolbar from './components/EditToolbar'
import { useContent } from './store/content'
import { scrollToId, useSmoothScroll } from './hooks/useSmoothScroll'

export default function App() {
  const { content } = useContent()
  useSmoothScroll()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26, restDelta: 0.001 })
  const [active, setActive] = useState<string | null>(null)
  const [showJump, setShowJump] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowJump(window.scrollY > window.innerHeight * 0.85)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const jump = (id: string) => {
    setActive(id)
    window.setTimeout(() => scrollToId(`account-${id}`, 20), 40)
    window.setTimeout(() => setActive(null), 1800)
  }

  return (
    <main className="noise relative min-h-screen">
      {/* one continuous scroll world behind every chapter */}
      <ScrollContinuum />

      {/* scroll progress */}
      <motion.div
        style={{ scaleX: progress }}
        className="fixed left-0 top-0 z-[95] h-[2px] w-full origin-left bg-gradient-to-r from-gold via-gold-soft to-signal"
      />

      {/* account jumps */}
      <div
        className={`fixed left-1/2 top-4 z-[80] hidden -translate-x-1/2 transition-all duration-500 lg:block ${
          showJump ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-3 opacity-0'
        }`}
      >
        <div className="flex items-center gap-1 rounded-full border border-white/12 bg-black/55 p-1 backdrop-blur-xl">
          <span className="px-2.5 font-mono text-[8px] uppercase tracking-[0.2em] text-bone/30">Jump</span>
          {content.accounts.map((account) => (
            <button
              key={account.id}
              type="button"
              onClick={() => jump(account.id)}
              className={`group flex items-center gap-1.5 rounded-full px-2.5 py-1.5 transition-colors hover:bg-white/10 ${
                active === account.id ? 'bg-white/10' : ''
              }`}
            >
              <img src={account.avatar} alt="" className="h-4 w-4 rounded-full object-cover" />
              <span className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-bone/60 group-hover:text-bone">
                {account.index} · {account.name.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div data-chapter="hero"><Hero onOpenAccount={jump} /></div>
      <div data-chapter="intro"><IntroStatement onOpenAccount={jump} /></div>
      <div data-chapter="tunnel"><FeedTunnel onOpenAccount={jump} /></div>
      <div data-chapter="intro"><HorizontalShowcase /></div>
      <div data-chapter="intro"><MobileShowcase /></div>

      {content.accounts.map((account) => (
        <div key={account.id}>
          <div data-chapter={account.id}>
            <AccountPanel account={account} />
          </div>
          <div
            data-chapter={`${account.id}-study`}
            className="relative border-b border-white/10 px-6 pb-8 md:px-10"
          >
            <div className="pointer-events-none absolute inset-0 bg-ink/35" />
            <div className="relative mx-auto max-w-[1600px]">
              <CaseStudy account={account} />
            </div>
          </div>
        </div>
      ))}

      <div data-chapter="close">
        <Attribution />
        <Footer />
      </div>

      <AnimatePresence>{<FullscreenViewer />}</AnimatePresence>
      <EditToolbar />
    </main>
  )
}
