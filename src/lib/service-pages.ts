export interface ServicePage {
  slug: string
  number: string
  name: string
  category: 'Brand Identity' | 'Collateral' | 'Digital'
  headline: string
  metaTitle: string
  metaDescription: string
  tagline: string
  heroBody: string
  timeline: string
  priceRange: string
  stats: Array<{ value: string; label: string }>
  deliverables: string[]
  process: Array<{ step: string; title: string; description: string }>
  audiences: Array<{ label: string; description: string }>
  faqs: Array<{ q: string; a: string }>
  relatedSlugs: string[]
}

export const SERVICE_PAGES: ServicePage[] = [
  {
    slug: 'logo-design',
    number: '01',
    name: 'Logo Design',
    category: 'Brand Identity',
    headline: 'Logo Design for Small Business',
    metaTitle: 'Logo Design for Small Business | The Coast',
    metaDescription:
      'Custom logo design for small businesses — 3 original concepts, 2 revision rounds, all file formats. Built to stand out and scale with your brand.',
    tagline: 'A logo that works as hard as you do — distinctive, versatile, and entirely yours.',
    heroBody:
      'The Coast creates custom logos for small businesses that communicate credibility at a glance. Every project includes a deep discovery session, three distinct original concepts, two rounds of revisions, and final delivery in all formats — SVG, PNG, PDF, and EPS — optimised for web, print, and merchandise. You own 100% of the final artwork.',
    timeline: '2–3 weeks',
    priceRange: 'Custom quote',
    stats: [
      { value: '3', label: 'Original concepts' },
      { value: '2', label: 'Revision rounds' },
      { value: '100%', label: 'Ownership of files' },
    ],
    deliverables: [
      'Primary logo mark (full colour)',
      'Secondary / stacked logo variation',
      'Monochrome & reversed versions',
      'Favicon / app icon cut',
      'Web-optimised SVG & PNG exports',
      'Print-ready PDF & EPS vector files',
      'Brand colour codes (HEX, RGB, CMYK)',
      'Typography recommendation sheet',
    ],
    process: [
      {
        step: '01',
        title: 'Discover',
        description:
          'We begin with a structured brand questionnaire and discovery call to understand your business, audience, competitors, and aesthetic preferences. We research your market and identify white-space opportunities that inform every design decision.',
      },
      {
        step: '02',
        title: 'Design',
        description:
          'Our designers develop three distinct logo concepts — each rooted in your brand strategy, not guesswork. Each concept arrives with a brief rationale explaining the creative thinking behind it.',
      },
      {
        step: '03',
        title: 'Develop',
        description:
          'You select your preferred direction and we refine it through two rounds of revisions. We finesse spacing, colour, weight, and versatility until the mark is exactly right.',
      },
      {
        step: '04',
        title: 'Launch',
        description:
          'We package and deliver every file format you need, plus a concise one-page usage guide showing correct and incorrect usage. Your logo is ready to deploy across every touchpoint.',
      },
    ],
    audiences: [
      {
        label: 'Startups & New Businesses',
        description:
          'Launching soon and need a professional identity from day one — without a corporate budget.',
      },
      {
        label: 'Established Small Businesses',
        description:
          "Your current logo feels dated or was DIY'd. Time for something that reflects where you are today.",
      },
      {
        label: 'Freelancers & Solopreneurs',
        description:
          'You need a personal brand mark that commands attention on proposals, invoices, and social profiles.',
      },
      {
        label: 'Non-Profits & Community Orgs',
        description:
          'A credible logo helps you build donor trust and community recognition from the first impression.',
      },
    ],
    faqs: [
      {
        q: 'How much does logo design for a small business cost?',
        a: 'Logo design pricing for small businesses varies based on complexity, number of concepts, and deliverables. At The Coast, we offer custom quotes because every business is different — a simple wordmark requires different effort than a detailed emblem system. As a general range, professional small business logo design typically runs from $500 to $2,500 depending on scope. Our packages include discovery, three original concepts, two revision rounds, and full file delivery. We never use stock icons or template customisation — everything is created from scratch. Request a quote and we\'ll provide a transparent, flat-fee proposal with no hourly billing surprises.',
      },
      {
        q: 'How long does logo design take?',
        a: 'A professional logo design project at The Coast takes 2–3 weeks from kick-off to final delivery. Week one is discovery and concept development; week two is refinement and revisions based on your feedback; week three (if needed) is final file packaging and any last tweaks. Rush projects can sometimes be accommodated for an additional fee — ask us at enquiry. The timeline assumes you have feedback ready within 2 business days of each delivery. Extended feedback windows extend the overall timeline proportionally.',
      },
      {
        q: 'What file formats will I receive?',
        a: 'You receive your logo in every format a small business will ever need: SVG (scalable vector, ideal for websites and digital use), PNG with transparent background at multiple resolutions, PDF (print-ready, full resolution), and EPS (industry-standard vector format for vendors, printers, and merchandise suppliers). We also export a social profile version optimised for circular cropping. All files are delivered via a organised download folder with a short naming-convention guide so you always know which file to use for which application.',
      },
    ],
    relatedSlugs: ['brand-identity', 'brand-guidelines', 'rebrand'],
  },

  {
    slug: 'brand-identity',
    number: '02',
    name: 'Brand Identity',
    category: 'Brand Identity',
    headline: 'Brand Identity Design Services',
    metaTitle: 'Brand Identity Design Services | The Coast',
    metaDescription:
      'Complete brand identity design — logo, colour palette, typography, brand patterns, and usage guidelines. One cohesive system that scales across every touchpoint.',
    tagline: 'Every element of your brand working together — consistently, compellingly, correctly.',
    heroBody:
      'The Coast delivers complete brand identity systems built around a clear brand strategy. Beyond the logo, you receive a full visual language: primary and secondary colour palettes with HEX/RGB/CMYK values, typographic hierarchy for digital and print, brand pattern elements, photography art direction guidelines, and a comprehensive brand guidelines document your whole team can follow.',
    timeline: '4–6 weeks',
    priceRange: 'Custom quote',
    stats: [
      { value: '6+', label: 'Identity elements' },
      { value: '4–6', label: 'Week timeline' },
      { value: '∞', label: 'Consistent touchpoints' },
    ],
    deliverables: [
      'Primary & secondary logo suite',
      'Full colour palette (HEX, RGB, CMYK, Pantone)',
      'Typographic hierarchy — headings, body, accent',
      'Brand pattern or texture element',
      'Iconography style guidelines',
      'Photography / imagery art direction',
      'Voice & tone summary',
      'Comprehensive brand guidelines PDF (20–40 pages)',
    ],
    process: [
      {
        step: '01',
        title: 'Discover',
        description:
          'A structured brand strategy workshop — in-person or remote — covering your positioning, target audience archetypes, competitive landscape, and brand personality attributes. This becomes the strategic brief that drives every creative decision.',
      },
      {
        step: '02',
        title: 'Design',
        description:
          'We develop your complete visual identity system — logo, palette, typography, patterns, and supporting elements — presented in context across real-world mockups so you can see exactly how the system performs.',
      },
      {
        step: '03',
        title: 'Develop',
        description:
          'We refine every element across two structured revision rounds. We test the identity across digital, print, and environmental applications to ensure it holds up at every scale and in every medium.',
      },
      {
        step: '04',
        title: 'Launch',
        description:
          'You receive a complete asset library and a professionally formatted brand guidelines document — your single source of brand truth for every designer, printer, and platform you work with going forward.',
      },
    ],
    audiences: [
      {
        label: 'Growing Businesses',
        description:
          "You've outgrown your DIY brand and need a complete, professional identity that reflects your ambition.",
      },
      {
        label: 'Funded Startups',
        description:
          'Investor credibility demands visual coherence. A complete brand identity system signals maturity and intentionality.',
      },
      {
        label: 'New Market Entrants',
        description:
          'Entering a competitive market and need to establish a distinctive visual presence that differentiates you from day one.',
      },
      {
        label: 'Brand Consolidations',
        description:
          'Multiple sub-brands or acquired entities that need a unified visual language under a single parent identity.',
      },
    ],
    faqs: [
      {
        q: 'What is the difference between a logo and a brand identity?',
        a: 'A logo is a single mark — an icon, wordmark, or combination — that identifies your business. A brand identity is the complete visual system built around that mark. It includes your colour palette (with precise colour codes for every application), your typographic system (the fonts, weights, and sizes used for headings, body copy, and labels), brand pattern elements that add texture and recognition to layouts, photography and imagery guidelines that describe the visual tone of your photography, and a comprehensive brand guidelines document that tells anyone working with your brand exactly how to apply every element correctly. Businesses with consistent brand identity across all touchpoints see meaningfully higher revenue and stronger customer retention than those with fragmented visuals.',
      },
      {
        q: 'How long does a brand identity project take?',
        a: 'A complete brand identity project at The Coast typically runs 4–6 weeks. The first week is dedicated to the strategy workshop and research phase. Weeks two and three are concept development, where we build out the full visual system and present it in context. Weeks four and five cover revision rounds — refining the chosen direction based on your structured feedback. The final week is file packaging, brand guidelines document production, and asset delivery. The timeline can extend if your business has multiple stakeholders whose input is needed at review stages, or compress slightly if you have a clear brief and fast feedback cycles.',
      },
      {
        q: 'Do I need a brand identity or just a logo?',
        a: 'If your business appears in more than one place — a website, social media, printed materials, packaging, or a physical location — you need a brand identity, not just a logo. A standalone logo without a supporting colour palette, typography system, and usage guidelines leads to inconsistency as different designers, platforms, and vendors make different creative decisions with your mark. That inconsistency erodes brand recognition over time. The brand identity package is the right choice for businesses serious about long-term growth. If you\'re pre-revenue and working on a very tight budget, a logo-only project can be a valid starting point — with the intent to build the full identity system later.',
      },
    ],
    relatedSlugs: ['logo-design', 'brand-guidelines', 'rebrand'],
  },

  {
    slug: 'rebrand',
    number: '03',
    name: 'Rebrand',
    category: 'Brand Identity',
    headline: 'Rebrand Small Business',
    metaTitle: 'Rebrand Small Business | The Coast',
    metaDescription:
      'Strategic rebrand for small businesses — new visual identity, updated messaging, and a complete rollout plan. Evolve your brand without losing the equity you\'ve built.',
    tagline: 'Same business, stronger identity — a rebrand that respects your history while building your future.',
    heroBody:
      "The Coast leads small business rebrands from strategic audit to final rollout. We analyse your existing brand equity, identify what to preserve and what to evolve, and build a refreshed visual identity system that feels both new and authentic. The result is a brand that reflects who you are today — and positions you for where you're going.",
    timeline: '6–8 weeks',
    priceRange: 'Custom quote',
    stats: [
      { value: '6–8', label: 'Week timeline' },
      { value: '360°', label: 'Brand audit' },
      { value: '100%', label: 'Equity preserved' },
    ],
    deliverables: [
      'Brand audit and equity analysis report',
      'Rebrand strategy brief',
      'Refreshed logo suite (primary + secondary + mark)',
      'Updated colour palette with all colour codes',
      'New or updated typographic system',
      'Brand pattern and supporting visual elements',
      'Updated brand guidelines document',
      'Rollout priority checklist and asset replacement guide',
    ],
    process: [
      {
        step: '01',
        title: 'Discover',
        description:
          'We conduct a comprehensive brand audit — reviewing your existing identity, stakeholder perceptions, competitor positioning, and growth goals. We identify the equity worth keeping and the elements holding you back.',
      },
      {
        step: '02',
        title: 'Design',
        description:
          'We develop two or three rebrand directions — each presenting a different level of evolution, from a conservative refresh to a bold transformation — so you can make an informed strategic choice.',
      },
      {
        step: '03',
        title: 'Develop',
        description:
          'We build out the chosen direction into a complete identity system, refining every element through revision rounds and testing the new identity across all the touchpoints where your brand currently lives.',
      },
      {
        step: '04',
        title: 'Launch',
        description:
          'We deliver all assets plus a prioritised rollout plan — telling you exactly which touchpoints to update first, second, and third for maximum impact with minimal disruption to your operations.',
      },
    ],
    audiences: [
      {
        label: 'Businesses Pivoting',
        description:
          'Your products, services, or target customers have changed and your visual identity no longer reflects who you are.',
      },
      {
        label: 'Post-Acquisition or Merger',
        description:
          'Two entities becoming one need a unified identity that honours both histories while creating something new.',
      },
      {
        label: 'Legacy Brands',
        description:
          'Your brand has decades of equity but looks dated in a modern market. A strategic refresh retains recognition while modernising appeal.',
      },
      {
        label: 'Reputation Recovery',
        description:
          'A fresh visual identity can signal a new chapter for businesses navigating reputational challenges or leadership changes.',
      },
    ],
    faqs: [
      {
        q: 'How do I know if my small business needs a rebrand?',
        a: 'Common signals that a small business needs a rebrand include: your logo looks dated compared to competitors; your visual identity was created without professional help and lacks consistency; your business has significantly evolved but your branding hasn\'t kept pace; you\'re entering a new market or demographic that your current brand doesn\'t resonate with; you\'ve received feedback that customers don\'t perceive your brand the way you intend; or you\'ve gone through a merger, acquisition, or leadership change. A rebrand isn\'t always a complete overhaul — sometimes a strategic refresh that retains core recognisable elements while modernising the execution is the right move. Our brand audit process helps you make that determination before committing to a scope.',
      },
      {
        q: 'Will a rebrand confuse my existing customers?',
        a: 'A well-executed rebrand communicated properly should not confuse existing customers — it should refresh their perception of you. The keys are: preserving meaningful equity (a colour, a mark element, a name) that anchors recognition; announcing the rebrand proactively through your channels with a simple "same business, new look" message; and rolling out consistently across all touchpoints within a short window so customers don\'t encounter mixed signals. We provide a rollout guide and asset replacement priority checklist with every rebrand project. If you have a significant customer base, we can also advise on a phased communication strategy that pre-announces the change before the visual switch.',
      },
      {
        q: 'How is a rebrand different from a brand refresh?',
        a: 'A rebrand is a comprehensive overhaul of your visual identity and often your positioning — it may involve a new name, a completely new logo, a new colour system, and a new messaging framework. A brand refresh is a more conservative evolution — updating your logo while retaining its core shape, refreshing colours to feel more contemporary, or modernising typography without changing the fundamental identity. At The Coast, our rebrand discovery process helps determine which is appropriate for your situation. Both are valid strategic choices, and the right one depends on how much equity your current brand has, how far your business has evolved, and how distinct you need to be from your current perception.',
      },
    ],
    relatedSlugs: ['brand-identity', 'logo-design', 'brand-guidelines'],
  },

  {
    slug: 'brand-guidelines',
    number: '04',
    name: 'Brand Guidelines',
    category: 'Brand Identity',
    headline: 'Brand Guidelines Design Service',
    metaTitle: 'Brand Guidelines Design Service | The Coast',
    metaDescription:
      'Professional brand guidelines that standardise your visual identity. Comprehensive style guide covering logo usage, colour, typography, and tone of voice — ready to share with any designer or vendor.',
    tagline: 'One document that makes every future design decision easier for everyone.',
    heroBody:
      'The Coast creates professionally designed brand guidelines documents that serve as the definitive reference for your visual identity. Whether you have an existing brand that needs codifying or a new identity that needs documenting, we build a clear, comprehensive style guide covering logo usage rules, colour palette specifications, typographic hierarchy, imagery direction, and tone of voice — formatted for PDF distribution and digital use.',
    timeline: '1–2 weeks',
    priceRange: 'Custom quote',
    stats: [
      { value: '20–40', label: 'Page document' },
      { value: '100%', label: 'Ready to share' },
      { value: '∞', label: 'Team members covered' },
    ],
    deliverables: [
      'Brand overview and positioning statement',
      'Logo usage rules (spacing, sizing, do/don\'t)',
      'Full colour palette with HEX, RGB, CMYK, Pantone',
      'Typography system with hierarchy examples',
      'Imagery and photography direction',
      'Pattern and texture usage rules',
      'Tone of voice and language guidelines',
      'Formatted PDF (print and digital versions)',
    ],
    process: [
      {
        step: '01',
        title: 'Discover',
        description:
          'We review all your existing brand assets — logos, colour files, fonts, any previous style documentation — and interview key stakeholders to understand how the brand is currently used and what problems the guidelines need to solve.',
      },
      {
        step: '02',
        title: 'Design',
        description:
          'We build the guidelines document structure and design the layout to be visually aligned with your brand. We draft all sections and populate them with your brand specifications, examples, and usage rules.',
      },
      {
        step: '03',
        title: 'Develop',
        description:
          'We refine the document through a structured review round, addressing any missing sections, unclear instructions, or specification corrections. We ensure every rule is practical and actionable for designers who are unfamiliar with your brand.',
      },
      {
        step: '04',
        title: 'Launch',
        description:
          'We deliver a polished, print-ready PDF and a digital-optimised version. We also provide a plain-text colour and font specification sheet for quick reference in everyday design work.',
      },
    ],
    audiences: [
      {
        label: 'Businesses with Teams',
        description:
          'Multiple people creating content or collateral who need a single source of brand truth to maintain consistency.',
      },
      {
        label: 'Working with Vendors',
        description:
          'Printing companies, web developers, and freelancers all need brand specifications to implement your identity correctly.',
      },
      {
        label: 'Franchises & Multi-Location',
        description:
          'Standardised guidelines ensure brand consistency across every location, regardless of who creates the local materials.',
      },
      {
        label: 'Funded & Scaling Businesses',
        description:
          'Investor and partner presentations require demonstrable brand discipline — a comprehensive style guide signals professionalism.',
      },
    ],
    faqs: [
      {
        q: 'What should brand guidelines include?',
        a: 'Comprehensive brand guidelines should include: logo usage rules covering spacing, minimum size, permitted colour variations, and common misuse examples; colour palette specifications with HEX codes for digital, RGB for screen design tools, CMYK for print, and Pantone (PMS) matches for brand-critical print applications; typographic hierarchy defining which fonts are used for headings, subheadings, body copy, captions, and labels — with examples; imagery and photography direction describing the visual tone, subject matter, and editing style that aligns with your brand; pattern and graphic element usage rules; and a tone of voice section covering your brand\'s personality in writing, example phrases, and words to avoid. The document should be detailed enough that a designer who has never worked with your brand before can produce on-brand work from it alone.',
      },
      {
        q: 'Do I need brand guidelines if I\'m a small business?',
        a: 'Yes — arguably more so than large businesses. Small businesses typically have limited in-house design capacity and rely on a rotating cast of freelancers, agencies, and platform tools to produce their materials. Without brand guidelines, each of those contributors makes independent creative decisions about colours, fonts, and logo usage. Over time, this produces a fragmented brand that customers don\'t recognise. Brand guidelines don\'t need to be a 100-page enterprise-scale document — a focused 20-page style guide covering logo, colour, typography, and tone of voice is sufficient for most small businesses and pays for itself immediately by eliminating costly back-and-forth with every new design project.',
      },
      {
        q: 'Can you create guidelines for a brand you didn\'t design?',
        a: 'Yes. The brand guidelines service is available as a standalone project for existing brands. We\'ll request all your existing brand assets — original logo files, any colour references, font information, and any previous brand documentation — and build a comprehensive, professionally designed style guide from those materials. If we find gaps in your existing brand (missing file formats, unclear colour specifications, inconsistent logo versions), we\'ll flag them and can remediate them as part of the project scope. This is a common first project for businesses that have a reasonable brand in place but have never formally documented it.',
      },
    ],
    relatedSlugs: ['brand-identity', 'logo-design', 'rebrand'],
  },

  {
    slug: 'epk-design',
    number: '05',
    name: 'EPK Design',
    category: 'Collateral',
    headline: 'EPK Design Service',
    metaTitle: 'EPK Design Service for Artists & Musicians | The Coast',
    metaDescription:
      'Professional EPK design for musicians, artists, DJs, and performers. A press kit that gets you booked — biography, press photos, streaming stats, rider, and contact — beautifully designed.',
    tagline: 'Your EPK is your first impression with every booker, label, and journalist. Make it count.',
    heroBody:
      'The Coast designs professional electronic press kits (EPKs) for musicians, artists, DJs, podcasters, and performers. A well-designed EPK communicates credibility instantly to bookers, labels, music supervisors, and press contacts. We combine your biography, press photos, streaming stats, music samples links, and booking information into a single polished PDF or one-page website that opens doors.',
    timeline: '1 week',
    priceRange: 'Custom quote',
    stats: [
      { value: '1', label: 'Week turnaround' },
      { value: '2', label: 'Formats (PDF + web)' },
      { value: '∞', label: 'Booking opportunities' },
    ],
    deliverables: [
      'Artist biography (short and long versions)',
      'Photography layout and retouching direction',
      'Streaming stats and achievement highlights section',
      'Discography / release timeline',
      'Press quote pull-outs and media logos',
      'Technical rider summary (optional)',
      'Booking contact page',
      'Print-ready PDF EPK + shareable digital link',
    ],
    process: [
      {
        step: '01',
        title: 'Discover',
        description:
          'We gather all your materials — biography draft, press photos, streaming data, past press quotes, notable performances, and any existing brand elements — and ask targeted questions about the bookers, labels, or press contacts this EPK needs to impress.',
      },
      {
        step: '02',
        title: 'Design',
        description:
          'We design the EPK layout to reflect your artistic identity — the typography, colour treatment, photo curation, and layout structure all align with your genre and aesthetic. You see the full design before any copy is finalised.',
      },
      {
        step: '03',
        title: 'Develop',
        description:
          'We incorporate your feedback, refine the biography and copy, and build out the final design. We ensure the document is structured so bookers can find what they need in under 30 seconds.',
      },
      {
        step: '04',
        title: 'Launch',
        description:
          'We deliver a high-resolution PDF optimised for both printing and digital sharing, plus a web-hosted version with a shareable link. You also receive editable source files so you can update stats and dates yourself.',
      },
    ],
    audiences: [
      {
        label: 'Independent Musicians & Bands',
        description:
          'Pursuing festival slots, venue bookings, and label interest without a management team handling your press materials.',
      },
      {
        label: 'DJs & Electronic Artists',
        description:
          'Building a booking portfolio for club residencies, tours, and brand partnerships that require a professional media pack.',
      },
      {
        label: 'Podcasters & Content Creators',
        description:
          'Pitching to sponsors, speaking engagements, or press features that require a professional media kit.',
      },
      {
        label: 'Visual Artists & Performers',
        description:
          'Applying to galleries, residencies, commissions, and collaborative projects that request a press kit or portfolio document.',
      },
    ],
    faqs: [
      {
        q: 'What is an EPK and why do I need one as an artist?',
        a: 'An EPK (Electronic Press Kit) is a professionally designed document — typically a PDF or web page — that presents everything a booker, label, music supervisor, or journalist needs to know about you in one place. It typically includes your biography, press photos, streaming statistics and platform links, notable performances or placements, press quotes, and booking contact information. Bookers and industry gatekeepers receive hundreds of booking enquiries and unsolicited emails. An artist without a professional EPK is immediately at a disadvantage — it signals you haven\'t invested in your professional presentation. A well-designed EPK communicates not just your credentials but your aesthetic sensibility, your professionalism, and your seriousness about your career.',
      },
      {
        q: 'What should I include in my EPK?',
        a: 'A complete artist EPK should include: a compelling biography in both a short (100-word) and long (300-word) version; high-quality press photographs (horizontal and vertical orientations); streaming statistics from Spotify, Apple Music, or your primary platform; links to your music for easy sampling; notable performances, placements, or credits; press quotes from any publications, blogs, or tastemakers who have covered you; social media follower counts if significant; a technical rider summary if relevant; and clear booking contact information. Optional additions include a video reel link, a discography section with release dates, and any brand partnership or sync licensing credits. We help you identify what to include based on your career stage and what specific industry contacts you\'re targeting.',
      },
      {
        q: 'Do I need a new EPK for every opportunity I pitch?',
        a: 'Not necessarily — a well-structured EPK is designed to be flexible. However, you may want to emphasise different elements depending on your audience: a festival booking pitch should lead with your live performance credentials and stage tech specs, while a label pitch should lead with streaming growth metrics and songwriting credits. We design your EPK with this in mind, structuring sections so you can optionally swap out the lead section or create a short custom cover page for specific pitches. We also deliver the editable source files so you can update streaming stats, add new press quotes, and keep the document current without commissioning a full redesign every time.',
      },
    ],
    relatedSlugs: ['flyers', 'social-graphics', 'pitch-deck'],
  },

  {
    slug: 'social-graphics',
    number: '06',
    name: 'Social Graphics',
    category: 'Collateral',
    headline: 'Social Media Graphics Design Service',
    metaTitle: 'Social Media Graphics Design Service | The Coast',
    metaDescription:
      'Branded social media graphics and templates designed for Instagram, LinkedIn, TikTok, and Facebook. 5–10 reusable templates your team can update without a designer.',
    tagline: 'Scroll-stopping graphics your team can actually use — consistent, on-brand, and built to scale.',
    heroBody:
      'The Coast designs branded social media graphics and editable template sets for businesses that need to post consistently without hiring a full-time designer. Each set includes 5–10 platform-optimised templates for announcements, promotions, quotes, events, and evergreen content — all formatted for Instagram, LinkedIn, Facebook, and TikTok, and delivered in an editable format your team can update independently.',
    timeline: '1–2 weeks',
    priceRange: 'Custom quote',
    stats: [
      { value: '5–10', label: 'Branded templates' },
      { value: '4+', label: 'Platform formats' },
      { value: '∞', label: 'Reusable content' },
    ],
    deliverables: [
      'Post templates (square, portrait, landscape)',
      'Story and Reel cover templates',
      'Announcement / launch graphic',
      'Quote and testimonial template',
      'Promotion / sale graphic',
      'Event or webinar announcement template',
      'Profile highlight cover set (Instagram)',
      'Editable source files (Canva or Figma)',
    ],
    process: [
      {
        step: '01',
        title: 'Discover',
        description:
          'We review your existing brand assets, audit your current social presence, and identify the 5–10 content types you post most frequently. We discuss which platforms are priorities and what your team\'s editing capability is, to ensure the templates are genuinely usable.',
      },
      {
        step: '02',
        title: 'Design',
        description:
          'We design your complete template set — each template fully branded with your logo, colours, and typography — and present them as a styled preview showing example content populated into each format.',
      },
      {
        step: '03',
        title: 'Develop',
        description:
          'We refine the templates based on your feedback, adjust any elements that aren\'t working, and ensure every template has logical, named layers so editing is intuitive even for non-designers.',
      },
      {
        step: '04',
        title: 'Launch',
        description:
          'We deliver the complete template set in your preferred editing platform (Canva or Figma), plus exported PNG/JPG versions of each template pre-populated with example content — ready to post immediately.',
      },
    ],
    audiences: [
      {
        label: 'Small Business Owners',
        description:
          'Posting to social media yourself and need professional-looking graphics without opening Photoshop every time.',
      },
      {
        label: 'Marketing Teams',
        description:
          'Small marketing departments where the person posting isn\'t a graphic designer and needs templates they can execute independently.',
      },
      {
        label: 'Content Creators & Coaches',
        description:
          'Building a personal brand on social and need a cohesive visual identity across all their content formats.',
      },
      {
        label: 'Agencies Managing Multiple Clients',
        description:
          'Needing bespoke template sets for each client that look custom rather than generic.',
      },
    ],
    faqs: [
      {
        q: 'What social media platforms do you design graphics for?',
        a: 'We design graphics for all major social media platforms: Instagram (feed posts in square 1:1 and portrait 4:5, plus Stories and Reels covers at 9:16), LinkedIn (post graphics at 1200×627 and document carousels), Facebook (post graphics and event banners), TikTok (cover graphics at 9:16), Twitter/X (post images at 16:9), and Pinterest (pins at 2:3). Most template sets prioritise the 2–3 platforms most relevant to your business. Every template is designed at 2x resolution to ensure sharp rendering on retina displays, and all exports are provided at the exact pixel dimensions each platform recommends to avoid quality loss from compression.',
      },
      {
        q: 'Will I be able to edit the templates myself?',
        a: 'Yes — usability is a core design requirement for our social media template projects. We deliver templates in either Canva (recommended for non-designers) or Figma (preferred by designers and marketing teams). Canva templates are shared via a direct link — you copy them to your own account and edit text and images without any technical knowledge. Figma templates use clearly named layers and auto-layout components that make swapping images and updating text straightforward. We include a short written guide explaining how to edit each template type. If you need a quick video walkthrough, we can provide that as an add-on.',
      },
      {
        q: 'How many graphics do I need for my social media strategy?',
        a: 'For most small businesses, a core set of 6–8 templates covers the majority of social posting needs: one announcement template, one promotional/offer template, one quote or testimonial template, one event template, one "behind the scenes" or team template, one educational/tip template, and one evergreen content template. Some businesses also benefit from a product or service spotlight template. Having 6–8 distinct templates prevents your feed from looking repetitive while providing enough variety to cover your editorial calendar. If you post daily, you\'ll want to rotate templates frequently enough that your audience sees variety — we can advise on a simple content rotation framework as part of the project.',
      },
    ],
    relatedSlugs: ['social-media-management', 'flyers', 'brand-identity'],
  },

  {
    slug: 'pitch-deck',
    number: '07',
    name: 'Pitch Deck',
    category: 'Collateral',
    headline: 'Pitch Deck Design Service',
    metaTitle: 'Pitch Deck Design Service | The Coast',
    metaDescription:
      'Investor-ready pitch deck design. We take your content and transform it into a compelling, visually polished presentation that communicates traction, credibility, and vision.',
    tagline: 'Your idea is fundable. Your deck needs to prove it — visually, clearly, immediately.',
    heroBody:
      'The Coast designs investor-ready pitch decks that communicate your business\'s traction, market opportunity, and vision with visual clarity. We work from your existing content or help you structure it, then produce a professionally designed presentation — optimised for live pitches and email-send formats — that holds attention and conveys credibility from slide one.',
    timeline: '1–2 weeks',
    priceRange: 'Custom quote',
    stats: [
      { value: '12–20', label: 'Slides delivered' },
      { value: '2', label: 'Formats (live + PDF)' },
      { value: '100%', label: 'Custom design' },
    ],
    deliverables: [
      'Cover and title slide',
      'Problem and solution slides',
      'Market size and opportunity slide',
      'Product / service overview slides',
      'Business model and revenue slide',
      'Traction and metrics slide',
      'Team slide',
      'Ask and use of funds slide',
      'Editable source file (PowerPoint or Google Slides)',
    ],
    process: [
      {
        step: '01',
        title: 'Discover',
        description:
          'We review your existing deck, content notes, or bullet points and identify the narrative structure that will resonate with your target investors. We align on the core story arc — problem, solution, market, traction, team, ask — before any design begins.',
      },
      {
        step: '02',
        title: 'Design',
        description:
          'We design the complete deck — cover, all content slides, and appendix structure — applying your brand or creating a polished visual system if your brand isn\'t yet established. Data visualisations, charts, and icons are custom-designed, not sourced from generic libraries.',
      },
      {
        step: '03',
        title: 'Develop',
        description:
          'We refine the deck through a structured review round, incorporating your content updates, layout adjustments, and any narrative restructuring. We also review for clarity — ensuring no slide is overloaded and every key message can be read in under 10 seconds.',
      },
      {
        step: '04',
        title: 'Launch',
        description:
          'We deliver two versions: a live pitch deck (for screen presentation) and a standalone PDF that works without a presenter narrating it. Both versions are delivered in editable source format so you can update metrics and content going forward.',
      },
    ],
    audiences: [
      {
        label: 'Seed-Stage Founders',
        description:
          'Preparing for your first institutional round and need a deck that meets investor expectations for visual quality and narrative clarity.',
      },
      {
        label: 'Series A & B Companies',
        description:
          'Scaling your raise and need a deck that reflects the maturity and traction your business has achieved since the last round.',
      },
      {
        label: 'Grant & Competition Applicants',
        description:
          'Presenting to accelerator programmes, grant panels, or pitch competitions where presentation quality directly influences outcomes.',
      },
      {
        label: 'Corporate Innovation Teams',
        description:
          'Presenting new initiatives, product proposals, or budget requests internally and need executive-quality presentation design.',
      },
    ],
    faqs: [
      {
        q: 'How many slides should a pitch deck have?',
        a: 'The ideal investor pitch deck has 12–16 slides for a live presentation, covering: cover, problem, solution, market size, product, business model, traction, competitive landscape, go-to-market strategy, team, financial projections, and the ask. Some decks include an appendix with supporting data for the Q&A. Fewer than 10 slides often means missing critical information; more than 20 means you haven\'t edited ruthlessly enough. The cardinal rule is that no single slide should try to make more than one point. If you can\'t articulate the purpose of each slide in a single sentence, the slide needs to be redesigned or cut.',
      },
      {
        q: 'Do you help with the content of the pitch deck or just the design?',
        a: 'We primarily provide design services — we take your content and make it visually compelling. However, we do provide structural consulting as part of the discovery process: we review your narrative flow, flag slides that are overloaded or unclear, suggest restructuring where the story would benefit from it, and recommend what data to include on each slide based on what investors expect to see. We do not write your pitch narrative from scratch — you are the expert on your business. But we\'ll give you clear, direct feedback on whether your content communicates what it needs to communicate at the pace and clarity a pitch setting demands.',
      },
      {
        q: 'What file format will my pitch deck be delivered in?',
        a: 'We deliver pitch decks in PowerPoint (.pptx) format as the primary editable file — universally compatible and easy to present in any environment. We also export a PDF version optimised for email sharing and a PDF version optimised for print, with all fonts embedded. If you work exclusively in Google Slides, we can convert the final design to Google Slides format and share it to your Google Drive — note that complex animations and some custom fonts may behave differently in Google Slides than in PowerPoint, which we\'ll flag during handover. We do not deliver Keynote files unless specifically requested.',
      },
    ],
    relatedSlugs: ['brand-identity', 'website-design', 'social-graphics'],
  },

  {
    slug: 'website-design',
    number: '08',
    name: 'Website Design',
    category: 'Digital',
    headline: 'Website Design for Startups',
    metaTitle: 'Website Design for Startups | The Coast',
    metaDescription:
      'Custom website design for startups and small businesses. Strategy-led design that converts visitors into customers — no templates, no page builders, no compromises.',
    tagline: 'A website that works as a 24/7 sales tool — not just a digital business card.',
    heroBody:
      'The Coast designs custom websites for startups and small businesses that combine strategic clarity with visual polish. We handle information architecture, UX design, visual design, and development handoff — or full-stack development for qualifying projects. Every site is optimised for conversion, accessibility, and search engine visibility from the ground up.',
    timeline: '4–8 weeks',
    priceRange: 'Custom quote',
    stats: [
      { value: '4–8', label: 'Week timeline' },
      { value: '100%', label: 'Custom design' },
      { value: '∞', label: 'Scalable pages' },
    ],
    deliverables: [
      'Information architecture and sitemap',
      'Wireframes for key pages',
      'Full visual design (desktop + mobile)',
      'UI component library',
      'Responsive design across device sizes',
      'Design handoff for development (or full development)',
      'SEO page structure and meta framework',
      'Performance and accessibility review',
    ],
    process: [
      {
        step: '01',
        title: 'Discover',
        description:
          'We audit your current digital presence, analyse your target audience\'s behaviour, review competitor websites, and define the primary conversion goals for each page. This strategic foundation prevents the most common website failure: a beautiful site that doesn\'t convert.',
      },
      {
        step: '02',
        title: 'Design',
        description:
          'We produce wireframes for all key pages, then develop the full visual design — applying your brand identity across the complete layout. Every design decision is tied to a conversion or usability rationale.',
      },
      {
        step: '03',
        title: 'Develop',
        description:
          'We prepare a complete development handoff package — or, for qualifying projects, build the site directly in your chosen CMS or framework. We test across browsers, device sizes, and connection speeds before any handoff.',
      },
      {
        step: '04',
        title: 'Launch',
        description:
          'We coordinate the final review, support the go-live process, and deliver documentation covering content management, image optimisation guidelines, and recommended analytics setup. Post-launch support is available.',
      },
    ],
    audiences: [
      {
        label: 'Pre-Launch Startups',
        description:
          'Building your first professional web presence and need something that reflects your vision and converts early visitors into sign-ups or customers.',
      },
      {
        label: 'Small Businesses with Outdated Sites',
        description:
          'Your current site was built years ago and is no longer competitive — either visually, technically, or in terms of mobile performance.',
      },
      {
        label: 'Post-Funding Companies',
        description:
          'You\'ve raised a round and your website needs to reflect the credibility and ambition your investors have endorsed.',
      },
      {
        label: 'E-Commerce Brands',
        description:
          'Launching or redesigning a product-focused site that needs to balance strong visual merchandising with frictionless checkout flows.',
      },
    ],
    faqs: [
      {
        q: 'What is included in website design for startups?',
        a: 'Our website design for startups includes: a discovery and strategy session covering your audience, goals, and competitive landscape; information architecture (the page hierarchy and navigation structure); wireframes showing the layout and content structure for each key page before visual design begins; full visual design across desktop and mobile breakpoints; a UI component library documenting all reusable design patterns; a complete development handoff package in Figma with annotated specifications; SEO page structure including title tag and meta description framework; and a performance and accessibility review before launch. For qualifying projects, we also provide full-stack development — ask about this when you request a quote.',
      },
      {
        q: 'Do you build the website or just design it?',
        a: 'Both options are available depending on your project. For design-only projects, we deliver a comprehensive Figma handoff package that your development team can build from directly. For full-service projects, we provide both design and development — typically using Next.js, WordPress, or Webflow depending on your requirements. We\'ll recommend the right technical approach during discovery based on your content management needs, expected traffic, and long-term maintenance capacity. If you\'re a startup with a technical co-founder, design-only is often the right choice. If you have no internal technical resource, full-service is typically faster and more cost-effective.',
      },
      {
        q: 'How long does it take to design a website for a startup?',
        a: 'A complete website design project at The Coast takes 4–8 weeks depending on the number of pages, complexity of interactions, and decision-making speed on your side. A focused marketing site (5–7 pages) typically runs 4–5 weeks. A larger site with a blog, case studies, and product pages runs 6–8 weeks. If development is included, add 4–6 weeks to those timelines. The most common timeline extension is delayed client feedback — having a clear internal decision-making process and committing to review turnaround times at the project outset is the single biggest factor in keeping timelines on track.',
      },
    ],
    relatedSlugs: ['brand-identity', 'social-media-management', 'social-graphics'],
  },

  {
    slug: 'flyers',
    number: '09',
    name: 'Flyers',
    category: 'Collateral',
    headline: 'Flyer Design Service for Small Business',
    metaTitle: 'Flyer Design Service for Small Business | The Coast',
    metaDescription:
      'Professional flyer design for small businesses. Print-ready and digital-ready promotional designs for events, offers, and announcements — delivered fast.',
    tagline: 'Promotional design that stops people mid-scroll and mid-step — compelling in print and digital.',
    heroBody:
      'The Coast designs professional promotional flyers for small businesses — for events, offers, grand openings, menus, and announcements. Every flyer is delivered print-ready (300 DPI, CMYK, bleed marks) and in a digital-optimised version for social sharing and email. Fast turnaround, brand-consistent design, and file formats your printer will accept without conversation.',
    timeline: '3–5 days',
    priceRange: 'Custom quote',
    stats: [
      { value: '3–5', label: 'Day turnaround' },
      { value: '2', label: 'Formats (print + digital)' },
      { value: '100%', label: 'Print-ready files' },
    ],
    deliverables: [
      'Print-ready PDF (300 DPI, CMYK, with bleed)',
      'Digital version for social media and email',
      'Web-optimised JPEG/PNG for online use',
      'A4/A5/US Letter size versions as required',
      'Brand-consistent typography and colour treatment',
      'One round of revisions included',
      'Final files in organised, labelled folder',
    ],
    process: [
      {
        step: '01',
        title: 'Discover',
        description:
          'We gather your event or promotion details, key messages, any imagery or logos needed, and confirm the print specifications required by your printer. We align on the hierarchy — what the reader should see first, second, and third.',
      },
      {
        step: '02',
        title: 'Design',
        description:
          'We produce a single design concept that meets the brief — arresting, on-brand, and structured for maximum readability at the sizes it will be viewed. No generic templates: every flyer is designed from scratch.',
      },
      {
        step: '03',
        title: 'Develop',
        description:
          'We incorporate your feedback through one revision round — adjusting copy, layout, colours, or imagery as needed. Additional revision rounds are available at a per-round fee if required.',
      },
      {
        step: '04',
        title: 'Launch',
        description:
          'We deliver the complete file set: print-ready PDF, digital social version, and web-optimised JPEG — all labelled clearly and sized for their intended use. Files are delivered within 24 hours of final approval.',
      },
    ],
    audiences: [
      {
        label: 'Event Organisers',
        description:
          'Promoting events — concerts, markets, workshops, sports days — that need professional promotional materials on a tight timeline.',
      },
      {
        label: 'Retail & Hospitality',
        description:
          'Shops, restaurants, cafés, and bars promoting offers, seasonal menus, and in-store events that need physical flyer stock.',
      },
      {
        label: 'Service Businesses',
        description:
          'Plumbers, cleaners, tutors, and trades distributing flyers in local areas as part of a neighbourhood marketing strategy.',
      },
      {
        label: 'Non-Profits & Community Groups',
        description:
          'Promoting fundraisers, community events, and awareness campaigns with limited budgets that need design that punches above its weight.',
      },
    ],
    faqs: [
      {
        q: 'What file format do I need for professional flyer printing?',
        a: 'For professional printing, you need a PDF file that meets your printer\'s specifications — typically 300 DPI resolution, CMYK colour mode (not RGB, which is for screens), with a 3mm bleed on all edges and crop marks. We deliver every print flyer with these specifications built in. If your printer has different requirements — a different bleed size, a specific PDF standard like PDF/X-1a — just let us know at briefing and we\'ll export to their exact specification. Many small businesses make the mistake of sending their printer a JPEG exported from Canva — this often results in blurry or colour-shifted prints that are expensive to reprint.',
      },
      {
        q: 'How quickly can you design a flyer?',
        a: 'Standard turnaround for a single flyer design is 3–5 business days from brief confirmation. If you need a flyer faster — for a last-minute event or a same-week promotion — rush turnaround (24–48 hours) is available for an additional fee, subject to capacity. To get the fastest possible result, come to the brief with: all the text you want on the flyer finalised and proofread, any images or logos needed at high resolution, and your brand colours or hex codes confirmed. Design work cannot begin until all content is provided, so having it ready before the kick-off call is the single biggest accelerator.',
      },
      {
        q: 'Can you design a flyer that works for both print and social media?',
        a: 'Yes — this is standard practice for all our flyer projects. We design the primary layout for the intended print size (A5, A4, or custom), then adapt it for digital use in the common social media formats: square (1:1 for Instagram feed), portrait story (9:16 for Instagram and Facebook Stories), and landscape (16:9 for Twitter and Facebook posts). The adaptation isn\'t a simple resize — different information hierarchies work at different aspect ratios, so we adjust layout and visual balance for each format. Both the print-ready and digital versions are included in the standard flyer project deliverables.',
      },
    ],
    relatedSlugs: ['social-graphics', 'epk-design', 'brand-identity'],
  },

  {
    slug: 'video-motion',
    number: '10',
    name: 'Video & Motion',
    category: 'Digital',
    headline: 'Motion Graphics Design Service',
    metaTitle: 'Motion Graphics Design Service | The Coast',
    metaDescription:
      'Branded motion graphics and promotional video design for businesses. Logo animations, social video templates, explainer animations, and full promotional videos — built for digital-first brands.',
    tagline: 'Your brand in motion — designed to hold attention in a world that scrolls past static.',
    heroBody:
      'The Coast creates motion graphics and promotional videos for businesses that need to communicate with immediacy and impact in digital-first environments. Services include logo animations, animated social graphics, explainer videos, brand video packages, and custom motion templates for social media — all designed to be visually consistent with your brand identity and optimised for the platforms where your audience lives.',
    timeline: '2–4 weeks',
    priceRange: 'Custom quote',
    stats: [
      { value: '2–4', label: 'Week timeline' },
      { value: 'MP4', label: 'Universal delivery' },
      { value: '∞', label: 'Platform formats' },
    ],
    deliverables: [
      'Logo animation (loop + intro/outro versions)',
      'Branded lower-thirds and title cards',
      'Animated social graphics (MP4 / GIF)',
      'Explainer or product demo animation',
      'Promotional video editing and post-production',
      'Brand motion style guide',
      'Platform-optimised exports (16:9, 9:16, 1:1)',
      'Audio-off subtitle/caption overlay version',
    ],
    process: [
      {
        step: '01',
        title: 'Discover',
        description:
          'We review your brand identity assets, define the motion style (kinetic, subtle, bold, editorial), identify the specific deliverables needed, and align on platform requirements and file specifications. We also discuss whether you need ongoing motion templates or one-off pieces.',
      },
      {
        step: '02',
        title: 'Design',
        description:
          'For animation projects, we produce static storyboards before any animation begins — showing the sequence of frames and the visual direction. For video editing projects, we produce a rough cut for review before fine cut and colour grading.',
      },
      {
        step: '03',
        title: 'Develop',
        description:
          'We produce the full animation or video, incorporating your feedback through structured revision rounds. Audio mixing, sound design, and subtitle overlays are completed at this stage for video projects.',
      },
      {
        step: '04',
        title: 'Launch',
        description:
          'We export and deliver all required platform versions — optimised for file size and quality at each destination — plus the master file for future re-editing. We include platform-specific upload specifications so your team knows exactly how to post each version.',
      },
    ],
    audiences: [
      {
        label: 'Brands Launching on Social',
        description:
          'Building a social media presence that competes with larger brands through motion and video — without a full in-house production team.',
      },
      {
        label: 'SaaS & Tech Products',
        description:
          'Product demos and explainer animations that communicate complex software benefits in under 90 seconds.',
      },
      {
        label: 'Event & Entertainment Businesses',
        description:
          'Promotional videos, event highlight reels, and branded motion content for recurring events and live experiences.',
      },
      {
        label: 'Agencies & Content Studios',
        description:
          'Overflow motion graphics and video production capacity for agencies whose clients need animated deliverables.',
      },
    ],
    faqs: [
      {
        q: 'What is motion graphics design and when do I need it?',
        a: 'Motion graphics design is the discipline of creating animated visual content — where graphic elements like logos, typography, shapes, and illustrations are given movement to communicate a message more effectively than static images can. You need motion graphics when: you want to animate your logo for video content and presentations; you need social media content that performs better than static posts (video content consistently outperforms static across platforms); you want to explain a product or service in a way that\'s faster and clearer than text or static infographics; or you need branded transitions, lower-thirds, or title cards for video content. Motion graphics don\'t require a full video production — they\'re often composite elements that enhance existing footage or operate as standalone animated graphics.',
      },
      {
        q: 'How long should a promotional video or explainer animation be?',
        a: 'For social media, the optimal video length depends on platform: Instagram Reels and TikTok perform best at 15–30 seconds; Instagram feed videos at 30–60 seconds; LinkedIn at 60–90 seconds; and YouTube at 2–5 minutes for explainer content. For website explainers or product demos, 60–90 seconds is the sweet spot — long enough to make the key points, short enough to retain attention. Every second of a promotional video should earn its place. The most common mistake is including too much information. If your brief is longer than what fits in the target duration, the brief needs to be edited — not the video extended. We help you prioritise the core message during discovery.',
      },
      {
        q: 'Do you provide video production or only motion graphics?',
        a: 'We provide both, depending on project scope. Motion graphics projects — logo animations, animated social graphics, explainer animations with illustrated characters — are fully produced in-house using After Effects, Cinema 4D, and Lottie for web animations. Video production projects — promotional videos, brand films, event coverage — are handled through our production partnerships. This means we handle the end-to-end brief, creative direction, and post-production while coordinating with vetted production partners for the shoot itself. Full production projects require a longer lead time and separate quote. For businesses that already have video footage and need post-production, editing, and motion graphics layered in, we can work directly from your footage.',
      },
    ],
    relatedSlugs: ['social-graphics', 'social-media-management', 'brand-identity'],
  },

  {
    slug: 'social-media-management',
    number: '11',
    name: 'Social Media Management',
    category: 'Digital',
    headline: 'Social Media Management Services for Small Business',
    metaTitle: 'Social Media Management for Small Business | The Coast',
    metaDescription:
      'Done-for-you social media management for small businesses. Brand-consistent content creation, scheduling, community management, and monthly performance reporting.',
    tagline: 'Your social presence, professionally managed — so you can focus on running your business.',
    heroBody:
      'The Coast provides ongoing social media management services for small businesses that need consistent, on-brand social presence without the overhead of an in-house team. Monthly retainers include content planning, branded graphic creation, caption writing, scheduling, community management, and performance reporting across your priority platforms — all aligned with your brand identity and business goals.',
    timeline: 'Ongoing monthly retainer',
    priceRange: 'Monthly retainer',
    stats: [
      { value: '30+', label: 'Posts per month' },
      { value: '4+', label: 'Platforms managed' },
      { value: '∞', label: 'Brand consistency' },
    ],
    deliverables: [
      'Monthly content calendar (planned 2 weeks ahead)',
      'Branded graphic creation for all post types',
      'Caption writing with hashtag research',
      'Post scheduling and publishing',
      'Community management (responding to comments and DMs)',
      'Monthly performance analytics report',
      'Monthly strategy review call',
      'Paid social ad management (available as add-on)',
    ],
    process: [
      {
        step: '01',
        title: 'Discover',
        description:
          'We conduct a social media audit covering your current presence, audience demographics, top-performing content, and competitor activity. We define your social strategy — platforms, content pillars, posting frequency, and primary KPIs — before creating a single piece of content.',
      },
      {
        step: '02',
        title: 'Design',
        description:
          'We build your monthly content calendar and design the first batch of graphics — your bespoke templates are produced in this phase if you don\'t already have them. We present the first month\'s content for approval before scheduling anything.',
      },
      {
        step: '03',
        title: 'Develop',
        description:
          'We publish and manage your content across all platforms, respond to community interactions, and monitor performance in real time. We adjust content and timing based on what the data shows is working.',
      },
      {
        step: '04',
        title: 'Launch',
        description:
          'Each month closes with a performance report and strategy review call — covering reach, engagement, follower growth, and content performance. We use these insights to continuously improve the next month\'s strategy.',
      },
    ],
    audiences: [
      {
        label: 'Small Business Owners',
        description:
          'Wearing every hat in your business and social media keeps falling to the bottom of the priority list — done-for-you management keeps you visible without consuming your time.',
      },
      {
        label: 'Local Service Businesses',
        description:
          'Restaurants, salons, gyms, and retail stores that need consistent local social presence to drive foot traffic and bookings.',
      },
      {
        label: 'Professional Services',
        description:
          'Consultants, lawyers, accountants, and coaches building thought leadership and referral networks through consistent LinkedIn and Instagram presence.',
      },
      {
        label: 'E-Commerce Brands',
        description:
          'Product businesses that need high-volume, high-quality social content to drive discovery and repeat purchase at scale.',
      },
    ],
    faqs: [
      {
        q: 'What does social media management for small business include?',
        a: 'Our social media management service for small businesses is a complete, done-for-you solution covering: a monthly content calendar planned 2 weeks in advance for your approval; branded graphic design for every post type — announcements, promotions, quotes, events, and evergreen content; caption writing with platform-appropriate tone, calls to action, and hashtag research; post scheduling and publishing at optimal times for your audience; community management including responding to comments and direct messages within business hours; and a monthly performance analytics report covering reach, engagement rate, follower growth, and top-performing content by format. Strategy review calls are included monthly to align the content plan with your business priorities and adapt based on performance data.',
      },
      {
        q: 'Which social media platforms do you manage?',
        a: 'We manage all major social media platforms for small businesses: Instagram, Facebook, LinkedIn, TikTok, Twitter/X, Pinterest, and Google Business Profile (for local businesses). Most small business retainers focus on 2–3 platforms that are most relevant to their audience and business model — spreading across too many platforms with insufficient volume is a common mistake. During the discovery audit, we identify which platforms your target customers are most active on and recommend a platform priority strategy based on your business type, content capacity, and goals. You don\'t need to be everywhere — you need to be excellent somewhere.',
      },
      {
        q: 'How long does it take to see results from social media management?',
        a: 'Realistic expectations are important. Organic social media is a compound discipline — results build over months, not weeks. In the first month, you\'ll see improved consistency and content quality. In months 2–3, engagement metrics typically begin to improve as the algorithm rewards consistent posting and your audience grows accustomed to regular content. Measurable follower growth and engagement lift are typically visible at the 3–6 month mark for most small business accounts. Paid social advertising — available as a retainer add-on — can accelerate reach and follower growth significantly when layered on top of the organic strategy. We report on progress monthly with full transparency on what\'s working, what isn\'t, and what we\'re adapting.',
      },
    ],
    relatedSlugs: ['social-graphics', 'video-motion', 'website-design'],
  },
]

export const SERVICE_PAGES_MAP: Record<string, ServicePage> = Object.fromEntries(
  SERVICE_PAGES.map((s) => [s.slug, s]),
)
