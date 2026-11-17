import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useContent } from '../store/content'

export default function EditToolbar() {
  const { editing, setEditing, resetAll, exportJson, importJson, isDirty } = useContent()
  const [panel, setPanel] = useState<'none' | 'io'>('none')
  const [enabled, setEnabled] = useState(false)

  /* The editor is a tool for the site owner, not a visitor-facing control.
     It only appears with ?edit=1 in the URL. */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setEnabled(params.get('edit') === '1')
  }, [])

  useEffect(() => {
    if (!enabled && editing) setEditing(false)
  }, [enabled, editing, setEditing])

  if (!enabled) return null
  const [raw, setRaw] = useState('')
  const [status, setStatus] = useState('')

  const download = () => {
    const blob = new Blob([exportJson()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'behind-the-feed-content.json'
    anchor.click()
    URL.revokeObjectURL(url)
    setStatus('Exported to JSON.')
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(exportJson())
      setStatus('Copied JSON to clipboard.')
    } catch {
      setStatus('Clipboard blocked — use download.')
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-[90] flex flex-col items-end gap-2 print:hidden">
      <AnimatePresence>
        {panel === 'io' && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.28 }}
            className="glass w-[min(92vw,26rem)] rounded-lg border border-white/15 p-4 shadow-2xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-gold">Content data</p>
                <p className="mt-1 text-[11.5px] leading-relaxed text-bone/55">
                  Every description, image path, link and metric on this page is editable. Export the JSON to make
                  changes permanent in source.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPanel('none')}
                className="ml-3 text-bone/40 hover:text-bone"
                aria-label="Close data panel"
              >
                ✕
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={download}
                className="rounded-full bg-gold px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-ink hover:opacity-85"
              >
                Download JSON
              </button>
              <button
                type="button"
                onClick={copy}
                className="rounded-full border border-white/20 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-bone/70 hover:border-white/40"
              >
                Copy
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Reset all edits and go back to the shipped content?')) {
                    resetAll()
                    setStatus('Reset to shipped content.')
                  }
                }}
                className="rounded-full border border-red-400/30 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-red-300/80 hover:border-red-400/60"
              >
                Reset
              </button>
            </div>
            <div className="mt-3">
              <label className="font-mono text-[8px] uppercase tracking-[0.2em] text-bone/35">
                Paste JSON to import
              </label>
              <textarea
                value={raw}
                onChange={(event) => setRaw(event.target.value)}
                rows={3}
                placeholder='{"accounts": […] }'
                className="mt-1.5 w-full resize-none rounded border border-white/12 bg-black/50 p-2 font-mono text-[10px] text-bone/70 outline-none focus:border-gold/50"
              />
              <button
                type="button"
                onClick={() => {
                  const result = importJson(raw)
                  setStatus(result.message)
                  if (result.ok) setRaw('')
                }}
                className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-gold/80 hover:text-gold"
              >
                Import →
              </button>
            </div>
            {status && <p className="mt-2 font-mono text-[8.5px] text-emerald-300/70">{status}</p>}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-black/70 p-1.5 backdrop-blur-xl">
        {isDirty && (
          <span className="hidden pl-2 pr-1 font-mono text-[8px] uppercase tracking-[0.16em] text-gold/70 sm:block">
            Local edits
          </span>
        )}
        <button
          type="button"
          onClick={() => setPanel(panel === 'io' ? 'none' : 'io')}
          className="grid h-8 w-8 place-items-center rounded-full text-bone/55 transition-colors hover:bg-white/10 hover:text-bone"
          aria-label="Content data panel"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="M4 6h16M4 12h16M4 18h10" strokeLinecap="round" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => setEditing(!editing)}
          className={`flex items-center gap-2 rounded-full px-3.5 py-2 font-mono text-[9px] uppercase tracking-[0.18em] transition-colors ${
            editing ? 'bg-gold text-ink' : 'text-bone/70 hover:bg-white/10'
          }`}
          aria-pressed={editing}
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 20h4l10-10-4-4L4 16z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {editing ? 'Editing on' : 'Edit content'}
        </button>
      </div>

      <AnimatePresence>
        {editing && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="max-w-[15rem] rounded border border-gold/25 bg-black/70 px-2.5 py-1.5 text-right font-mono text-[8px] leading-relaxed tracking-wide text-gold/70 backdrop-blur"
          >
            Click any dashed field to edit · changes save in this browser
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
