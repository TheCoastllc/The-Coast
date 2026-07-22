// Nav structure for The Coast Global. Single source - changes here update every page.

export type Section = {
  slug: string;
  path: string;
  chamber: string; // poetic section name (italic in nav)
  label: string; // short nav label
  external?: boolean; // render a plain <a> (e.g. cross-subdomain) instead of <Link>
};

export const NAV: Section[] = [
  { slug: "home",     path: "/",         chamber: "The Coast Global",        label: "Index" },
  { slug: "work",     path: "/work",     chamber: "Selected Work",    label: "Work" },
  { slug: "visuals",  path: "/visuals",  chamber: "The Visual Field", label: "Visuals" },
  { slug: "gallery",  path: "https://gallery.coastglobal.org", chamber: "The Collection", label: "Gallery", external: true },
  { slug: "services", path: "/services", chamber: "What We Do",       label: "Services" },
  { slug: "journal",  path: "/blog",     chamber: "The Journal",      label: "Journal" },
  { slug: "offers",   path: "/offers",   chamber: "The Brand Lab",    label: "Offers" },
  { slug: "wave",     path: "/cbi",      chamber: "How Strong Is Your Wave", label: "Wave" },
  { slug: "about",    path: "/about",    chamber: "The Studio",       label: "About" },
  { slug: "contact",  path: "/contact",  chamber: "Start",            label: "Contact" },
];

export const getSection = (path: string) =>
  NAV.find((c) => c.path === path) ?? NAV[0];
