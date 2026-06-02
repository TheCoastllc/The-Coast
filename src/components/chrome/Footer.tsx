import Link from "next/link";
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
    href: "https://twitter.com/TCoast13363",
    glyph: (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817-5.967 6.817H1.677l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
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

export function Footer() {
  return (
    <footer className={styles.footer}>
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
          <a
            href="mailto:hello@coastglobal.org"
            className={styles.link}
            data-cursor="active"
          >
            hello@coastglobal.org
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

      <div className={styles.meta}>
        <span className={styles.line}>
          The Coast Global Inc. &nbsp;/&nbsp; coastglobal.org &nbsp;/&nbsp; 2026
        </span>
        <span className={styles.line}>Design the Future.</span>
      </div>
    </footer>
  );
}
