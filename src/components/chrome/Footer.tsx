import Link from "next/link";
import Image from "next/image";
import { NAV } from "@/lib/nav";
import { Mark } from "./Mark";
import styles from "./Footer.module.css";

/** Brand socials, defined inline so the footer (a client-safe chrome component)
 *  never reaches into the server/email-only email-templates module. URLs mirror
 *  BRAND.socials in src/lib/email-templates/base.ts. */
const SOCIALS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/coastglobal",
    glyph: (
      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/thecoastcompanylimited",
    glyph: (
      <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
        <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.76V21h-4v-5.3c0-1.27-.02-2.9-1.8-2.9-1.8 0-2.08 1.38-2.08 2.8V21h-4z" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "https://x.com/TheCoastHQ",
    glyph: (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817-5.967 6.817H1.677l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/coastglobal",
    glyph: (
      <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
        <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.87.24-1.46 1.49-1.46h1.4V4.9c-.27-.04-1.2-.12-2.28-.12-2.26 0-3.81 1.38-3.81 3.91V11H8v3h2.3v7z" />
      </svg>
    ),
  },
  {
    label: "Pinterest",
    href: "https://www.pinterest.com/coastglobal",
    glyph: (
      <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.48 2 2 6.48 2 12c0 4.1 2.47 7.61 6 9.15-.08-.78-.16-1.98.03-2.83.17-.77 1.13-4.87 1.13-4.87s-.29-.58-.29-1.44c0-1.35.78-2.36 1.76-2.36.83 0 1.23.62 1.23 1.37 0 .83-.53 2.08-.8 3.23-.23.97.48 1.76 1.44 1.76 1.72 0 3.05-1.82 3.05-4.44 0-2.32-1.67-3.94-4.05-3.94-2.76 0-4.38 2.07-4.38 4.21 0 .83.32 1.73.72 2.21a.3.3 0 0 1 .07.28c-.07.31-.24.97-.27 1.1-.04.18-.14.22-.33.13-1.25-.58-2.03-2.4-2.03-3.87 0-3.15 2.29-6.04 6.6-6.04 3.46 0 6.16 2.47 6.16 5.77 0 3.44-2.17 6.21-5.18 6.21-1.01 0-1.96-.53-2.29-1.15l-.62 2.37c-.22.87-.83 1.96-1.24 2.62.93.29 1.92.45 2.95.45 5.52 0 10-4.48 10-10S17.52 2 12 2z" />
      </svg>
    ),
  },
] as const;

/** Secondary legal / utility links. */
const LEGAL = [
  { label: "FAQ", path: "/faq" },
  { label: "Privacy", path: "/privacy" },
  { label: "Terms", path: "/terms" },
] as const;

/** Service areas - crawlable links to the location pages (local SEO). */
const AREAS = [
  { label: "Dallas-Fort Worth", path: "/locations/dallas-fort-worth" },
  { label: "Texas", path: "/locations/texas" },
  { label: "Florida", path: "/locations/florida" },
  { label: "Alabama", path: "/locations/alabama" },
] as const;

export function Footer() {
  return (
    <footer className={styles.footer}>
      {/* a tiny boat sails the top hairline as the footer scrolls into view */}
      <div className={styles.sailLane} aria-hidden="true">
        <svg
          className={styles.sailGlyph}
          viewBox="0 0 24 22"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2v11" />
          <path d="M12 3c4 1.4 6 4 6.4 8H12z" fill="currentColor" stroke="none" />
          <path d="M3.5 15h17l-2.4 4.4a2 2 0 0 1-1.76 1.05H7.66a2 2 0 0 1-1.76-1.05z" />
        </svg>
      </div>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Mark size={34} />
        </div>

        <nav className={styles.links} aria-label="Footer">
          {NAV.map((n) => (
            <Link key={n.path} href={n.path} className={styles.link} data-cursor="active">
              {n.label}
            </Link>
          ))}
          <Link href="/get-started" className={styles.link} data-cursor="active">
            Start a Project
          </Link>
          <a
            href="mailto:hello@coastglobal.org"
            className={styles.link}
            data-cursor="active"
          >
            hello@coastglobal.org
          </a>
          <a href="tel:+16827020374" className={styles.link} data-cursor="active">
            +1 (682) 702-0374
          </a>
        </nav>
      </div>

      <div className={styles.utility}>
        <ul className={styles.social} aria-label="Social media">
          {SOCIALS.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                className={styles.socialLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                data-cursor="active"
              >
                {s.glyph}
              </a>
            </li>
          ))}
        </ul>

        <nav className={styles.legal} aria-label="Legal">
          {LEGAL.map((l) => (
            <Link key={l.path} href={l.path} className={styles.link} data-cursor="active">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>

      <nav className={styles.utility} aria-label="Service areas">
        <ul className={styles.social} style={{ gap: 0 }}>
          <li>
            <Link href="/locations" className={styles.link} data-cursor="active">
              Areas we serve:
            </Link>
          </li>
        </ul>
        <div className={styles.legal}>
          {AREAS.map((a) => (
            <Link key={a.path} href={a.path} className={styles.link} data-cursor="active">
              {a.label}
            </Link>
          ))}
        </div>
      </nav>

      <div className={styles.partner}>
        <Image
          src="/claude-partner-badge.png"
          alt="The Coast Global - Preferred Services Partner in the Claude Partner Network"
          width={800}
          height={253}
          className={styles.partnerBadge}
        />
      </div>

      <div className={styles.meta}>
        <span className={styles.line}>
          The Coast Global Inc. &nbsp;/&nbsp; coastglobal.org &nbsp;/&nbsp; 2026
        </span>
        <span className={styles.line}>
          Dallas&ndash;Fort Worth, TX &nbsp;&middot;&nbsp; Serving Texas, Florida &amp; Alabama
        </span>
        <span className={styles.line}>Design the Future.</span>
      </div>
    </footer>
  );
}
