import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { accountsSeed, siteSeed, type Account, type SiteContent } from '../content/accounts'

const STORAGE_KEY = 'behind-the-feed.content.v1'

const defaultContent: SiteContent = { ...siteSeed, accounts: accountsSeed }

/* ── path helpers ─────────────────────────────────────────────────────────── */

type Path = string

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function readPath(obj: any, path: Path) {
  return path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), obj)
}

function writePath<T>(obj: T, path: Path, value: unknown): T {
  const keys = path.split('.')
  const next: any = clone(obj)
  let cursor: any = next
  for (let i = 0; i < keys.length - 1; i += 1) {
    cursor = cursor[keys[i]]
    if (cursor == null) return next
  }
  cursor[keys[keys.length - 1]] = value
  return next
}

function mergeContent(saved: any): SiteContent {
  const merged: SiteContent = clone(defaultContent)
  if (!saved || typeof saved !== 'object') return merged

  const walk = (target: any, source: any) => {
    if (Array.isArray(target) && Array.isArray(source)) {
      target.forEach((item, index) => {
        if (index < source.length) walk(item, source[index])
      })
      return
    }
    if (target && typeof target === 'object' && source && typeof source === 'object') {
      Object.keys(target).forEach((key) => {
        if (key in source) walk(target[key], source[key])
      })
    }
  }
  walk(merged, saved)
  return merged
}

/* ── context ──────────────────────────────────────────────────────────────── */

export type ViewerItem = {
  image: string
  type: string
  title: string
  caption: string
  tags?: string
  href?: string
  handle?: string
  accent: 'gold' | 'signal'
  ratio?: 'square' | 'portrait' | 'story'
}

type ContentCtx = {
  content: SiteContent
  set: (path: Path, value: unknown) => void
  editing: boolean
  setEditing: (value: boolean) => void
  resetAll: () => void
  importJson: (raw: string) => { ok: boolean; message: string }
  exportJson: () => string
  viewer: { items: ViewerItem[]; index: number } | null
  openViewer: (items: ViewerItem[], index: number) => void
  closeViewer: () => void
  stepViewer: (delta: number) => void
  isDirty: boolean
}

const Ctx = createContext<ContentCtx | null>(null)

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<SiteContent>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) return mergeContent(JSON.parse(raw))
    } catch {
      /* ignore corrupt storage */
    }
    return clone(defaultContent)
  })
  const [editing, setEditing] = useState(false)
  const [isDirty, setDirty] = useState(() => {
    try {
      return Boolean(localStorage.getItem(STORAGE_KEY))
    } catch {
      return false
    }
  })
  const [viewer, setViewer] = useState<{ items: ViewerItem[]; index: number } | null>(null)

  const persist = useCallback((next: SiteContent) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      setDirty(true)
    } catch {
      /* storage full or blocked */
    }
  }, [])

  const set = useCallback(
    (path: Path, value: unknown) => {
      setContent((prev) => {
        const next = writePath(prev, path, value)
        persist(next)
        return next
      })
    },
    [persist],
  )

  const resetAll = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* noop */
    }
    setContent(clone(defaultContent))
    setDirty(false)
  }, [])

  const exportJson = useCallback(() => JSON.stringify(content, null, 2), [content])

  const importJson = useCallback(
    (raw: string) => {
      try {
        const parsed = JSON.parse(raw)
        const merged = mergeContent(parsed)
        setContent(merged)
        persist(merged)
        return { ok: true, message: 'Content imported.' }
      } catch {
        return { ok: false, message: 'That is not valid JSON.' }
      }
    },
    [persist],
  )

  const openViewer = useCallback((items: ViewerItem[], index: number) => {
    setViewer({ items, index })
  }, [])
  const closeViewer = useCallback(() => setViewer(null), [])
  const stepViewer = useCallback((delta: number) => {
    setViewer((prev) => {
      if (!prev) return prev
      const next = (prev.index + delta + prev.items.length) % prev.items.length
      return { ...prev, index: next }
    })
  }, [])

  const value = useMemo(
    () => ({
      content,
      set,
      editing,
      setEditing,
      resetAll,
      importJson,
      exportJson,
      viewer,
      openViewer,
      closeViewer,
      stepViewer,
      isDirty,
    }),
    [content, set, editing, resetAll, importJson, exportJson, viewer, openViewer, closeViewer, stepViewer, isDirty],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useContent() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useContent must be used inside ContentProvider')
  return ctx
}

export function useAccount(id: string): Account {
  const { content } = useContent()
  return content.accounts.find((a) => a.id === id) ?? content.accounts[0]
}

/* ── debounced text commit helper ─────────────────────────────────────────── */

export function useTextCommit(onCommit: (value: string) => void) {
  const timer = useRef<number | null>(null)
  return useCallback(
    (value: string) => {
      if (timer.current) window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => onCommit(value), 220)
    },
    [onCommit],
  )
}

export function useLockBody(locked: boolean) {
  useEffect(() => {
    if (!locked) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [locked])
}
