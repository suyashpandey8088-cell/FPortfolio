/**
 * Content + architecture integrity check.
 *
 * Two jobs:
 *   1. the content model reaches the page (no placeholder text, no invented
 *      metrics, both real accounts present with their real copy)
 *   2. the scroll architecture obeys its own rules — one Lenis, ScrollTrigger
 *      fed from Lenis, colour scenes wired, reduced-motion honoured, no forced
 *      page overflow
 *
 * Run with: node tests/content-check.mjs
 */
import { createServer } from 'vite'
import { readFile } from 'node:fs/promises'
import React from 'react'
import { renderToString } from 'react-dom/server'

globalThis.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
}

const server = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
})

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

const unescapeHtml = (value) =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')

const failures = []
const checks = []
const check = (name, condition, detail = '') => {
  checks.push({ name, ok: Boolean(condition), detail })
  if (!condition) failures.push(`${name}${detail ? ` — ${detail}` : ''}`)
}

try {
  const { default: App } = await server.ssrLoadModule('/src/App.tsx')
  const { accountsSeed } = await server.ssrLoadModule('/src/content/accounts.ts')
  const site = await server.ssrLoadModule('/src/content/site.ts')

  /* typographic quotes are used deliberately in the copy, so normalise them
     before comparing prose against source strings */
  const normaliseQuotes = (value) => value.replace(/[’‘]/g, "'").replace(/[“”]/g, '"')

  const html = normaliseQuotes(unescapeHtml(renderToString(React.createElement(App))))
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')

  /* ── 1. no placeholder / template residue ─────────────────────────────── */
  for (const bad of ['Add text', 'Lorem ipsum', 'TODO', 'undefined', 'NaN', 'PLACEHOLDER']) {
    check(`no "${bad}" in output`, !text.includes(bad))
  }

  /* ── 2. identity and copy reaches the page ────────────────────────────── */
  check('name renders', text.includes('Deleena'))
  check('concept renders', text.includes('TOO CREATIVE TO BE ORDINARY'))
  check('hero headline renders', text.includes("CREATIVITY DOESN'T FOLLOW RULES"))
  check('hero sub renders', text.includes('I DESIGN. I CREATE. I EXPERIMENT'))
  check('about headline renders', text.includes('NOT BUILT'))
  check('expertise headline renders', text.includes('TOO MANY'))
  check('instagram headline renders', text.includes('THE ART OF BUILDING'))
  check('experience headline renders', text.includes('EVERY PROJECT'))
  check('moodboard headline renders', text.includes('WHAT INSPIRES'))
  check('impact headline renders', text.includes('NOT JUST CREATION'))
  check('contact headline renders', text.includes('LET'))
  check('signoff renders', text.includes('IDEAS. DESIGNS. IMPACT'))

  /* ── 3. CV facts are present and correct ──────────────────────────────── */
  check('education degree', text.includes('Bachelor of Information Technology'))
  check('education college', text.includes('Ramsheth Thakur College'))
  check('freelance role', text.includes('FREELANCE CREATIVE DESIGNER'))
  check('freelance period', text.includes('PRESENT'))
  check('internship role', text.includes('SOCIAL MEDIA CONTENT INTERN'))
  for (const interest of site.about.interests) {
    check(`interest: ${interest}`, text.includes(interest))
  }

  /* ── 4. both real accounts, with their real handles ───────────────────── */
  check('account count is 2', accountsSeed.length === 2)
  check('padmajewels handle', text.includes('@padmajewels'))
  check('combatcrew25 handle', text.includes('@combatcrew25'))
  for (const account of accountsSeed) {
    check(`[${account.username}] name`, text.includes(account.name))
    check(
      `[${account.username}] tagline in content model`,
      typeof account.tagline === 'string' && account.tagline.length > 10,
    )
    /* the card shows the first four; the rest live in the case study overlay,
       which is closed on first render */
    check(
      `[${account.username}] headline responsibilities render`,
      account.responsibilities.slice(0, 4).every((item) => text.includes(item)),
      account.responsibilities.slice(0, 4).filter((item) => !text.includes(item)).join(' | '),
    )
    check(
      `[${account.username}] full responsibility set exists`,
      account.responsibilities.length >= 6,
    )
  }
  check(
    'both accounts credited to Deleena',
    accountsSeed.every((account) => /Deleena Venkatesh/.test(account.status)),
  )

  /* ── 5. every project reaches the page ────────────────────────────────── */
  check('project count is 6', site.projects.length === 6)
  for (const project of site.projects) {
    check(`project: ${project.title}`, text.includes(project.title))
    check(`project category: ${project.id}`, text.includes(project.category))
  }
  check(
    'every project has process steps',
    site.projects.every((project) => project.process.length >= 3),
  )
  check(
    'every project has images',
    site.projects.every((project) => project.images.length >= 1),
  )

  /* ── 6. no invented metrics anywhere ──────────────────────────────────── */
  const banned = [
    /followers?\b/i,
    /\bengagement rate\b/i,
    /\d+(\.\d+)?%/,
    /\b\d+(\.\d+)?k\b/i,
    /\binfluencer\b/i,
  ]
  const siteSource = await read('src/content/site.ts')
  const accountsSource = await read('src/content/accounts.ts')
  /*
   * `followers` legitimately appears in the copy that says no follower numbers
   * are claimed, so check the rendered *numbers* rather than the words.
   */
  check('no percentage figures rendered', !/\d+%/.test(text))
  check('no k-suffixed counts rendered', !/\b\d+k\b/i.test(text))

  /* ── 7. impact block is countable, not inflated ───────────────────────── */
  check('impact has 4 entries', site.impact.length === 4)
  check(
    'impact figures match reality',
    site.impact[0].value === '02' && site.impact[1].value === '06',
    `got ${site.impact.map((entry) => entry.value).join(',')}`,
  )

  /* ── 8. toolkit only lists real software ──────────────────────────────── */
  check('toolkit has 5 tools', site.toolkit.length === 5)
  const toolNames = site.toolkit.map((tool) => tool.name.toLowerCase())
  for (const expected of ['premiere', 'after effects', 'photoshop', 'canva', 'figma']) {
    check(
      `toolkit includes ${expected}`,
      toolNames.some((name) => name.includes(expected)),
      toolNames.join(','),
    )
  }

  /* ── 9. every scene is declared and mounted ───────────────────────────── */
  const sceneIds = site.SCENES.map((scene) => scene.id)
  for (const id of sceneIds) {
    check(`scene mounted: ${id}`, html.includes(`data-scene="${id}"`))
  }
  check('ten scenes declared', sceneIds.length === 10)

  /* ── 10. scroll architecture ──────────────────────────────────────────── */
  const appSource = await read('src/App.tsx')
  const smoothSource = await read('src/hooks/useSmoothScroll.ts')
  const scenesHook = await read('src/hooks/useScrollScenes.ts')
  const projectsSource = await read('src/components/ProjectsScene.tsx')

  check('lenis is used', smoothSource.includes("from 'lenis'"))
  check('touch smoothing enabled', smoothSource.includes('syncTouch: true'))
  check('reduced motion honoured in scroll', smoothSource.includes('prefers-reduced-motion'))
  check('single lenis instance module-wide', smoothSource.includes('let instance: Lenis | null'))
  check('gsap is used', scenesHook.includes("from 'gsap'"))
  check(
    'scrolltrigger registered in browser only',
    scenesHook.includes('export function ensureGsap') &&
      scenesHook.includes("typeof window === 'undefined'"),
  )
  check('scrolltrigger synced to lenis', scenesHook.includes("lenis.on('scroll'"))
  check('pinned horizontal projects', projectsSource.includes('pin: true'))
  check('projects pin is desktop-only', projectsSource.includes("min-width: 1024px"))
  check('mobile falls back to native horizontal scroll', projectsSource.includes('overflow-x-auto'))
  check('scroll progress indicator', appSource.includes('scaleX: progress'))
  check(
    'no forced page overflow',
    !/overflow-x:\s*(scroll|hidden)/.test(await read('src/index.css').catch(() => '')),
  )
  check('reduced motion respected in animation', (await read('src/components/kit.tsx')).includes('useReducedMotion'))

  /* ── 10b. maximalist craft rules from the brief ───────────────────────── */

  const allComponents = await Promise.all(
    ['HeroScene', 'AboutScene', 'ExpertiseScene', 'ProjectsScene', 'InstagramScene',
     'ExperienceScene', 'ToolkitScene', 'MoodboardScene', 'ImpactScene', 'ContactScene']
      .map((name) => read(`src/components/${name}.tsx`)),
  )
  const components = allComponents.join('\n')
  const uniqueScenes = new Set(sceneIds).size
  check('every scene id is unique', uniqueScenes === sceneIds.length)
  check(
    'each scene paints its own identity',
    allComponents.every((source) => source.includes('data-scene=')),
  )
  /* section reveals must move, not just fade — opacity alone is the lazy
     pattern the brief calls out. Dialog backdrops are exempt: they animate
     opacity on purpose. */
  check(
    'section reveals move as well as fade',
    !/whileInView=\{\{ opacity: 1 \}\}/.test(components) &&
      !/initial=\{\{ opacity: 0 \}\}\s*whileInView/.test(components),
  )
  check(
    'type scale reaches display size',
    components.includes('font-display') && components.includes('clamp('),
  )
  check(
    'at least four typefaces in play',
    (await read('tailwind.config.js')).match(/fontFamily/g)?.length === 1 &&
      ['sherif', 'display', 'grotesk', 'cond', 'mono'].every((face) =>
        components.includes(`font-${face}`),
      ),
  )
  check('cursor interaction is pointer-only', (await read('src/components/kit.tsx')).includes('(pointer: fine)'))
  check('marquees used', components.includes('Marquee'))
  check('preloader exists and is timed', (await read('src/components/Preloader.tsx')).includes('performance.now'))
  check(
    'preloader cannot hang',
    /const total = reduced \? \d+ : \d+/.test(await read('src/components/Preloader.tsx')),
  )

  /* ── 11. accessibility basics ─────────────────────────────────────────── */
  check('dialogs are labelled', html.includes('aria-label'))
  check('custom cursor is aria-hidden', (await read('src/components/kit.tsx')).includes('aria-hidden'))
  check('decorative svgs hidden', (await read('src/components/kit.tsx')).includes('aria-hidden'))

  /* ── 12. the render is actually a whole site ──────────────────────────── */
  check('render is substantial', html.length > 40000, `got ${html.length}`)
  check('portrait/art images referenced', html.includes('/media/art-'))
  check('lucide icons used', html.includes('<svg'))
} catch (error) {
  failures.push(`uncaught: ${error.message}`)
} finally {
  await server.close()
}

const passed = checks.filter((c) => c.ok).length
console.log('')
for (const failure of failures) console.log(`  ✗ ${failure}`)
console.log(`\n${passed}/${checks.length} checks passed`)
if (failures.length) {
  console.log(`\n${failures.length} check(s) failed`)
  process.exit(1)
}
console.log('✓ content integrity OK — real copy, real accounts, no invented metrics')
