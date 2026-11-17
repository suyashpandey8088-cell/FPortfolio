import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { useSmoothScroll, useLenis } from './hooks/useSmoothScroll'
import { useScrollScenes, useScrollTriggerSync } from './hooks/useScrollScenes'
import Preloader from './components/Preloader'
import Nav from './components/Nav'
import HeroScene from './components/HeroScene'
import AboutScene from './components/AboutScene'
import ExpertiseScene from './components/ExpertiseScene'
import ProjectsScene from './components/ProjectsScene'
import InstagramScene from './components/InstagramScene'
import ExperienceScene from './components/ExperienceScene'
import ToolkitScene from './components/ToolkitScene'
import MoodboardScene from './components/MoodboardScene'
import ImpactScene from './components/ImpactScene'
import ContactScene from './components/ContactScene'
import { Cursor } from './components/kit'

/**
 * Deleena V. — maximalist portfolio.
 *
 * The page is a sequence of *scenes*, each with its own colour identity. Three
 * systems run on top of it:
 *   1. Lenis          — smooth scroll, including touch
 *   2. ScrollTrigger  — pinned horizontal projects, driven off Lenis
 *   3. useScrollScenes— cross-fades the document palette per scene
 */
export default function App() {
  useSmoothScroll()
  const lenis = useLenis()
  const [entered, setEntered] = useState(false)

  useScrollScenes(true)
  useScrollTriggerSync(lenis)

  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 26, restDelta: 0.001 })

  /* hold the page still while the title card is up */
  useEffect(() => {
    if (entered) {
      document.documentElement.style.overflow = ''
      lenis?.start()
    } else {
      document.documentElement.style.overflow = 'hidden'
      lenis?.stop()
    }
  }, [entered, lenis])

  return (
    <main className="relative min-h-screen bg-ink">
      <Cursor />
      {!entered && <Preloader onDone={() => setEntered(true)} />}
      <Nav />

      {/* global scroll progress hairline */}
      <motion.div
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[130] h-[2px] origin-left bg-gradient-to-r from-flash via-punch to-acid"
      />

      <HeroScene />
      <AboutScene />
      <ExpertiseScene />
      <ProjectsScene />
      <InstagramScene />
      <ExperienceScene />
      <ToolkitScene />
      <MoodboardScene />
      <ImpactScene />
      <ContactScene />
    </main>
  )
}
