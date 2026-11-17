# Deleena V. — portfolio

A maximalist, scroll-driven portfolio for Deleena Venkatesh — creative designer, video editor and
social media manager.

Concept: **TOO CREATIVE TO BE ORDINARY.**

---

## What this is

Ten **scenes**, each with its own colour identity, type voice and composition. Scrolling is the only
navigation that matters: it drives the palette, the horizontal project gallery, the drawings, the
marquees and every reveal.

| # | Scene | Identity |
|---|-------|----------|
| — | Hero | jet black · electric orange · collage stack |
| 01 | About | warm cream · editorial serif · asymmetric marginalia |
| 02 | Expertise | cobalt · acid lime · a broken type wall, not cards |
| 03 | Projects | forest green · neon · **pinned horizontal gallery** |
| 04 | Instagram | deep purple · lavender · two composed account plates |
| 05 | Experience | cream · blood red · a timeline that draws itself |
| 06 | Toolkit | black · acid · five plates that lift and spill colour |
| 07 | Moodboard | near-black · hot pink · a parallax collage |
| 08 | Impact | blood red · neon · giant countable figures |
| 09 | Contact | electric orange · ink · poster finale |

---

## The scroll system

Three systems, deliberately layered:

1. **Lenis** (`src/hooks/useSmoothScroll.ts`) owns the scroll, including touch (`syncTouch`) and
   pauses when the tab is hidden. It bails entirely under `prefers-reduced-motion`.
2. **GSAP ScrollTrigger** (`src/hooks/useScrollScenes.ts`) is fed from Lenis's scroll event, never
   from native scroll — that is what keeps a pinned section from drifting out of sync.
3. **The scene colour engine** (`useScrollScenes`) watches every `[data-scene]` block and rewrites
   `--scene-bg` / `--scene-fg` / `--scene-accent` as each one crosses 40% of the viewport. Every
   `.scene` cross-fades to the new identity via CSS transition, so the background *evolves* instead
   of cutting.

### Pinned horizontal projects

On fine pointers ≥1024px the projects section pins and vertical scroll drives the track sideways,
with `scrub` and `invalidateOnRefresh` so it re-measures correctly. On touch and reduced-motion
devices it degrades to a **native horizontal scroller** — hijacking the scroll on a thumb is a
usability tax, and the brief explicitly forbids forced page overflow.

### Craft rules encoded as tests

`tests/content-check.mjs` asserts the design rules, not just the content:

- every scene id is unique and every scene declares its own identity
- section reveals must *move* as well as fade (the lazy pattern the brief calls out)
- four typefaces actually in play
- the cursor is pointer-only
- the preloader is on a fixed clock and cannot hang
- the projects pin is desktop-only, with a native fallback
- reduced motion honoured in both the scroll and the animation layer

---

## Content model

Everything Deleena-specific lives in `src/content/`:

- `site.ts` — identity, about, expertise, projects, experience, toolkit, impact, contact, moodboard,
  and the `SCENES` palette table
- `accounts.ts` — the two real Instagram accounts, their galleries, reels and case-study chapters

### Honesty rules, enforced by test

- **No invented metrics.** No follower counts, engagement rates, reach or growth figures appear
  anywhere. The impact figures count *work* — 2 accounts, 6 projects, 10 disciplines, 5 tools.
- Both accounts are credited as **personally managed by Deleena Venkatesh**.
- The toolkit lists only software actually used: Premiere Pro, After Effects, Photoshop, Canva,
  Figma.

---

## Imagery

`public/media/` holds the original Instagram gallery imagery plus `art-01…06`, which are **generated
art-direction studies** — abstract collage and texture, deliberately not portraits. They stand in for
photography until real shots of Deleena and her work are supplied. When they arrive, swap the paths in
`site.ts` (`about` figure, hero stack, moodboard) and in each project's `images` array.

## Typography

Clash Display, Space Grotesk, Syne, Bebas Neue, Instrument Serif, DM Mono, Archivo Black — loaded from
Google Fonts in `src/index.css`, mapped in `tailwind.config.js`.

## Responsiveness

- **Desktop** — full choreography, custom cursor, pinned horizontal projects, pointer parallax
- **Tablet** — pin disabled, native horizontal scroller, simplified reveals
- **Mobile** — native vertical scroll, touch-friendly galleries, no forced horizontal overflow
- **Reduced motion** — no Lenis, no pin, no cursor, static reveals; all content still present

## Development

```bash
npm install
npm run dev      # vite dev server
npm test         # 104 assertions: content integrity + architecture rules
npm run build    # production build
```

## Known gaps

- **Video editing section is not built.** The seven video links were not supplied; each project's
  `video` field is typed and ready (`{ url, kind }` with `youtube | vimeo | instagram | file`) so a
  correct player can be wired per platform once the URLs exist.
- **No real portrait.** See Imagery above.
- **Contact form posts nowhere** — it composes a `mailto:`. That is deliberate: no broken endpoint,
  no third-party service, no silent data loss.
