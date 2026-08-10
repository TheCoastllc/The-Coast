// Nav structure for The Coast Global. Single source - changes here update every page.

export type Section = {
  slug: string;
  path: string;
  chamber: string; // poetic section name (italic in nav)
  label: string; // short nav label
  external?: boolean; // render a plain <a> (e.g. cross-subdomain) instead of <Link>
};

export const NAV: Section[] = [
  // "Home", not "Index": the editorial register lives in `chamber` (The Journal,
  // The Brand Lab, Where We Work). The short label is a wayfinding control, and
  // an external QA audit flagged "Index" twice as unfamiliar to visitors.
  { slug: "home",     path: "/",         chamber: "The Coast Global",        label: "Home" },
  { slug: "work",     path: "/work",     chamber: "Selected Work",    label: "Work" },
  { slug: "visuals",  path: "/visuals",  chamber: "The Visual Field", label: "Visuals" },
  { slug: "gallery",  path: "https://gallery.coastglobal.org", chamber: "The Collection", label: "Gallery", external: true },
  { slug: "services", path: "/services", chamber: "What We Do",       label: "Services" },
  { slug: "journal",  path: "/blog",     chamber: "The Journal",      label: "Journal" },
  { slug: "offers",   path: "/offers",   chamber: "The Brand Lab",    label: "Offers" },
  { slug: "wave",     path: "https://cbi.coastglobal.org", chamber: "How Strong Is Your Wave", label: "Wave", external: true },
  { slug: "areas",    path: "/locations", chamber: "Where We Work",   label: "Areas" },
  { slug: "about",    path: "/about",    chamber: "The Studio",       label: "About" },
  { slug: "contact",  path: "/contact",  chamber: "Start",            label: "Contact" },
];

export const getSection = (path: string) =>
  NAV.find((c) => c.path === path) ?? NAV[0];

/**
 * Zero-padded position of a route in NAV ("02", "05", ...), or undefined when
 * the route is not a nav section.
 *
 * THE single source for the section number. The HUD already derived its "C / NN"
 * from this order while every chamber page passed its own hardcoded `index`
 * literal, so the two numbers on screen disagreed (/visuals showed HUD 03 vs
 * eyebrow 02, /services 05 vs 03, /offers 07 vs 06) and the literals had even
 * started colliding with each other (work and visuals both "02", blog and
 * offers both "06"). Call this instead of writing a number by hand.
 */
export const navIndex = (path: string): string | undefined => {
  const i = NAV.findIndex((c) => c.path === path);
  return i >= 0 ? String(i + 1).padStart(2, "0") : undefined;
};
