import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

/**
 * ChapterScene — a short scroll-driven set piece.
 *
 * Renders a tall section (default 150vh) holding a sticky viewport frame. As it
 * passes, the framed content settles out of depth: it scales down, rotates a
 * few degrees off-axis, lifts, and its ghost copy drifts the other way. The
 * result reads as the section *arriving* rather than simply scrolling by.
 *
 * Falls back to a plain, fully visible block under `prefers-reduced-motion`.
 */
export default function ChapterScene({
  children,
  className = '',
  /** peak rotation in degrees while off-axis */
  tilt = 4,
  /** how far the content travels upward through the scene */
  lift = '-4%',
  scaleFrom = 1.12,
  height = '150vh',
}: {
  children: React.ReactNode
  className?: string
  tilt?: number
  lift?: string
  scaleFrom?: number
  height?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [scaleFrom, 1, 1.02])
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [tilt, 0, -tilt * 0.5])
  const y = useTransform(scrollYProgress, [0, 1], [lift === '-4%' ? '6%' : lift, '0%'])
  const opacity = useTransform(scrollYProgress, [0, 0.18, 0.82, 1], [0.35, 1, 1, 0.4])

  if (reduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <div ref={ref} className={`relative ${className}`} style={{ height }}>
      <div className="sticky top-0 flex h-[100dvh] items-center justify-center overflow-hidden">
        <motion.div
          style={{ scale, rotateX, y, opacity, transformPerspective: 1200 }}
          className="w-full will-change-transform"
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
}
