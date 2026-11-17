import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useContent, useTextCommit } from '../store/content'

/* ── editable text ────────────────────────────────────────────────────────── */

type EditableProps = {
  path: string
  as?: keyof JSX.IntrinsicElements
  className?: string
  multiline?: boolean
  placeholder?: string
  style?: React.CSSProperties
  accent?: 'gold' | 'signal'
  ariaLabel?: string
}

export function Editable({
  path,
  as = 'span',
  className = '',
  multiline = false,
  placeholder = 'Add text…',
  style,
  ariaLabel,
}: EditableProps) {
  const { content, set, editing } = useContent()
  const value = ((): string => {
    const found = path.split('.').reduce<any>((acc, key) => (acc == null ? acc : acc[key]), content)
    return typeof found === 'string' ? found : ''
  })()

  const Tag: any = as

  if (!editing) {
    return (
      <Tag className={className} style={style}>
        {value || placeholder}
      </Tag>
    )
  }

  return (
    <EditableField
      as={Tag}
      className={className}
      style={style}
      value={value}
      multiline={multiline}
      placeholder={placeholder}
      ariaLabel={ariaLabel}
      onCommit={(next) => set(path, next)}
    />
  )
}

function EditableField({
  as: Tag,
  className,
  style,
  value,
  multiline,
  placeholder,
  onCommit,
  ariaLabel,
}: {
  as: any
  className?: string
  style?: React.CSSProperties
  value: string
  multiline?: boolean
  placeholder?: string
  onCommit: (value: string) => void
  ariaLabel?: string
}) {
  const ref = useRef<HTMLElement | null>(null)
  const commit = useTextCommit(onCommit)
  const focused = useRef(false)
  const lastPushed = useRef(value)

  /* keep the DOM in sync with external changes without fighting the caret */
  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (focused.current) return
    if (value !== lastPushed.current && node.innerText !== value) {
      node.innerText = value
    }
    lastPushed.current = value
  }, [value])

  return (
    <Tag
      ref={ref as any}
      className={`${className} edit-target cursor-text empty:before:content-[attr(data-placeholder)] empty:before:text-bone/25`}
      style={style}
      data-placeholder={placeholder ?? 'Add text…'}
      aria-label={ariaLabel ?? 'Editable text'}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      onFocus={() => {
        focused.current = true
      }}
      onInput={(event: React.FormEvent<HTMLElement>) => {
        const next = (event.currentTarget as HTMLElement).innerText
        lastPushed.current = next
        commit(next)
      }}
      onBlur={(event: React.FocusEvent<HTMLElement>) => {
        focused.current = false
        const next = (event.currentTarget as HTMLElement).innerText
        lastPushed.current = next
        onCommit(next)
      }}
      onKeyDown={(event: React.KeyboardEvent<HTMLElement>) => {
        if (!multiline && event.key === 'Enter') {
          event.preventDefault()
          ;(event.currentTarget as HTMLElement).blur()
        }
      }}
    />
  )
}

/* ── editable string list (bullets, responsibilities) ─────────────────────── */

export function EditableList({
  path,
  items,
  className = '',
  itemClassName = '',
  bullet,
  accent = 'gold',
}: {
  path: string
  items: string[]
  className?: string
  itemClassName?: string
  bullet?: React.ReactNode
  accent?: 'gold' | 'signal'
}) {
  const { set, editing } = useContent()
  const dot = accent === 'signal' ? 'bg-signal' : 'bg-gold'
  return (
    <ul className={className}>
      {items.map((item, index) => (
        <li key={index} className={`flex items-start gap-3 ${itemClassName}`}>
          {editing ? (
            <button
              type="button"
              aria-label="Remove item"
              onClick={() => set(path, items.filter((_, i) => i !== index))}
              className="mt-[0.45em] grid h-4 w-4 shrink-0 place-items-center rounded-full border border-white/25 text-[9px] leading-none text-white/60 hover:border-red-400 hover:text-red-400"
            >
              ×
            </button>
          ) : (
            bullet ?? <span className={`mt-[0.55em] h-1 w-1 shrink-0 rounded-full ${dot}`} />
          )}
          <Editable
            path={`${path}.${index}`}
            as="span"
            multiline
            className={`flex-1 text-[0.95rem] leading-relaxed text-bone/60 ${accent === 'signal' ? 'text-bone/70' : ''}`}
          />
        </li>
      ))}
      {editing && (
        <li>
          <button
            type="button"
            onClick={() => set(path, [...items, 'New item'])}
            className="mt-2 rounded-full border border-gold/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-gold/80 hover:bg-gold/10"
          >
            + Add item
          </button>
        </li>
      )}
    </ul>
  )
}

/* ── editable image (URL field) ───────────────────────────────────────────── */

export function EditableImage({
  path,
  src,
  alt,
  className = '',
  imgClassName = '',
  style,
}: {
  path: string
  src: string
  alt: string
  className?: string
  imgClassName?: string
  style?: React.CSSProperties
}) {
  const { set, editing } = useContent()
  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      <img src={src} alt={alt} loading="lazy" className={`h-full w-full object-cover ${imgClassName}`} />
      {editing && (
        <div className="absolute inset-x-1 bottom-1 z-20">
          <input
            value={src}
            onChange={(event) => set(path, event.target.value)}
            aria-label={`Image path for ${alt}`}
            className="w-full rounded bg-black/80 px-2 py-1 font-mono text-[9px] text-gold/90 outline-none ring-1 ring-gold/40"
          />
        </div>
      )}
    </div>
  )
}

/* ── reveal ───────────────────────────────────────────────────────────────── */

export function Reveal({
  children,
  delay = 0,
  y = 26,
  className = '',
  once = true,
}: {
  children: React.ReactNode
  delay?: number
  y?: number
  className?: string
  once?: boolean
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-12% 0px -12% 0px' }}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function SplitLines({
  text,
  className = '',
  lineClassName = '',
  delay = 0,
}: {
  text: string
  className?: string
  lineClassName?: string
  delay?: number
}) {
  const lines = text.split('\n')
  return (
    <span className={className}>
      {lines.map((line, index) => (
        <span key={index} className="block overflow-hidden">
          <motion.span
            className={`block ${lineClassName}`}
            initial={{ y: '110%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 1, delay: delay + index * 0.09, ease: [0.22, 1, 0.36, 1] }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

/* ── magnetic / tilt card ─────────────────────────────────────────────────── */

export function Tilt({
  children,
  className = '',
  strength = 8,
}: {
  children: React.ReactNode
  className?: string
  strength?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [style, setStyle] = useState<React.CSSProperties>({})
  return (
    <div
      ref={ref}
      className={className}
      style={{ ...style, transformStyle: 'preserve-3d' }}
      onPointerMove={(event) => {
        const node = ref.current
        if (!node) return
        const rect = node.getBoundingClientRect()
        const px = (event.clientX - rect.left) / rect.width - 0.5
        const py = (event.clientY - rect.top) / rect.height - 0.5
        setStyle({
          transform: `perspective(900px) rotateX(${(-py * strength).toFixed(2)}deg) rotateY(${(px * strength).toFixed(2)}deg) translateZ(0)`,
          transition: 'transform 90ms linear',
        })
      }}
      onPointerLeave={() => setStyle({ transform: 'perspective(900px) rotateX(0deg) rotateY(0deg)', transition: 'transform 700ms cubic-bezier(0.22,1,0.36,1)' })}
    >
      {children}
    </div>
  )
}

/* ── misc ─────────────────────────────────────────────────────────────────── */

export function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-white/10 py-2.5">
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone/40">{label}</span>
      <span className="tabnum text-right font-mono text-[11px] text-bone/80">{value}</span>
    </div>
  )
}
