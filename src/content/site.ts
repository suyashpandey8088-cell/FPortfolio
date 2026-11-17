/**
 * Everything on the site that is *Deleena's* lives here, as editable data.
 *
 * Rule for this file: only verifiable facts. No invented clients, metrics,
 * follower counts or engagement numbers. The `impact` block at the bottom
 * deliberately contains countable things derived from what actually exists on
 * this site, and nothing else.
 */

export type Scene = {
  /** scene id — also the DOM marker used by the scroll colour engine */
  id: string
  /** background + foreground for this scene */
  bg: string
  fg: string
  /** accent used for highlights inside the scene */
  accent: string
}

/* ── the palette, as scenes ─────────────────────────────────────────────── */

export const SCENES: Scene[] = [
  { id: 'hero', bg: '#0A0908', fg: '#FBF4E2', accent: '#FF4D0D' },
  { id: 'about', bg: '#F7F1E4', fg: '#12100D', accent: '#FF2E93' },
  { id: 'expertise', bg: '#1D4BFF', fg: '#FBF4E2', accent: '#C8FF3D' },
  { id: 'projects', bg: '#0C3B2E', fg: '#FBF4E2', accent: '#F5FF3D' },
  { id: 'instagram', bg: '#3B1270', fg: '#FBF4E2', accent: '#CBB8FF' },
  { id: 'experience', bg: '#F7F1E4', fg: '#12100D', accent: '#C1121F' },
  { id: 'toolkit', bg: '#0A0908', fg: '#FBF4E2', accent: '#C8FF3D' },
  { id: 'moodboard', bg: '#12100D', fg: '#FBF4E2', accent: '#FF2E93' },
  { id: 'impact', bg: '#C1121F', fg: '#FBF4E2', accent: '#F5FF3D' },
  { id: 'contact', bg: '#FF4D0D', fg: '#12100D', accent: '#0A0908' },
]

/* ── identity ───────────────────────────────────────────────────────────── */

export const identity = {
  name: 'Deleena Venkatesh',
  short: 'Deleena V.',
  concept: 'TOO CREATIVE TO BE ORDINARY.',
  roles: ['Creative Designer', 'Digital Content Creator', 'Video Editor', 'Social Media Manager', 'Digital Marketing Enthusiast'],
  roleLine: 'CREATIVE DESIGNER / VIDEO EDITOR / DIGITAL CREATIVE',
  location: 'Mumbai, India',
  email: 'hello@deleenav.com',
  heroHeadline: "CREATIVITY DOESN'T FOLLOW RULES.",
  heroSub: 'I DESIGN. I CREATE. I EXPERIMENT.',
  marquee: 'CREATIVE DESIGNER ✳ VIDEO EDITOR ✳ CONTENT CREATOR ✳ SOCIAL MEDIA ✳ DIGITAL MARKETING ✳',
}

/* ── about ──────────────────────────────────────────────────────────────── */

export const about = {
  headline: 'NOT BUILT TO BLEND IN.',
  lead:
    'I make things that refuse to sit quietly. Posters, reels, websites, whole social identities — built with an eye for the loud idea and the patience to finish it properly.',
  body:
    'I am a creative designer and content creator working across design, video and social. Most of what I do starts as a blank artboard and a stubborn feeling that the obvious answer is the boring one. I studied Information Technology, which is why I build the things I design rather than handing them off.',
  education: {
    degree: 'Bachelor of Information Technology (SYIT)',
    school: 'Ramsheth Thakur College, Mumbai',
    note: 'Systems thinking, applied to visual work.',
  },
  interests: ['Photography', 'Illustration', 'Typography', 'Trend Research', 'Web Designing'],
}

/* ── expertise ──────────────────────────────────────────────────────────── */

export type Skill = {
  id: string
  title: string
  note: string
  /** how the card is art-directed */
  variant: 'solid' | 'outline' | 'invert' | 'stripe' | 'serif' | 'condensed'
}

export const expertise: Skill[] = [
  { id: 'web', title: 'Website Design', note: 'Responsive builds, art-directed — not templates.', variant: 'solid' },
  { id: 'ai-video', title: 'AI Video Creation', note: 'Generated footage, cut and graded by hand.', variant: 'outline' },
  { id: 'poster', title: 'Poster Design', note: 'Print-scale typography that survives a thumbnail.', variant: 'invert' },
  { id: 'reels', title: 'Reels Making', note: 'Vertical-first edits built for the first second.', variant: 'condensed' },
  { id: 'social', title: 'Social Media Management', note: 'Calendars, cadence, and a consistent visual voice.', variant: 'stripe' },
  { id: 'editing', title: 'Video Editing', note: 'Pace, sound, and the confidence to cut early.', variant: 'serif' },
  { id: 'story', title: 'Visual Storytelling', note: 'A sequence that means something by frame four.', variant: 'solid' },
  { id: 'photo', title: 'Photography', note: 'Light, texture, and the unposed moment.', variant: 'outline' },
  { id: 'type', title: 'Typography', note: 'Type as the image, not a label on it.', variant: 'invert' },
  { id: 'research', title: 'Creative Research', note: 'Trends read properly, then broken on purpose.', variant: 'stripe' },
]

/* ── projects ───────────────────────────────────────────────────────────── */

export type Project = {
  id: string
  index: string
  title: string
  category: string
  year: string
  blurb: string
  process: string[]
  outcome: string
  /** scene accent used for this project's identity */
  accent: string
  bg: string
  images: string[]
  /** video is only rendered when a real link exists */
  video?: { url: string; kind: 'youtube' | 'vimeo' | 'instagram' | 'file' }
}

export const projects: Project[] = [
  {
    id: 'brand',
    index: '01',
    title: 'THE BRAND EXPERIENCE',
    category: 'Identity · Art Direction',
    year: '2025',
    blurb:
      'A full visual identity built from a single stubborn idea: the brand should look like it was printed badly on purpose, then printed beautifully.',
    process: ['Concept and moodboard', 'Typographic system', 'Colour and texture tests', 'Applied across social and print'],
    outcome: 'A repeatable system — one grid, one type pairing, infinite loud variations.',
    accent: '#FF4D0D',
    bg: '#12100D',
    images: ['/media/padma-01.jpg', '/media/padma-04.jpg', '/media/padma-07.jpg'],
  },
  {
    id: 'takeover',
    index: '02',
    title: 'SOCIAL MEDIA TAKEOVER',
    category: 'Social Strategy · Content',
    year: '2025',
    blurb:
      'A sustained content push for a jewellery account: one visual language, posted with discipline rather than inspiration.',
    process: ['Content pillars', 'Shoot direction', 'Template system in Canva', 'Scheduling and cadence'],
    outcome: 'A grid that reads as one publication instead of a pile of posts.',
    accent: '#FF2E93',
    bg: '#1A0B16',
    images: ['/media/padma-02.jpg', '/media/padma-05.jpg', '/media/padma-09.jpg'],
  },
  {
    id: 'frame',
    index: '03',
    title: 'BEYOND THE FRAME',
    category: 'Video · Edit',
    year: '2024',
    blurb:
      'An edit built around the frame that almost got cut. Slow, deliberate, and much shorter than the first version.',
    process: ['Selects and story spine', 'Sound design pass', 'Grade and texture', 'Vertical and landscape cuts'],
    outcome: 'One thirty-second piece that carries a whole mood without a word of voiceover.',
    accent: '#C8FF3D',
    bg: '#0C1A0C',
    images: ['/media/combat-01.jpg', '/media/combat-04.jpg', '/media/combat-08.jpg'],
  },
  {
    id: 'canvas',
    index: '04',
    title: 'THE DIGITAL CANVAS',
    category: 'Web · Design',
    year: '2025',
    blurb:
      'A website that treats the viewport as a poster. Scroll is the only navigation you need.',
    process: ['Structure and sitemap', 'Art direction per section', 'Responsive typography', 'Build and refine'],
    outcome: 'A site where the layout changes personality as you move through it.',
    accent: '#1D4BFF',
    bg: '#0A0F24',
    images: ['/media/padma-03.jpg', '/media/padma-06.jpg', '/media/padma-11.jpg'],
  },
  {
    id: 'scroll',
    index: '05',
    title: 'SCROLL STORIES',
    category: 'Storytelling · Social',
    year: '2024',
    blurb:
      'Narrative built for a thumb: every panel earns the next swipe, and the payoff lands before the drop-off.',
    process: ['Script and beat sheet', 'Panel design', 'Motion accents', 'Publish and review'],
    outcome: 'A format that people finish — and that survives being screenshotted.',
    accent: '#CBB8FF',
    bg: '#160B2B',
    images: ['/media/combat-02.jpg', '/media/combat-05.jpg', '/media/combat-09.jpg'],
  },
  {
    id: 'campaign',
    index: '06',
    title: 'THE VISUAL CAMPAIGN',
    category: 'Campaign · Direction',
    year: '2025',
    blurb:
      'One campaign, many surfaces: feed, story, reel, poster. Same idea at every size, never the same image twice.',
    process: ['Campaign concept', 'Asset matrix', 'Adapt per placement', 'Deliver and document'],
    outcome: 'A campaign that stays recognisable whether it is 1080 wide or printed A2.',
    accent: '#F5FF3D',
    bg: '#1C1A05',
    images: ['/media/combat-03.jpg', '/media/combat-06.jpg', '/media/combat-10.jpg'],
  },
]

/* ── experience ─────────────────────────────────────────────────────────── */

export type Role = {
  id: string
  title: string
  period: string
  kind: string
  points: string[]
}

export const experience: Role[] = [
  {
    id: 'freelance',
    title: 'FREELANCE CREATIVE DESIGNER',
    period: '2024 — PRESENT',
    kind: 'Independent',
    points: [
      'Responsive website design',
      'AI-generated video content',
      'Poster creation',
      'Instagram reels',
      'Brand consistency',
      'Visual storytelling',
    ],
  },
  {
    id: 'intern',
    title: 'SOCIAL MEDIA CONTENT INTERN',
    period: 'Internship',
    kind: 'Agency side',
    points: [
      'Social media content calendar',
      'Content scheduling',
      'Reels and visual posts',
      'Digital posters',
      'Promotional material',
      'Brand guideline consistency',
    ],
  },
]

/* ── toolkit — only software actually used ──────────────────────────────── */

export const toolkit = [
  { id: 'premiere', name: 'Premiere Pro', use: 'Cutting, pacing, colour', mark: 'Pr' },
  { id: 'aftereffects', name: 'After Effects', use: 'Motion, titles, comps', mark: 'Ae' },
  { id: 'photoshop', name: 'Photoshop', use: 'Retouch, collage, posters', mark: 'Ps' },
  { id: 'canva', name: 'Canva', use: 'Templates, rapid social', mark: 'Cv' },
  { id: 'figma', name: 'Figma', use: 'Layout, systems, web', mark: 'Fi' },
]

/* ── impact — countable, verifiable, nothing invented ───────────────────── */

export const impact = [
  { value: '02', label: 'Accounts managed', note: 'Both run personally, end to end' },
  { value: '06', label: 'Projects in this portfolio', note: 'Each with its own direction' },
  { value: '10', label: 'Creative disciplines', note: 'Design, video, social, type' },
  { value: '05', label: 'Tools in daily use', note: 'Premiere, After Effects, Photoshop, Canva, Figma' },
]

/* ── contact ────────────────────────────────────────────────────────────── */

export const contact = {
  headline: "LET'S MAKE SOMETHING UNFORGETTABLE.",
  line: 'Available for freelance, collaborations and full-time creative roles.',
  signoff: 'IDEAS. DESIGNS. IMPACT.',
  socials: [
    { label: 'Instagram', handle: '@padmajewels', url: 'https://www.instagram.com/padmajewels/' },
    { label: 'Instagram', handle: '@combatcrew25', url: 'https://www.instagram.com/combatcrew25/' },
  ],
}

/* ── moodboard ──────────────────────────────────────────────────────────── */

export const moodboard = [
  { id: 'm1', kind: 'photo', src: '/media/padma-08.jpg', caption: 'Warm metal, hard light' },
  { id: 'm2', kind: 'colour', hex: '#FF2E93', caption: 'Punch pink' },
  { id: 'm3', kind: 'photo', src: '/media/combat-07.jpg', caption: 'Contact and motion' },
  { id: 'm4', kind: 'type', text: 'LOUD', caption: 'Type as image' },
  { id: 'm5', kind: 'photo', src: '/media/padma-10.jpg', caption: 'Detail as texture' },
  { id: 'm6', kind: 'colour', hex: '#C8FF3D', caption: 'Acid lime' },
  { id: 'm7', kind: 'photo', src: '/media/combat-11.jpg', caption: 'Silhouette and grain' },
  { id: 'm8', kind: 'type', text: '✳', caption: 'Mark making' },
]
