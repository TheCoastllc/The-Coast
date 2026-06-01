import Link from "next/link";
import { NAV } from "@/lib/nav";
import { Mark } from "./Mark";
import styles from "./Footer.module.css";

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

      <div className={styles.meta}>
        <span className={styles.line}>
          The Coast Global Inc. &nbsp;/&nbsp; coastglobal.org &nbsp;/&nbsp; 2026
        </span>
        <span className={styles.line}>Design the Future.</span>
      </div>
    </footer>
  );
}
