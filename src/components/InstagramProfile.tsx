import { motion } from 'framer-motion'
import { useState } from 'react'
import { accountBase, useContent, type ViewerItem } from '../store/content'
import type { Account } from '../content/accounts'
import { Editable, EditableImage, Reveal } from './primitives'

const EASE = [0.22, 1, 0.36, 1] as const

function IgIcon({ name, className = 'h-5 w-5' }: { name: string; className?: string }) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  switch (name) {
    case 'grid':
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      )
    case 'reel':
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <path d="M3 8h18M8 3l2.5 5M15.5 3 18 8" />
          <path d="m11 12 3.5 2-3.5 2z" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'tag':
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="M20 12v7a1 1 0 0 1-1 1h-7L4 12V4h8z" />
          <circle cx="8.5" cy="8.5" r="1.4" />
        </svg>
      )
    case 'play':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M8 5.5v13l11-6.5z" />
        </svg>
      )
    case 'heart':
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="M12 20s-7-4.4-7-9.3A4.1 4.1 0 0 1 12 7.8a4.1 4.1 0 0 1 7 2.9c0 4.9-7 9.3-7 9.3Z" />
        </svg>
      )
    case 'comment':
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="M21 12a8.5 8.5 0 0 1-12.5 7.5L3 21l1.5-5.4A8.5 8.5 0 1 1 21 12Z" />
        </svg>
      )
    case 'send':
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="M21 3 10.5 13.5M21 3l-6.5 18-4-8-8-4z" />
        </svg>
      )
    case 'bookmark':
      return (
        <svg viewBox="0 0 24 24" className={className} {...common}>
          <path d="M6 3h12v18l-6-4.5L6 21z" />
        </svg>
      )
    case 'dots':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <circle cx="5" cy="12" r="1.7" />
          <circle cx="12" cy="12" r="1.7" />
          <circle cx="19" cy="12" r="1.7" />
        </svg>
      )
    case 'verified':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="m12 2 2.4 1.8 3-.2 1 2.8 2.6 1.5-1 2.8 1 2.8-2.6 1.5-1 2.8-3-.2L12 22l-2.4-1.8-3 .2-1-2.8L3 16.1l1-2.8-1-2.8 2.6-1.5 1-2.8 3 .2z" opacity="0.28" />
          <path d="m8.4 12.2 2.4 2.4 4.8-4.9" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    default:
      return null
  }
}

export default function InstagramProfile({
  account,
  variant,
}: {
  account: Account
  variant: 'padma' | 'combat'
}) {
  const { content, openViewer, editing, set } = useContent()
  const [tab, setTab] = useState<'posts' | 'reels'>('posts')
  const base = accountBase(content.accounts, account.id)
  const isCombat = variant === 'combat'
  const accentText = isCombat ? 'text-signal' : 'text-gold'
  const accentBg = isCombat ? 'bg-signal' : 'bg-gold'
  const ring = isCombat ? 'combat-ring' : 'padma-ring'

  const hasValue = (value: string) => Boolean(value && value.trim() && value.trim() !== '—')
  const showStats = editing || Object.values(account.stats).some(hasValue)

  const posts = account.gallery
  const viewerItems: ViewerItem[] = posts.map((item) => ({
    image: item.image,
    type: item.type,
    title: item.title,
    caption: item.caption,
    tags: item.tags,
    href: item.url ?? account.url,
    handle: account.username,
    accent: isCombat ? 'signal' : 'gold',
  }))

  return (
    <div
      className={`relative overflow-hidden rounded-[22px] border shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] ${
        isCombat ? 'border-white/12 bg-[#0b0b0d]' : 'border-white/12 bg-[#0c0906]'
      }`}
    >
      {/* top chrome */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <div className="flex items-center gap-3">
          <svg viewBox="0 0 24 24" className="h-4 w-4 text-white/80" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="flex items-baseline gap-1.5">
            <Editable
              path={`${base}.username`}
              as="span"
              className="text-[13px] font-semibold tracking-tight text-white"
            />
            <IgIcon name="verified" className={`h-3.5 w-3.5 ${accentText}`} />
          </div>
        </div>
        <div className="flex items-center gap-4 text-white/70">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
          <IgIcon name="dots" className="h-4 w-4" />
        </div>
      </div>

      {/* profile head */}
      <div className={`relative px-5 pb-4 pt-5 ${isCombat ? 'bg-[radial-gradient(circle_at_20%_-10%,rgba(255,58,33,0.14),transparent_58%)]' : 'bg-[radial-gradient(circle_at_20%_-10%,rgba(217,174,98,0.16),transparent_58%)]'}`}>
        <div className="flex items-start gap-5">
          {/* avatar with ring */}
          <div className="relative shrink-0">
            <div className={`rounded-full p-[2.5px] ${ring}`}>
              <div className="rounded-full bg-[#0b0b0d] p-[2px]">
                <EditableImage
                  path={`${base}.avatar`}
                  src={account.avatar}
                  alt={`${account.name} profile photograph`}
                  className="h-[76px] w-[76px] rounded-full sm:h-[88px] sm:w-[88px]"
                />
              </div>
            </div>
            <span
              className={`absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border px-2 py-[3px] font-mono text-[7px] uppercase tracking-[0.16em] ${
                isCombat
                  ? 'border-signal/50 bg-[#120404] text-signal'
                  : 'border-gold/50 bg-[#0f0a05] text-gold'
              }`}
            >
              managed
            </span>
          </div>

          {/* stats — only rendered once real counts exist, so a published profile
              never shows empty dashes. Edit mode always shows the fields. */}
          {showStats ? (
            <div className="flex flex-1 items-start justify-around gap-2 pt-1">
              {[
                { key: 'posts', label: 'posts' },
                { key: 'followers', label: 'followers' },
                { key: 'following', label: 'following' },
              ]
                .filter((stat) => editing || hasValue((account.stats as any)[stat.key]))
                .map((stat) => (
                  <div key={stat.key} className="text-center">
                    <Editable
                      path={`${base}.stats.${stat.key}`}
                      as="p"
                      className="tabnum text-[15px] font-semibold leading-none text-white"
                      ariaLabel={`${account.name} ${stat.label}`}
                    />
                    <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-white/50">
                      {stat.label}
                    </p>
                  </div>
                ))}
            </div>
          ) : (
            <div className="flex flex-1 flex-col justify-center gap-1.5 pt-1">
              <p
                className={`font-mono text-[7.5px] uppercase tracking-[0.2em] ${
                  isCombat ? 'text-signal/80' : 'text-gold/80'
                }`}
              >
                Personally managed
              </p>
              <p className="text-[12px] leading-snug text-white/60">
                Content, captions, scheduling and community — run end to end by Deleena
                Venkatesh.
              </p>
              <p className="font-mono text-[7.5px] uppercase tracking-[0.16em] text-white/25">
                Live counts on Instagram
              </p>
            </div>
          )}
        </div>

        {/* identity */}
        <div className="mt-4">
          <div className="flex flex-wrap items-center gap-2">
            <Editable
              path={`${base}.name`}
              as="h4"
              className={`text-[15px] font-bold leading-tight tracking-tight text-white ${
                isCombat ? 'font-cond text-[19px] tracking-[0.04em]' : ''
              }`}
            />
            <span
              className={`rounded-sm border px-1.5 py-[2px] font-mono text-[7.5px] uppercase tracking-[0.14em] ${
                isCombat ? 'border-signal/40 text-signal/90' : 'border-gold/40 text-gold/90'
              }`}
            >
              {account.category}
            </span>
          </div>
          <Editable
            path={`${base}.bio`}
            as="p"
            multiline
            className="mt-2 text-[12px] leading-[1.6] text-white/70"
          />
          <a
            href={account.url}
            target="_blank"
            rel="noreferrer noopener"
            className={`mt-1.5 inline-flex items-center gap-1 text-[11.5px] font-medium ${accentText} hover:underline`}
          >
            instagram.com/{account.username.replace('@', '')}/
            <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17 17 7M9 7h8v8" />
            </svg>
          </a>
        </div>

        {/* action buttons */}
        <div className="mt-4 flex items-center gap-1.5">
          <a
            href={account.url}
            target="_blank"
            rel="noreferrer noopener"
            className={`flex-1 rounded-lg py-2 text-center text-[11.5px] font-semibold transition-opacity hover:opacity-85 ${
              isCombat ? 'bg-signal text-white' : 'bg-gold text-[#150f05]'
            }`}
          >
            View profile
          </a>
          <a
            href={`https://ig.me/m/${account.username.replace('@', '')}`}
            target="_blank"
            rel="noreferrer noopener"
            className="flex-1 rounded-lg bg-white/10 py-2 text-center text-[11.5px] font-semibold text-white transition-colors hover:bg-white/16"
          >
            Message
          </a>
          <button
            type="button"
            className="grid h-8 w-8 place-items-center rounded-lg bg-white/10 text-white transition-colors hover:bg-white/16"
            aria-label="Account suggestions"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>

        {/* highlights */}
        <div className="scrollbar-none mt-5 flex gap-4 overflow-x-auto">
          {account.highlights.map((highlight, index) => (
            <button
              key={highlight.id}
              type="button"
              onClick={() =>
                openViewer(
                  account.gallery.map((item) => ({
                    image: item.image,
                    type: item.type,
                    title: item.title,
                    caption: item.caption,
                    tags: item.tags,
                    href: item.url ?? account.url,
                    handle: account.username,
                    accent: isCombat ? ('signal' as const) : ('gold' as const),
                  })),
                  Math.min(index, account.gallery.length - 1),
                )
              }
              className="group flex shrink-0 flex-col items-center gap-1.5"
            >
              <span className="rounded-full border border-white/20 p-[2px] transition-colors group-hover:border-white/60">
                <EditableImage
                  path={`${base}.highlights.${index}.image`}
                  src={highlight.image}
                  alt={`${highlight.label} highlight`}
                  className="h-[50px] w-[50px] rounded-full"
                  imgClassName="transition-transform duration-700 group-hover:scale-110"
                />
              </span>
              <Editable
                path={`${base}.highlights.${index}.label`}
                as="span"
                className="max-w-[58px] truncate text-center text-[10px] text-white/75"
              />
            </button>
          ))}
          {editing && (
            <button
              type="button"
              onClick={() => {
                const next = [
                  ...account.highlights,
                  {
                    id: `h-${Date.now()}`,
                    label: 'New',
                    image: account.highlights[0]?.image ?? account.avatar,
                  },
                ]
                set(`${base}.highlights`, next)
              }}
              className="mt-2 flex h-[50px] w-[50px] shrink-0 flex-col items-center justify-center gap-0.5 rounded-full border border-dashed border-gold/50 font-mono text-[7px] uppercase tracking-[0.1em] text-gold/70 hover:bg-gold/10"
            >
              + add
            </button>
          )}
        </div>
      </div>

      {/* tabs */}
      <div className="flex border-y border-white/10">
        {[
          { key: 'posts' as const, icon: 'grid', label: 'Posts' },
          { key: 'reels' as const, icon: 'reel', label: 'Reels' },
        ].map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key)}
            className={`relative flex flex-1 items-center justify-center gap-1.5 py-2.5 text-[10px] uppercase tracking-[0.14em] transition-colors ${
              tab === item.key ? 'text-white' : 'text-white/35 hover:text-white/60'
            }`}
          >
            <IgIcon name={item.icon} className="h-4 w-4" />
            <span className="font-mono text-[9px]">{item.label}</span>
            {tab === item.key && (
              <motion.span
                layoutId={`tab-${account.id}`}
                className={`absolute inset-x-0 -bottom-px h-px ${accentBg}`}
              />
            )}
          </button>
        ))}
      </div>

      {/* grid */}
      <div className="relative p-1">
        {tab === 'posts' ? (
          <motion.div layout className="grid grid-cols-3 gap-1">
            {posts.map((item, index) => (
              <motion.button
                key={item.id}
                type="button"
                initial={{ opacity: 0, scale: 0.94 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-5%' }}
                transition={{ duration: 0.55, delay: (index % 6) * 0.05, ease: EASE }}
                onClick={() => openViewer(viewerItems, index)}
                className="group relative aspect-square overflow-hidden bg-white/5"
                aria-label={`Open ${item.title}`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  style={{ objectPosition: item.pos ?? 'center' }}
                  className="h-full w-full object-cover transition-transform duration-[1.1s] ease-swift group-hover:scale-[1.12]"
                />
                <span
                  className={`absolute inset-0 transition-opacity duration-300 ${
                    isCombat
                      ? 'bg-gradient-to-t from-[#160403]/95 via-[#160403]/20 to-transparent opacity-0 group-hover:opacity-100'
                      : 'bg-gradient-to-t from-[#120c05]/95 via-[#120c05]/20 to-transparent opacity-0 group-hover:opacity-100'
                  }`}
                />
                <span className="absolute inset-x-0 bottom-0 translate-y-2 p-2 text-left opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <span className={`font-mono text-[7px] uppercase tracking-[0.18em] ${accentText}`}>
                    {item.type}
                  </span>
                  <span className="mt-0.5 block text-[9px] font-medium leading-tight text-white line-clamp-2">
                    {item.title}
                  </span>
                </span>
                {item.type === 'Reel' && (
                  <span className="absolute right-1.5 top-1.5 text-white/90 drop-shadow">
                    <IgIcon name="play" className="h-3 w-3" />
                  </span>
                )}
                {item.type === 'Carousel' && (
                  <span className="absolute right-1.5 top-1.5 text-white/90 drop-shadow">
                    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="8" y="3" width="13" height="13" rx="2" />
                      <path d="M16 21H5a2 2 0 0 1-2-2V8" />
                    </svg>
                  </span>
                )}
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-3 gap-1"
          >
            {account.reels.map((reel, index) => (
              <button
                key={reel.id}
                type="button"
                onClick={() =>
                  openViewer(
                    account.reels.map((item) => ({
                      image: item.image,
                      type: 'Reel',
                      title: item.title,
                      caption: item.caption,
                      tags: item.tags,
                      href: account.url,
                      handle: account.username,
                      accent: isCombat ? ('signal' as const) : ('gold' as const),
                      ratio: 'story' as const,
                    })),
                    index,
                  )
                }
                className="group relative aspect-[9/14] overflow-hidden bg-white/5"
              >
                <img
                  src={reel.image}
                  alt={reel.title}
                  loading="lazy"
                  className="h-full w-full object-cover opacity-85 transition-all duration-[1.2s] ease-swift group-hover:scale-110 group-hover:opacity-100"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/25" />
                <span className="absolute left-1.5 top-1.5 font-mono text-[7px] uppercase tracking-[0.16em] text-white/70">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="absolute inset-0 grid place-items-center">
                  <span className="grid h-8 w-8 translate-y-1 place-items-center rounded-full border border-white/50 bg-black/25 text-white backdrop-blur-sm transition-all duration-500 group-hover:translate-y-0 group-hover:scale-110 group-hover:bg-white/20">
                    <IgIcon name="play" className="ml-0.5 h-3 w-3" />
                  </span>
                </span>
                <span className="absolute inset-x-0 bottom-0 p-1.5 text-left">
                  <span className="block truncate text-[8.5px] font-medium text-white">{reel.title}</span>
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </div>

      {/* profile footer */}
      <div className="border-t border-white/10 px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/30">
            {account.status}
          </span>
          <a
            href={account.url}
            target="_blank"
            rel="noreferrer noopener"
            className={`flex items-center gap-1 font-mono text-[8px] uppercase tracking-[0.18em] ${accentText} hover:underline`}
          >
            Open on Instagram ↗
          </a>
        </div>
      </div>
    </div>
  )
}

export { IgIcon }
