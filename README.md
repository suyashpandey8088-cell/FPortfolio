# Behind The Feed — Deleena Venkatesh

An immersive social media management portfolio built around two real Instagram accounts
that Deleena Venkatesh personally manages.

| # | Account | Profile |
|---|---------|---------|
| 01 | **Padma Jewels** — fine & bridal jewellery | [@padmajewels](https://www.instagram.com/padmajewels/) |
| 02 | **Combat Crew 25** — combat sports & training culture | [@combatcrew25](https://www.instagram.com/combatcrew25/) |

> Both accounts are **personally handled and managed by Deleena Venkatesh**. They are
> presented as direct social media management experience — not as friends' accounts and
> not as collaborative or co-managed projects.

---

## What is on the page

- **Hero** — oversized "BEHIND THE FEED." statement, floating social tiles from both
  accounts, live-looking account badges and a marquee of responsibilities.
- **Intro** — "BUILDING BRANDS. CREATING CONNECTIONS." with the supporting statement and
  an explicit attribution panel.
- **Horizontal showcase** — a scroll-driven side-by-side rail of framed posts and reels
  from both feeds (swipeable rail on mobile).
- **Two account worlds** — each with its own identity:
  - *Padma Jewels*: warm black, velvet, gold serif italic, dotted gold ambience.
  - *Combat Crew 25*: near-black, signal red, condensed type, scanline texture, drift light.
- **Instagram-inspired profile showcases** — profile photograph with gradient ring,
  username + verified mark, posts/followers/following row, bio, profile link, action
  buttons, story highlights, Posts / Reels tabs, an animated content grid with
  hover-responsive thumbnails and reel badges, and a direct "Open on Instagram" link.
- **Reels** — horizontal snap rails with animated play affordances.
- **Full-screen content previews** — keyboard-navigable lightbox (`←` `→`, `Esc`) with
  caption, hashtags, thumbnail strip and a direct profile link.
- **Expandable case studies** for each account, in eight chapters:
  1. Account overview
  2. Content strategy
  3. Management responsibilities
  4. Content planning & scheduling
  5. Visual content creation
  6. Reels & video editing
  7. Audience engagement
  8. Performance metrics (verified-only, placeholders by default)

## Everything is editable

The editor is **hidden from visitors** and only appears when you add `?edit=1` to the URL,
so the published page never shows an editing control or an empty field.

```text
https://your-site.com/?edit=1
```

A floating toolbar (bottom right) then turns the page into an editing surface:

- **Edit content** — click any dashed field (headline, bio, caption, image path, link,
  metric, description, responsibility) and type. Changes save to `localStorage` in the
  browser immediately.
- **Content data panel** — download the whole content model as JSON, copy it, paste JSON
  back in, or reset to the shipped content.

To make edits permanent for every visitor, export the JSON and paste the values into
`src/content/accounts.ts` (or commit the JSON and load it at build time).

### Metric policy

No follower count, engagement rate, reach figure or business-growth number is invented
anywhere in this project. Unverified metrics are **hidden from the published page** — the
profile stats row shows the management credit instead of empty dashes, and the metrics
chapter lists the metric names it will report rather than displaying placeholder values.
Drop a verified figure in via `?edit=1` and it appears immediately.

### Imagery

Imagery in `public/media/` is representative art direction for each feed — editorial
product stills for the jewellery account, gym and ring photography for the combat
account — not scraped Instagram posts. Replace the image paths in edit mode to use real
account content.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
npm run preview
npm run check    # type-check + content integrity test
npm test         # content integrity test only
```

## Content integrity test

`tests/content-check.mjs` renders the whole app server-side and asserts 270 conditions,
including that **no editing placeholder text reaches the page**, that every account's
name, username, bio, gallery, reels and all seven case-study chapters actually render,
that the seed has no blank fields, and that no invented follower/reach figure exists.

It exists because an earlier build shipped with editable paths written as
`accounts.padma.name` while the content is stored as an array (`accounts[0].name`), so
every account-level field silently fell back to the editor's placeholder. Paths are now
resolved through `accountBase()` in `src/store/content.tsx`.

## Deploy

The repo ships `vercel.json` (Vite framework preset, SPA rewrite, immutable asset
caching). On Vercel: import the repo, keep the detected settings, deploy. Locally:

```bash
npm run build && npx serve dist
```

## Before you show it to a client

1. Replace the representative imagery with the accounts' real posts (image paths are
   editable in `?edit=1`).
2. Add verified follower / reach / engagement figures, or leave them out — the page looks
   complete either way.
3. Export the content JSON from the data panel and paste it into
   `src/content/accounts.ts` so the content is permanent, not just in your browser.

## The scroll continuum

`src/components/ScrollContinuum.tsx` is the layer that makes the whole page one continuous
experience. Every major section is tagged with `data-chapter`, and the continuum reads the page as
an ordered sequence of chapters it moves through as you scroll:

```
hero → intro → tunnel → intro → intro → padma → padma-study → combat → combat-study → close
```

Each chapter declares a *world*: haze colours, dust tint, particle density, contour amplitude and
drift speed. The continuum **interpolates between whichever two chapters are adjacent** (with
`smoothstep`), so the world morphs rather than cuts. Three stacked layers:

1. **haze** — three radial fields that slide and recolour as chapters pass
2. **contour field** — warped gradient bands whose amplitude follows the chapter's mood
3. **dust** — depth-parallax motes that **stretch with scroll velocity**, so a flick pulls them into
   streaks and stopping lets them settle

A persistent bottom-left **chapter HUD** names where you are and carries a progress hairline.

Because the continuum is the stage, every section paints transparent — a single `bg-ink/35` wash on
long-form study copy and a gradient scrim on the footer are the only local opacity, and two wash
layers inside the continuum (vertical + vignette) guarantee text contrast at every world state.

Engineering: one passive frame-throttled scroll read, one RAF loop, chapter bands measured only on
layout change (plus once after fonts settle), reduced motion → static per-chapter gradient with no
canvas, low-power/narrow → fewer motes and ~30fps, loop paused on `visibilitychange`.

## The Feed Tunnel (the set piece)

`src/components/FeedTunnel.tsx` — a 360vh section that pins a full-viewport 3D stage. Scroll
progress drives **18 unique frames** (every gallery image from both accounts, interleaved so the
worlds alternate) travelling toward the camera through depth layers, from `z: -2600` to past the
viewer, scaling and fading as they pass. The camera itself rotates on X/Y and drifts laterally, the
gold glow cross-fades to signal red as the tunnel moves from Padma to Combat, and each frame is a
button that jumps to its account. A HUD shows a live frame counter and progress rail.

- One `useScroll` target and spring-smoothed progress — no per-element scroll listeners.
- `wrap01()` guards the lifecycle maths (JS `%` can go negative and would invert depth).
- Reduced motion swaps the tunnel for a static gallery grid; under 768px it renders 12 frames
  instead of 18, with a shallower stage and taller images.
- Every frame title/caption comes from the content model, so the tunnel stays editable.

## Motion, backdrop and scroll behaviour

- **Scroll-driven backdrop** (`src/components/ScrollBackdrop.tsx`) — a fixed canvas layer behind
  every section. Four palette stages cross-fade with scroll progress: warm gold (hero/intro) →
  amber (Padma) → signal red (Combat) → cool steel (attribution/footer), with depth-parallax dust
  drifting on top. One RAF loop for the whole page; palette reads a single passive, frame-throttled
  scroll value.
- **Graceful degradation** — `prefers-reduced-motion` gets a static gradient and no canvas;
  `deviceMemory ≤ 4`, `hardwareConcurrency ≤ 4` or a narrow viewport drops to 26 particles, caps
  DPR at 1.5 and 30fps; the loop pauses on `visibilitychange`.
- **Legibility is guaranteed** — two wash layers (vertical + vignette) sit above the canvas so
  body copy keeps contrast no matter which palette stage is on screen.
- **Smooth scrolling on every device** — Lenis with `syncTouch` (touch is genuinely smoothed, not
  just wheel), `syncTouchLerp` and `touchInertiaExponent` for iOS momentum, coarser curves on
  coarse pointers, `lenis.resize()` on resize/orientation change, and a full bail-out on
  reduced-motion. `overflow-x` lives on `<html>` as `clip` so `<body>` never becomes a scroll
  container (which breaks `position: sticky` and Lenis synchronisation).
- **Stable viewport units** — sticky sections use `100dvh`/`100svh`, so the mobile URL bar
  showing or hiding no longer resizes the layout mid-scroll.

## Stack

React 18 · TypeScript · Vite · Tailwind CSS · Framer Motion (reveals, layout, scroll-linked
motion, lightbox) · Lenis (smooth scrolling) · Google Fonts (Inter Tight, Instrument Serif,
Bebas Neue, JetBrains Mono).

## Structure

```
src/
  App.tsx                     page composition, scroll progress, account jump pill
  content/accounts.ts         the single source of truth for all copy, images and metrics
  store/content.tsx           content context: editing, persistence, export/import, viewer
  hooks/useSmoothScroll.ts    Lenis setup + Lenis-aware scrollToId
  components/
    Hero.tsx                  opening statement, floating tiles
    IntroStatement.tsx        section statement + attribution summary + world split
    HorizontalShowcase.tsx    scroll-driven horizontal rail (desktop) / swipe rail (mobile)
    AccountPanel.tsx          per-account world: profile showcase, identity, gallery, reels
    InstagramProfile.tsx      the Instagram-inspired profile card
    CaseStudy.tsx             eight-chapter expandable case study with metrics
    FullscreenViewer.tsx      full-screen post/reel preview
    Attribution.tsx           attribution section + footer
    EditToolbar.tsx           editing toolbar and content data panel
    primitives.tsx            Editable text, editable lists/images, reveals, tilt
```
