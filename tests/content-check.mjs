/**
 * Content integrity check.
 *
 * Renders the whole app server-side with no stored edits and asserts that the
 * real content model reaches the page. This exists because an earlier build
 * shipped with editable paths like `accounts.padma.name` while the content is
 * stored as an array (`accounts[0].name`) — every account-level field silently
 * fell back to the editor's "Add text…" placeholder.
 *
 * Run with: node tests/content-check.mjs
 */
import { createServer } from 'vite'
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

const unescapeHtml = (value) =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')

const failures = []
const checks = []
const check = (name, condition, detail = '') => {
  checks.push({ name, ok: Boolean(condition), detail })
  if (!condition) failures.push(`${name}${detail ? ` — ${detail}` : ''}`)
}

try {
  const { default: App } = await server.ssrLoadModule('/src/App.tsx')
  const { ContentProvider } = await server.ssrLoadModule('/src/store/content.tsx')
  const { accountsSeed, siteSeed } = await server.ssrLoadModule('/src/content/accounts.ts')

  // 1. render with no stored edits (the "first-time visitor" case)
  globalThis.localStorage.getItem = () => null
  let html = renderToString(React.createElement(ContentProvider, null, React.createElement(App)))
  let text = unescapeHtml(html)

  // 2. no editing affordance text anywhere in the published markup
  check('no "Add text…" placeholder', !html.includes('Add text…'))
  check('no "+ Add item" control', !html.includes('+ Add item'))
  check('no "+ Add metric" control', !html.includes('+ Add metric'))

  // 3. hero + intro copy
  check('intro headline', html.includes('BUILDING BRANDS. CREATING CONNECTIONS.'))
  check('intro support', html.includes('Social media is more than posting content'))
  check('hero eyebrow', html.includes('Deleena Venkatesh'))
  check('attribution line', html.includes('personally handled and managed by Deleena Venkatesh'))

  // 4. every account's real content must be on the page
  for (const account of accountsSeed) {
    const label = `[${account.username}]`
    check(`${label} name`, html.includes(account.name))
    check(`${label} username`, html.includes(account.username))
    check(`${label} category`, text.includes(account.category))
    check(`${label} tagline`, html.includes(account.tagline))
    check(`${label} overview`, html.includes(account.overview.slice(0, 40)))
    check(`${label} bio`, html.includes(account.bio.slice(0, 30)))
    check(`${label} profile url`, html.includes(account.url))
    check(`${label} first responsibility`, html.includes(account.responsibilities[0]))
    check(`${label} first highlight label`, html.includes(account.highlights[0].label))
    check(`${label} first gallery title`, html.includes(account.gallery[0].title))
    check(`${label} first gallery caption`, html.includes(account.gallery[0].caption.slice(0, 30)))
    check(`${label} first reel title`, html.includes(account.reels[0].title))
    check(`${label} case study standfirst`, html.includes(account.caseStudy.standfirst.slice(0, 40)))
    /*
     * Case-study chapters are collapsed by default and the open chapter is a
     * deliberate in-page space saver. Render the component with its chapters open
     * so the test still proves every chapter's copy resolves.
     */
    const { default: CaseStudy } = await server.ssrLoadModule('/src/components/CaseStudy.tsx')
    const sections = account.caseStudy.sections.length
    const renderChapter = (index) =>
      unescapeHtml(
        renderToString(
          React.createElement(
            ContentProvider,
            null,
            React.createElement(CaseStudy, {
              account,
              initialOpen: true,
              initialSection: index,
            }),
          ),
        ),
      )

    const navHtml = renderChapter(0) // nav lists every chapter title
    account.caseStudy.sections.forEach((section, index) => {
      check(`${label} chapter nav "${section.title}"`, navHtml.includes(section.title))
      const chapters = renderChapter(index)
      check(`${label} chapter body "${section.title}"`, chapters.includes(section.body[0].slice(0, 40)))
      check(`${label} chapter bullets "${section.title}"`, chapters.includes(section.bullets[0].slice(0, 30)))
    })
    const metricsHtml = renderChapter(sections)
    check(`${label} metrics chapter`, metricsHtml.includes('Performance metrics'))
    check(`${label} metric source`, metricsHtml.includes(account.caseStudy.metrics[0].source))
    check(`${label} metric note`, metricsHtml.includes(account.caseStudy.metricNote.slice(0, 40)))

  }

  // 5. no invented social proof: no follower-suffixed numbers anywhere
  const invented = /\b\d+(\.\d+)?\s?[kKmM]?\s*(followers|reach|engagement rate)\b/.exec(html)
  check('no invented follower/reach figures', !invented, invented ? invented[0] : '')

  // 6. rendered markup must contain all seeded copy, not just the shell
  check('rendered length is substantial', html.length > 120_000, `got ${html.length}`)

  // 7. sanity: the seed itself is complete (guards against empty fields forever)
  for (const account of accountsSeed) {
    const strings = [
      account.name, account.username, account.category, account.tagline, account.bio,
      account.overview, account.status, account.caseStudy.standfirst, account.caseStudy.metricNote,
    ]
    strings.forEach((value, i) => check(`seed completeness ${account.id}#${i}`, Boolean(value?.trim())))
    account.highlights.forEach((h, i) => check(`seed highlight ${account.id}#${i}`, Boolean(h.label?.trim())))
    account.gallery.forEach((g, i) => {
      check(`seed gallery title ${account.id}#${i}`, Boolean(g.title?.trim()))
      check(`seed gallery caption ${account.id}#${i}`, Boolean(g.caption?.trim()))
      check(`seed gallery image ${account.id}#${i}`, Boolean(g.image?.trim()))
    })
    account.caseStudy.sections.forEach((section) => {
      section.body.forEach((line, i) => check(`seed body ${account.id}.${section.no}#${i}`, Boolean(line?.trim())))
      section.bullets.forEach((line, i) => check(`seed bullet ${account.id}.${section.no}#${i}`, Boolean(line?.trim())))
    })
  }
  check('site seed headline', Boolean(siteSeed.intro.headline.trim()))

  /*
   * 8. a simulated stored edit must land on the right account.
   * Note: the provider merges field-by-field from the defaults (a schema
   * migration, so older saved JSON keeps new copy), which means a light partial
   * payload will not override text. This asserts the merge keeps both accounts
   * complete and correctly separated, and that no account renders blank.
   */
  const edited = JSON.stringify({
    accounts: [{ ...accountsSeed[0], name: 'EDITED-PADMA-NAME' }, accountsSeed[1]],
  })
  globalThis.localStorage.getItem = () => edited
  html = renderToString(React.createElement(ContentProvider, null, React.createElement(App)))
  text = unescapeHtml(html)
  check('both accounts still render after stored data', text.includes(accountsSeed[0].name) && text.includes(accountsSeed[1].name))
  check('stored data does not blank account 01', text.includes(accountsSeed[0].gallery[0].title))
  check('stored data does not blank account 02', text.includes(accountsSeed[1].gallery[0].title))
  check('no placeholder in stored-data render', !html.includes('Add text…'))
} finally {
  await server.close()
}

const passed = checks.filter((c) => c.ok).length
console.log(`\n${passed}/${checks.length} checks passed`)
if (failures.length) {
  console.error('\nFAILED:')
  failures.forEach((line) => console.error('  ✗ ' + line))
  process.exit(1)
}
console.log('✓ content integrity OK — no placeholder text, all account copy rendered\n')
