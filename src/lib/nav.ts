// Nav structure for The Coast. Single source - changes here update every page.

export type Section = {
  slug: string;
  path: string;
  chamber: string; // poetic section name (italic in nav)
  label: string; // short nav label
};

export const NAV: Section[] = [
  { slug: "home",     path: "/",         chamber: "The Coast",        label: "Index" },
  { slug: "work",     path: "/work",     chamber: "Selected Work",    label: "Work" },
  { slug: "visuals",  path: "/visuals",  chamber: "The Visual Field", label: "Visuals" },
  { slug: "services", path: "/services", chamber: "What We Do",       label: "Services" },
  { slug: "journal",  path: "/blog",     chamber: "The Journal",      label: "Journal" },
  { slug: "offers",   path: "/offers",   chamber: "The Brand Lab",    label: "Offers" },
  { slug: "about",    path: "/about",    chamber: "The Studio",       label: "About" },
  { slug: "contact",  path: "/contact",  chamber: "Start",            label: "Contact" },
];

export const getSection = (path: string) =>
  NAV.find((c) => c.path === path) ?? NAV[0];
