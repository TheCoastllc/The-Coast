// Content for The Coast Global Inc. - a brand design studio.
// Source: coastglobal.org. No AI/venture-studio language anywhere.

export const COMPANY = {
  name: "The Coast Global Inc.",
  short: "The Coast",
  city: "Worldwide",
  domain: "coastglobal.org",
  email: "hello@coastglobal.org",
  phone: "+1 (682) 702-0374",
  founder: "David Coast",
  year: "2026",
  tagline: "Design the Future",
  tagline2: "We turn visions into empires",
  promise: "Bring us a drop, we'll deliver the ocean",
  promiseA: "Bring us a drop,",
  promiseB: "we'll deliver the ocean.",
  oneLiner:
    "Strategic brand design for entrepreneurs, artists, and growing businesses.",
};

export const HERO = {
  title: "Design the Future",
  subtitle: "The Coast / Brand Design Studio",
  location: "Working globally",
};

export const STATS = [
  { value: "50+", label: "Projects delivered" },
  { value: "30+", label: "Brands built" },
  { value: "98%", label: "Client satisfaction" },
  { value: "2-6 wk", label: "Typical timeline" },
];

// Home scroll sections - the "why"
export const THESIS = [
  {
    label: "The problem",
    title: "Most brands fail from invisibility, not lack of talent.",
    body: "Great products die unseen every day. Not because the work was not good enough, but because nobody could find it, trust it, or remember it. Branding is the difference between being overlooked and being chosen.",
  },
  {
    label: "The fix",
    title: "Professional branding, made accessible.",
    body: "Agencies charge five figures a month and up, then move slowly. We deliver agency-grade identity, websites, and strategy on a timeline founders can actually afford - without diluting the craft.",
  },
  {
    label: "The promise",
    title: "We turn visions into empires.",
    body: "An end-to-end ecosystem for the visionaries behind the brands. From the first mark to the launch campaign, we build the system that lets you scale and stay unmistakably you.",
  },
];

export type Service = {
  name: string;
  body: string;
  items: string[];
  icon?: string;
};

export const SERVICES: Service[] = [
  {
    name: "Brand Identity",
    body: "The mark, the system, the rules. Everything that makes you recognizable in a crowded feed.",
    items: ["Logo design", "Mood boards", "Brand guidelines", "Visual systems"],
    icon: "identity",
  },
  {
    name: "Website & Digital",
    body: "Sites, apps, and cinematic digital experiences that convert attention into action.",
    items: ["Website design", "Startup sites", "Product UI", "Digital experience"],
    icon: "web",
  },
  {
    name: "Creative Strategy",
    body: "Data-driven positioning that makes you impossible to ignore and easy to remember.",
    items: ["Positioning", "Naming", "Messaging", "Go-to-market"],
    icon: "compass",
  },
  {
    name: "Marketing Assets",
    body: "The pieces that carry the brand into the world, on every surface, on schedule.",
    items: ["Social graphics", "Flyers", "Campaigns", "Ad creative"],
    icon: "megaphone",
  },
  {
    name: "Pitch & EPK",
    body: "Decks and press kits that open doors with investors, labels, and partners.",
    items: ["Pitch decks", "EPK for artists", "Investor one-pagers"],
    icon: "deck",
  },
  {
    name: "Brand Guidelines",
    body: "The single source of truth that keeps you consistent as the team grows.",
    items: ["Logo usage", "Type & color", "Voice", "Templates"],
    icon: "book",
  },
];

export type WorkItem = {
  name: string;
  category: string;
  blurb: string;
  year: string;
  services: string[];
  featured?: boolean;
};

// Real clients from coastglobal.org. Descriptions are indicative - swap freely.
export const WORK: WorkItem[] = [
  { name: "AMG Records", category: "Music / Identity", year: "2025", featured: true, blurb: "Label identity and release-campaign system for an independent music house.", services: ["Brand Identity", "Campaign"] },
  { name: "OgaTicket", category: "Brand / Web", year: "2025", featured: true, blurb: "Brand and booking experience for a live-events ticketing platform.", services: ["Brand Identity", "Website & Digital"] },
  { name: "TROI", category: "Brand / Web", year: "2025", featured: true, blurb: "Identity and digital presence for a modern consumer brand.", services: ["Brand Identity", "Website & Digital"] },
  { name: "New Era", category: "Campaign", year: "2024", blurb: "Launch campaign and social system built to travel across channels.", services: ["Marketing Assets"] },
  { name: "Global Finance", category: "Brand Identity", year: "2024", blurb: "A trustworthy, modern identity for a financial services firm.", services: ["Brand Identity", "Brand Guidelines"] },
  { name: "Duda", category: "Web", year: "2024", blurb: "Marketing-site design and build, made to convert.", services: ["Website & Digital"] },
  { name: "Zapped Co", category: "Brand", year: "2023", blurb: "Bold consumer-brand identity with a system to match.", services: ["Brand Identity"] },
  { name: "Hatch SN", category: "Identity", year: "2024", blurb: "Startup identity system, ready to scale from day one.", services: ["Brand Identity"] },
  { name: "Kando", category: "Brand", year: "2023", blurb: "Brand identity and guidelines for a growing team.", services: ["Brand Identity", "Brand Guidelines"] },
  { name: "Solomon Katsman", category: "Personal Brand", year: "2024", blurb: "Personal brand and portfolio for a founder-operator.", services: ["Brand Identity", "Website & Digital"] },
];

// How the studio works.
export const PROCESS = [
  { n: "01", title: "Discovery", body: "We learn the business, the audience, and the goal. No templates, no assumptions.", icon: "search" },
  { n: "02", title: "Strategy", body: "Positioning, naming, and messaging decide what the brand stands for before a pixel moves.", icon: "compass" },
  { n: "03", title: "Design", body: "Identity, website, and assets - crafted to agency standard, delivered in weeks.", icon: "pen" },
  { n: "04", title: "Launch", body: "Guidelines and a clean handoff so the brand stays consistent as you scale.", icon: "rocket" },
];

// Engagement / pricing philosophy.
export const ENGAGEMENT = {
  lead: "Agency-grade work without the agency retainer.",
  body: "Traditional studios start at five figures a month and move slowly. We work in focused, fixed-scope sprints, so you know the cost up front and ship in weeks, not quarters.",
  models: [
    { name: "Identity Sprint", detail: "Logo, system, and guidelines.", time: "2-3 weeks" },
    { name: "Brand + Web", detail: "Full identity plus a launch-ready site.", time: "4-6 weeks" },
    { name: "Ongoing Partner", detail: "A monthly design partnership for growing teams.", time: "Retainer" },
  ],
};

export const STUDIO = {
  intro:
    "The best brand should win - not the biggest budget. The Coast is a design studio built to make that true: agency-grade identity, websites, and strategy for the founders, artists, and challengers the industry overlooks.",
  beliefs: [
    {
      n: "01",
      title: "Visible beats perfect.",
      body: "A brand that people can find, trust, and remember outperforms a flawless one nobody sees. We design for recognition first.",
      icon: "eye",
    },
    {
      n: "02",
      title: "Craft is non-negotiable.",
      body: "Accessible pricing never means lower quality. Every deliverable holds up next to work that costs ten times as much.",
      icon: "gem",
    },
    {
      n: "03",
      title: "Speed is a feature.",
      body: "Momentum matters for founders. Most projects ship in two to six weeks, not two to six months.",
      icon: "bolt",
    },
    {
      n: "04",
      title: "Strategy before decoration.",
      body: "Pretty is easy. We start with positioning and the business goal, then make it beautiful.",
      icon: "compass",
    },
  ],
  founder: {
    name: "David Coast",
    role: "Founder & CEO",
    image: "/founder.jpg",
    tag: "A true story",
    headline: "A dream born in the backseat of a car.",
    story: [
      "David Coast lost his corporate job in America and made the call most people only talk about - he bet on himself. One suitcase, a laptop, and a guitar. A one-way drive to Miami with no plan B.",
      "For months, his car was home. He worked out of Starbucks by day, showered at Planet Fitness, and built - late into every night - the studio that would become The Coast.",
      "He knew exactly what it felt like to be overlooked. So he built a studio for the people the world overlooks - the founders, the artists, the dreamers with everything to prove and no budget to prove it. Today, The Coast turns their visions into empires.",
    ],
  },
  team: [
    { name: "Ikeji", role: "Technical Lead, SEO & Development", image: "/team/ikeji.jpg" },
    { name: "ABK", role: "Creative & Brand Design", image: "/team/abk.jpg" },
    { name: "Josh", role: "Executive Assistant & Social Media", image: "/team/josh.jpg" },
    { name: "Dare", role: "AI Engineer", image: "/team/dare.jpg" },
    { name: "Ebenezer", role: "AI Engineer", image: "/team/ebenezer.jpg" },
    { name: "Rejoice", role: "Product Lead, UI / UX", image: "/team/rejoice.jpg" },
    { name: "Subham", role: "Digital Marketing Lead", image: "/team/subham.jpg" },
    { name: "Sammiat", role: "Social Media Intern", image: "/team/sammiat.jpg" },
    { name: "Ebun", role: "Social Media Intern", image: "/team/ebun.jpg" },
    { name: "Grace", role: "", image: "/team/grace.jpg" },
  ],
};

export const CONTACT = {
  cta: "Book a 30-min call",
  email: "hello@coastglobal.org",
  phone: "+1 (682) 702-0374",
  note: "Tell us what you are building. We reply fast.",
};

// Marketing consent disclosure shown at every point we collect a visitor's
// email or phone (TCPA / A2P 10DLC: consent + opt-out at point of collection).
export const CONSENT = {
  marketing:
    "By submitting your contact information, you consent to receive marketing communications including SMS/text messages from The Coast LLC. You may opt out at any time by replying STOP to any message or contacting Hello@coastglobal.org",
  // Carrier-standard SMS opt-in, shown wherever a phone number is collected (A2P 10DLC).
  sms:
    "By providing your phone number, you consent to receive SMS messages from The Coast. Message frequency varies. Reply STOP to unsubscribe, HELP for help. Message & data rates may apply.",
  // Express-consent checkbox labels (Twilio toll-free A2P / CTIA). Both render as
  // UNCHECKED checkboxes at the point of phone collection - see SmsConsent.tsx.
  smsTransactional:
    "I agree to receive automated, recurring text messages from The Coast LLC at the phone number provided about my project (updates, scheduling, and replies). Message frequency varies. Message and data rates may apply. Reply STOP to opt out, HELP for help.",
  smsMarketing:
    "I also agree to receive marketing and promotional text messages from The Coast LLC (offers, news, and updates). Consent is not a condition of any purchase. Message and data rates may apply. Reply STOP to opt out.",
  // Bump when wording changes; stored with each submission for the consent audit trail.
  version: "2026-06-16",
} as const;

/** The exact wording a user was shown + agreed to, recorded with each submission (audit trail). */
export function buildSmsConsentText(transactional: boolean, marketing: boolean): string {
  return [
    `version ${CONSENT.version}`,
    `transactional=${transactional ? "opted-in" : "no"}: ${CONSENT.smsTransactional}`,
    `marketing=${marketing ? "opted-in" : "no"}: ${CONSENT.smsMarketing}`,
  ].join(" | ");
}

// What happens after you reach out.
export const CONTACT_STEPS = [
  { n: "01", title: "Reach out", body: "Send a note or book a call. Tell us what you are building." },
  { n: "02", title: "Scope + quote", body: "We map the work to a fixed scope and a clear price within a day or two." },
  { n: "03", title: "We build", body: "Focused sprints, regular check-ins, delivered in weeks." },
];

// The studio's house palette, displayed as labeled swatches.
export type Swatch = { hex: string; name: string };
export const PALETTE: Swatch[] = [
  { hex: "#0A0C12", name: "Ink" },
  { hex: "#023661", name: "Deep Blue" },
  { hex: "#3F3A42", name: "Graphite" },
  { hex: "#76828E", name: "Steel" },
  { hex: "#DB5227", name: "Signal" },
  { hex: "#7FD3C7", name: "Sea Foam" },
];

// Editorial imagery (futuristic / fashion). Data-driven so it is easy to swap
// for owned/licensed assets before launch. Captions are brand mood lines.
export type EditorialImage = { src: string; alt: string; caption: string };
export const EDITORIAL: EditorialImage[] = [
  { src: "/img/editorial/01.jpg", alt: "Editorial brand identity study by The Coast - an identity made unmistakable", caption: "Identity, made unmistakable." },
  { src: "/img/editorial/02.jpg", alt: "Bold editorial brand design study by The Coast", caption: "Bold by design." },
  { src: "/img/editorial/03.jpg", alt: "Editorial brand study by The Coast - a brand seen, trusted, and remembered", caption: "Seen, trusted, remembered." },
  { src: "/img/editorial/04.jpg", alt: "Editorial brand vision study by The Coast", caption: "Vision without compromise." },
  { src: "/img/editorial/05.jpg", alt: "Editorial study in brand form and intent by The Coast", caption: "Form with intent." },
  { src: "/img/editorial/06.jpg", alt: "Future-facing editorial brand study by The Coast", caption: "Future-facing." },
  { src: "/img/editorial/07.jpg", alt: "Editorial brand study by The Coast, crafted to be chosen", caption: "Crafted to be chosen." },
  { src: "/img/editorial/08.jpg", alt: "Editorial brand study by The Coast - the brand as a signal", caption: "The brand as a signal." },
  { src: "/img/editorial/09.jpg", alt: "Editorial brand study by The Coast - design the future", caption: "Design the future." },
];
