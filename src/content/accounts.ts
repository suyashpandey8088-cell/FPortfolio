/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  BEHIND THE FEED — content source of truth
 * ─────────────────────────────────────────────────────────────────────────────
 *  Everything in this file is editable from the UI (edit mode, bottom right)
 *  and persists to localStorage. Export the JSON from the edit toolbar and
 *  paste the values back here to make them permanent.
 *
 *  IMPORTANT: no follower counts, engagement rates, reach figures or growth
 *  numbers are invented anywhere in this project. Every numeric field below
 *  ships as "—" so a verified figure can be added from Instagram Insights.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type GalleryItem = {
  id: string
  image: string
  /** "Post" | "Reel" | "Carousel" */
  type: string
  title: string
  caption: string
  tags: string
  /** CSS object-position for art-directed crops */
  pos?: string
  /** optional direct post link; falls back to the profile URL */
  url?: string
}

export type ReelItem = {
  id: string
  image: string
  title: string
  caption: string
  tags: string
}

export type Highlight = { id: string; label: string; image?: string }

export type CaseSectionData = {
  id: string
  no: string
  title: string
  kicker: string
  body: string[]
  bullets: string[]
}

export type MetricRow = {
  id: string
  label: string
  value: string
  source: string
}

export type Account = {
  id: string
  index: string
  name: string
  username: string
  url: string
  avatar: string
  category: string
  tagline: string
  bio: string
  status: string
  overview: string
  responsibilities: string[]
  highlights: Highlight[]
  stats: { posts: string; followers: string; following: string }
  gallery: GalleryItem[]
  reels: ReelItem[]
  caseStudy: {
    standfirst: string
    sections: CaseSectionData[]
    metrics: MetricRow[]
    metricNote: string
  }
}

const unchanged =
  'Both accounts are personally handled and managed by Deleena Venkatesh — not friends’ accounts, not collaborative side projects.'

export const accountsSeed: Account[] = [
  {
    id: 'padma',
    index: '01',
    name: 'PADMA JEWELS',
    username: '@padmajewels',
    url: 'https://www.instagram.com/padmajewels/',
    avatar: '/media/padma-avatar.jpg',
    category: 'Fine & Bridal Jewellery',
    tagline: 'Heritage gold, read at scroll speed.',
    bio: 'Heritage gold, bridal sets and everyday heirlooms — a craft-first feed built to make metal feel tangible through a phone screen.',
    status: 'Personally managed by Deleena Venkatesh',
    overview:
      'A fine jewellery feed has two jobs at once: make the gold look as tactile as it feels in the hand, and make a bridal purchase feel like the obvious next decision. Deleena runs the account end to end — what gets photographed, how it is styled, what the captions say, when each post goes live, and how every comment and DM is answered.',
    responsibilities: [
      'Content direction',
      'Styling & art direction',
      'Captions & copywriting',
      'Calendar & scheduling',
      'Reels editing',
      'Community management',
    ],
    highlights: [
      { id: 'p-h1', label: 'Bridal' },
      { id: 'p-h2', label: 'Karigari' },
      { id: 'p-h3', label: 'Styling' },
      { id: 'p-h4', label: 'Occasion' },
      { id: 'p-h5', label: 'Atelier' },
      { id: 'p-h6', label: 'Store' },
    ],
    stats: { posts: '—', followers: '—', following: '—' },
    gallery: [
      {
        id: 'p-g1',
        image: '/media/padma-10.jpg',
        type: 'Post',
        title: 'The bride, mid-turn',
        caption:
          'Polki layers and a red dupatta, shot three-quarters away so the jewellery stays the subject — the bridal pillar’s opening frame.',
        tags: '#bridaljewellery #polki #padmajewels',
        pos: 'center 30%',
      },
      {
        id: 'p-g2',
        image: '/media/padma-01.jpg',
        type: 'Post',
        title: 'Velvet landing',
        caption:
          'A single choker, one hard light and a lot of negative space. The frame that set the grid’s temperature.',
        tags: '#choker #gold #padmajewels',
        pos: 'center 45%',
      },
      {
        id: 'p-g3',
        image: '/media/padma-03.jpg',
        type: 'Carousel',
        title: 'Bridal set, flat',
        caption:
          'Polki, maang tikka and bangles laid on raw silk — a catalogue frame that still reads editorial.',
        tags: '#bridalset #heirloom',
        pos: 'center 50%',
      },
      {
        id: 'p-g4',
        image: '/media/padma-13.jpg',
        type: 'Reel',
        title: 'Jhumka, at ear height',
        caption:
          'Macro on the ear so scale is obvious — the post that answered the “how big is it actually” DMs.',
        tags: '#jhumka #macro #styling',
        pos: 'center 40%',
      },
      {
        id: 'p-g5',
        image: '/media/padma-04.jpg',
        type: 'Post',
        title: 'Layered, not loud',
        caption:
          'Three necklines on one neck, cropped tight. Styling proof that a light chain can carry a heavy pendant.',
        tags: '#layering #goldlayers',
        pos: 'center 35%',
      },
      {
        id: 'p-g6',
        image: '/media/padma-11.jpg',
        type: 'Post',
        title: 'The store at dusk',
        caption:
          'Boutique interior with the cases lit one at a time — a save-the-visit post for late opening hours.',
        tags: '#instore #boutique',
        pos: 'center 50%',
      },
      {
        id: 'p-g7',
        image: '/media/padma-02.jpg',
        type: 'Post',
        title: 'Granulation study',
        caption:
          'Jhumkas on charcoal stone. The detail post that launched the #karigari series.',
        tags: '#karigari #craftsmanship #details',
        pos: 'center 50%',
      },
      {
        id: 'p-g8',
        image: '/media/padma-14.jpg',
        type: 'Carousel',
        title: 'Festival shelf',
        caption:
          'Bangles beside lit diyas and marigold — occasion content built for saves during the festive window.',
        tags: '#festive #diwali #templejewellery',
        pos: 'center 50%',
      },
      {
        id: 'p-g9',
        image: '/media/padma-12.jpg',
        type: 'Post',
        title: 'The unboxing',
        caption:
          'Velvet box, wax seal, gold ribbon. The pack-shot that answers “will it arrive gift-ready?”',
        tags: '#gifting #packaging',
        pos: 'center 50%',
      },
      {
        id: 'p-g10',
        image: '/media/padma-15.jpg',
        type: 'Reel',
        title: 'Two bangles, one highlight',
        caption:
          'Carved edges in extreme close-up, cut slow so the engraving still reads at phone size.',
        tags: '#bangles #detail #reels',
        pos: 'center 50%',
      },
    ],
    reels: [
      {
        id: 'p-r1',
        image: '/media/padma-16.jpg',
        title: 'Bench to shoot',
        caption:
          'The styling table, the reference board, the pieces laid out — the process reel that gives the feed its credibility.',
        tags: '#behindthescenes #process',
      },
      {
        id: 'p-r2',
        image: '/media/padma-05.jpg',
        title: 'Hands that make it',
        caption:
          'A goldsmith at the bench, fifteen seconds, no cuts. Trust-building footage for pieces with a real price tag.',
        tags: '#karigari #atelier',
      },
      {
        id: 'p-r3',
        image: '/media/padma-06.jpg',
        title: 'One emerald, one light',
        caption:
          'A three-shot reel of a single ring, specs on screen so the caption can stay atmospheric.',
        tags: '#emerald #finejewellery',
      },
      {
        id: 'p-r4',
        image: '/media/padma-07.jpg',
        title: 'Ceremony red',
        caption:
          'A slow push-in on a red-and-gold choker, cut to the beat — the bridal reel that runs before wedding season.',
        tags: '#bridal #weddingseason',
      },
    ],
    caseStudy: {
      standfirst:
        'A jewellery brand’s feed has to sell craft without shouting. This account was rebuilt around one idea: let the metal carry the frame, and let the writing do the closing.',
      sections: [
        {
          id: 'p-c1',
          no: '01',
          title: 'Account overview',
          kicker: 'What the account is and who runs it',
          body: [
            'Padma Jewels is a fine and bridal jewellery brand. Deleena is the sole social media manager for the Instagram account — responsible for the entire digital presence, from the first moodboard of a shoot to the reply on a comment three weeks later.',
            'The feed reads as one continuous brand world: warm blacks, velvet grounds, one light source, and gold never over-lit. Every frame in the grid is chosen to work next to its neighbours, not just on its own.',
          ],
          bullets: [
            'Platform: Instagram — grid, reels, stories, highlights',
            'Role: end-to-end social media management',
            'Ownership: identity, calendar, art direction, copy, community',
            'Attribution: personally handled and managed by Deleena Venkatesh',
          ],
        },
        {
          id: 'p-c2',
          no: '02',
          title: 'Content strategy',
          kicker: 'Four pillars, one voice',
          body: [
            'The calendar is built on four repeating pillars so the account never drifts: Bridal & Occasion, Craft & Karigari, Styling & Layering, and Brand Moments. Each pillar has its own visual grammar and its own caption tone, which keeps the grid varied without breaking the identity.',
            'Bridal posts lead with ceremony and scale. Craft posts slow down to macro detail and process. Styling posts answer “how would I actually wear this?”. Brand moments carry announcements, store notes and festival greetings.',
          ],
          bullets: [
            'Bridal & occasion — ceremony-led hero frames, red and gold grounds',
            'Craft & karigari — macro detail, the bench, the maker’s hands',
            'Styling & layering — worn on real necks, stacking and scale',
            'Brand moments — announcements, festival greetings, store notes',
          ],
        },
        {
          id: 'p-c3',
          no: '03',
          title: 'Management responsibilities',
          kicker: 'Handled end to end, start to finish',
          body: [
            'Everything the account publishes, and everything it answers, passes through Deleena. That includes briefing the shoot, choosing the crop, writing the caption, timing the publish, and staying in the comments until the conversation settles.',
          ],
          bullets: [
            'Owns the account’s visual identity and grid composition',
            'Briefs and art-directs product photography and styling',
            'Writes all captions, hooks, hashtag sets and story copy',
            'Builds and maintains the content calendar',
            'Edits and publishes reels and carousels',
            'Answers comments and DMs in the brand voice',
            'Flags buying intent and appointment requests to the store team',
            'Reviews performance and adjusts the next content block',
          ],
        },
        {
          id: 'p-c4',
          no: '04',
          title: 'Content planning & scheduling',
          kicker: 'Monthly themes, weekly blocks, daily slots',
          body: [
            'Planning runs in layers: a monthly theme, a weekly block of shoots and edits, then individual publish slots. Copy is written ahead of the publish date, hashtags are grouped per pillar, and every approved asset is scheduled rather than posted live.',
            'Festival and wedding-season windows are mapped in advance so the heavier bridal content lands before the demand spike, not during it.',
          ],
          bullets: [
            'Monthly theme and pillar mix agreed up front',
            'Weekly shoot list, caption drafts and edit queue',
            'Publishing slots scheduled in advance, not ad hoc',
            'Seasonal and festival calendar mapped months ahead',
            'Asset library organised by pillar for fast reuse',
          ],
        },
        {
          id: 'p-c5',
          no: '05',
          title: 'Visual content creation',
          kicker: 'The frame is the argument',
          body: [
            'Deleena builds the moodboard, sets the styling, chooses the props and directs the light — velvet, raw silk, charcoal stone, one warm source. The rule is that gold should look heavy, not glittery.',
            'Post-production is consistency work: matching warmth across the grid, keeping shadows deep, cropping for the 4:5 feed and the 9:16 reel without losing the jewellery.',
          ],
          bullets: [
            'Moodboards, shot lists and prop sourcing',
            'On-set styling and crop direction',
            'Retouch notes: warmth, shadow depth, metal highlights',
            'Grid sequencing so neighbouring posts sit together',
            'Cover frames and typographic overlays for reels',
          ],
        },
        {
          id: 'p-c6',
          no: '06',
          title: 'Reels & video editing',
          kicker: 'Motion that behaves like a display case',
          body: [
            'Reels are cut in-house: vertical 9:16 crops, slow push-ins instead of jump cuts, sound chosen to match the brand’s tempo rather than the week’s trend. Text on screen carries the specifications so the caption can stay atmospheric.',
            'Process footage — the bench, the polishing, the box closing — does the trust-building work that a static product shot cannot.',
          ],
          bullets: [
            'Shot selection and 9:16 reframing',
            'Slow-push and match-cut editing rhythm',
            'Sound selection and beat matching',
            'On-screen text for specs and calls to action',
            'Custom cover frames that still read at grid size',
          ],
        },
        {
          id: 'p-c7',
          no: '07',
          title: 'Audience engagement',
          kicker: 'The comment section is the shop floor',
          body: [
            'Every comment and DM is answered personally in the brand voice: sizing and weight questions, price enquiries, appointment requests, and after-purchase care. High-intent conversations are passed to the store team with context, so no lead goes cold overnight.',
            'Saved and shared posts are tracked manually as signals for what to make next — the craft-detail series exists because the macro posts kept getting saved.',
          ],
          bullets: [
            'Daily comment replies and DM triage',
            'Price, weight and sizing questions answered in voice',
            'Appointment and store-visit requests routed to sales',
            'UGC and customer photos reshared with credit',
            'Manual tracking of saves and shares to steer the next block',
          ],
        },
      ],
      metrics: [
        { id: 'p-m1', label: 'Followers', value: '—', source: 'Instagram Insights' },
        { id: 'p-m2', label: 'Accounts reached (30 days)', value: '—', source: 'Instagram Insights' },
        { id: 'p-m3', label: 'Engagement rate', value: '—', source: 'Instagram Insights' },
        { id: 'p-m4', label: 'Profile visits (30 days)', value: '—', source: 'Instagram Insights' },
        { id: 'p-m5', label: 'Reel plays (30 days)', value: '—', source: 'Instagram Insights' },
        { id: 'p-m6', label: 'Saves & shares (30 days)', value: '—', source: 'Instagram Insights' },
      ],
      metricNote:
        'No performance figure is published until it can be verified. Add verified numbers from Instagram Insights in edit mode — placeholders stay visible until then.',
    },
  },
  {
    id: 'combat',
    index: '02',
    name: 'COMBAT CREW 25',
    username: '@combatcrew25',
    url: 'https://www.instagram.com/combatcrew25/',
    avatar: '/media/combat-avatar.jpg',
    category: 'Combat Sports · Training & Fight Culture',
    tagline: 'Where the grind gets a spotlight.',
    bio: 'Boxing, MMA and fight-night culture. Training cuts, athlete spotlights and event drops — edited fast, captioned hard.',
    status: 'Personally managed by Deleena Venkatesh',
    overview:
      'A combat sports account lives or dies on energy and consistency. Deleena manages the page end to end — sourcing and cutting training footage, writing in the crew’s voice, building fight-week countdowns, and keeping the comment section as loud as the gym.',
    responsibilities: [
      'Reels editing',
      'Fight-week campaigns',
      'Caption writing',
      'Poster & cover design',
      'Community management',
      'Story coverage',
    ],
    highlights: [
      { id: 'c-h1', label: 'Fight night' },
      { id: 'c-h2', label: 'Training' },
      { id: 'c-h3', label: 'Wraps on' },
      { id: 'c-h4', label: 'The ring' },
      { id: 'c-h5', label: 'Athletes' },
      { id: 'c-h6', label: 'Crew' },
    ],
    stats: { posts: '—', followers: '—', following: '—' },
    gallery: [
      {
        id: 'c-g1',
        image: '/media/combat-01.jpg',
        type: 'Post',
        title: 'Gloves touch',
        caption: 'Fight night: two athletes, one overhead light, everything else in haze.',
        tags: '#fightnight #boxing #combatcrew25',
        pos: 'center 40%',
      },
      {
        id: 'c-g2',
        image: '/media/combat-10.jpg',
        type: 'Reel',
        title: 'Wraps before the work',
        caption: 'Hand wraps going on in the corner under red rim light — the pre-training post that sets the tone.',
        tags: '#handwraps #prep #reels',
        pos: 'center 30%',
      },
      {
        id: 'c-g3',
        image: '/media/combat-02.jpg',
        type: 'Post',
        title: 'Knuckles, taped',
        caption: 'Macro on tape, chalk dust and sweat. The ritual close-up that gets shared into gym group chats.',
        tags: '#handwraps #details',
        pos: 'center 55%',
      },
      {
        id: 'c-g4',
        image: '/media/combat-04.jpg',
        type: 'Post',
        title: 'House lights down',
        caption: 'An empty ring under a single source. The mood frame that keeps pulling new followers in.',
        tags: '#gymlife #afterhours',
        pos: 'center 50%',
      },
      {
        id: 'c-g5',
        image: '/media/combat-11.jpg',
        type: 'Carousel',
        title: 'The bag line',
        caption: 'Six heavy bags and a shaft of window light — the post used to announce open-mat sessions.',
        tags: '#opermat #trainhard',
        pos: 'center 50%',
      },
      {
        id: 'c-g6',
        image: '/media/combat-05.jpg',
        type: 'Post',
        title: 'Shadow work',
        caption: 'One figure, one hanging bag, chains and haze. The quiet post between fight-week hype.',
        tags: '#shadowwork #discipline',
        pos: 'center 40%',
      },
      {
        id: 'c-g7',
        image: '/media/combat-12.jpg',
        type: 'Post',
        title: 'Arena at rest',
        caption: 'The venue before the doors open — captioned with the card, timed to the countdown week.',
        tags: '#fightweek #arena',
        pos: 'center 50%',
      },
      {
        id: 'c-g8',
        image: '/media/combat-15.jpg',
        type: 'Carousel',
        title: 'Inside the cage',
        caption: 'Octagon spotlights on empty canvas — the announcement frames for the next bout.',
        tags: '#mma #thecage',
        pos: 'center 50%',
      },
    ],
    reels: [
      {
        id: 'c-r1',
        image: '/media/combat-13.jpg',
        title: 'Kick, slowed',
        caption: 'A roundhouse cut to half speed with the fighter’s record fading in on the beat.',
        tags: '#muaythai #slowmo',
      },
      {
        id: 'c-r2',
        image: '/media/combat-14.jpg',
        title: 'Arms up',
        caption: 'The walk-in moment held for three seconds — fight-week energy in nine by sixteen.',
        tags: '#walkout #fightweek',
      },
      {
        id: 'c-r3',
        image: '/media/combat-03.jpg',
        title: 'Bag rounds',
        caption: 'Six clips, one rhythm, raw gym audio left exactly as it was recorded.',
        tags: '#bagwork #trainhard',
      },
    ],
    caseStudy: {
      standfirst:
        'Combat sports audiences can tell when a page is run by someone who has never stood near a ring. This account is built on real gym frames, hard edits and a voice that sounds like the corner, not the brochure.',
      sections: [
        {
          id: 'c-c1',
          no: '01',
          title: 'Account overview',
          kicker: 'What the account is and who runs it',
          body: [
            'Combat Crew 25 is a combat sports page covering boxing, MMA and training culture. Deleena is the sole social media manager — she runs the page’s entire digital presence, from sourcing footage to answering the fight-card questions that land in the DMs.',
            'The identity is deliberately the opposite of the jewellery work: near-black, signal red, condensed type, hard crops. Same manager, two completely different visual languages, each built for its audience.',
          ],
          bullets: [
            'Platform: Instagram — reels, grid, stories, highlights',
            'Role: end-to-end social media management',
            'Ownership: footage, edits, captions, posters, community',
            'Attribution: personally handled and managed by Deleena Venkatesh',
          ],
        },
        {
          id: 'c-c2',
          no: '02',
          title: 'Content strategy',
          kicker: 'Energy first, information second',
          body: [
            'The page runs on three engines: training content that proves the work, athlete spotlights that build the crew’s cast of characters, and fight-week campaigns that convert attention into attendance.',
            'Everything is short, loud and legible at thumb size. The caption carries the information — date, venue, weight class, opponent — while the edit carries the feeling.',
          ],
          bullets: [
            'Training — bag work, pads, conditioning, open mat',
            'Athlete spotlights — records, walkouts, corner moments',
            'Fight-week — countdowns, card announcements, weigh-in posts',
            'Culture — gym mood frames, after-hours, respect rituals',
          ],
        },
        {
          id: 'c-c3',
          no: '03',
          title: 'Management responsibilities',
          kicker: 'The whole page, every day',
          body: [
            'Deleena owns the page’s output and its reputation: what goes up, what gets pinned, what gets deleted, and how quickly a hostile comment gets handled before it sets the tone for the thread.',
          ],
          bullets: [
            'Owns the account’s identity, tone and posting rhythm',
            'Sources and logs training and fight footage',
            'Edits every reel, including cuts, pacing and on-screen text',
            'Designs fight posters, covers and story templates',
            'Writes captions, hook lines and hashtag sets',
            'Runs story coverage on training and fight days',
            'Manages comments, DMs and community tone',
            'Tracks which formats the audience keeps sharing',
          ],
        },
        {
          id: 'c-c4',
          no: '04',
          title: 'Content planning & scheduling',
          kicker: 'Built around the fight calendar',
          body: [
            'The content calendar is anchored to the fight schedule, not the week. A bout gets a three-stage rollout — announcement, build-up, fight week — with training content filling the gaps between events so the page never goes quiet.',
            'Fight-day stories and reels are prepared in advance, with slots held open for results and post-fight reactions as they happen.',
          ],
          bullets: [
            'Fight-calendar-led planning, months ahead',
            'Three-stage rollout per bout: announce, build, fight week',
            'Training content queued to fill non-event weeks',
            'Fight-day story and reel slots pre-built for live reactions',
            'Recurring weekly formats kept consistent',
          ],
        },
        {
          id: 'c-c5',
          no: '05',
          title: 'Visual content creation',
          kicker: 'Hard light, hard type',
          body: [
            'The visual system is built for impact at a glance: deep blacks, red rim light, high-contrast stills, and condensed uppercase typography that survives a 3-column grid on a cracked phone screen.',
            'Deleena designs the fight posters and story templates herself, so the page’s look stays consistent between a quick training upload and a fully produced event announcement.',
          ],
          bullets: [
            'Poster and cover design in the page’s type system',
            'Colour grade: crushed blacks, red and amber accents',
            'Cropping for grid, 4:5 feed and 9:16 reels',
            'Story templates and poll/quiz layouts',
            'Quote cards and athlete stat frames',
          ],
        },
        {
          id: 'c-c6',
          no: '06',
          title: 'Reels & video editing',
          kicker: 'Cut on the punch',
          body: [
            'Reels are the primary format and they are edited in-house: punch-synced cuts, speed ramps on the impact, sound kept raw instead of layered with trending audio, and on-screen text carrying the fight details.',
            'Fight-week reels get a slower, heavier treatment — silhouette walk-ins, half-speed movement, card text fading in on the beat.',
          ],
          bullets: [
            'Punch-synced cutting and speed ramps',
            'Raw gym audio retained wherever possible',
            'On-screen text for names, records and event details',
            'Walk-in and weigh-in edits for fight week',
            'Cover frames designed to read at grid size',
          ],
        },
        {
          id: 'c-c7',
          no: '07',
          title: 'Audience engagement',
          kicker: 'The comments are part of the show',
          body: [
            'The audience here is fighters, coaches and fans, and the reply tone matches: direct, respectful, never corporate. Callouts, fight predictions and training questions are answered publicly to keep the thread moving.',
            'DMs are triaged for fighter enquiries, collaboration requests and event invitations, and passed to the right person with context instead of a forwarded screenshot.',
          ],
          bullets: [
            'Fast replies on fight-night posts while the thread is live',
            'Public answers to training method and event questions',
            'Predictions and callouts moderated for tone',
            'DM triage for fighter, sponsor and collaboration enquiries',
            'Crediting gyms, coaches and photographers on every repost',
          ],
        },
      ],
      metrics: [
        { id: 'c-m1', label: 'Followers', value: '—', source: 'Instagram Insights' },
        { id: 'c-m2', label: 'Accounts reached (30 days)', value: '—', source: 'Instagram Insights' },
        { id: 'c-m3', label: 'Engagement rate', value: '—', source: 'Instagram Insights' },
        { id: 'c-m4', label: 'Profile visits (30 days)', value: '—', source: 'Instagram Insights' },
        { id: 'c-m5', label: 'Reel plays (30 days)', value: '—', source: 'Instagram Insights' },
        { id: 'c-m6', label: 'Saves & shares (30 days)', value: '—', source: 'Instagram Insights' },
      ],
      metricNote:
        'No performance figure is published until it can be verified. Add verified numbers from Instagram Insights in edit mode — placeholders stay visible until then.',
    },
  },
]

export const siteSeed = {
  hero: {
    eyebrow: 'Deleena Venkatesh — Social Media Manager',
    headline: 'Social media,\nhandled end to end.',
    sub: 'Two live Instagram accounts. One standard of execution.',
  },
  intro: {
    eyebrow: 'Social media case studies',
    title: 'BEHIND THE FEED.',
    headline: 'BUILDING BRANDS. CREATING CONNECTIONS.',
    support:
      'Social media is more than posting content. It’s about building identities, connecting with audiences, and creating consistent digital experiences.',
    note: 'Two accounts, personally managed by Deleena Venkatesh — one in fine jewellery, one in combat sports. Same hands, two completely different worlds.',
  },
  attribution: {
    title: 'DIRECT SOCIAL MEDIA MANAGEMENT EXPERIENCE',
    body: 'Both Instagram accounts shown here are personally handled and managed by Deleena Venkatesh. They are presented as direct management experience — not as friends’ accounts, and not as collaborative projects.',
    foot: unchanged,
  },
  footer: {
    name: 'Deleena Venkatesh',
    role: 'Social Media Manager · Content Strategy · Community',
    cta: 'Open to social media management roles and brand retainers.',
  },
}

export type SiteContent = typeof siteSeed & { accounts: Account[] }
