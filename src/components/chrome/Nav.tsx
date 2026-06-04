"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/lib/nav";
import { COMPANY } from "@/lib/content/coast";
import { Mark } from "./Mark";
import styles from "./Nav.module.css";

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  // Close on Escape while the menu is open (stay on the current page).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.mark} data-cursor-label="Home" aria-label={COMPANY.short}>
        <Mark size={30} />
      </Link>

      <button
        className={styles.toggle}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        data-cursor="active"
      >
        <span className={styles.toggleBar} data-open={open} />
        <span className={styles.toggleBar} data-open={open} />
      </button>

      <nav
        className={styles.menu}
        data-open={open}
        aria-label="Primary navigation"
        onClick={(e) => {
          // Click anywhere that isn't a nav link → close and stay on this page.
          if (!(e.target as HTMLElement).closest("a")) setOpen(false);
        }}
      >
        <ul className={styles.list}>
          {NAV.map((item, i) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={styles.link}
                data-active={pathname === item.path}
                data-cursor-label="Enter"
              >
                <span className={styles.linkIndex}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={styles.linkChamber}>{item.chamber}</span>
                <span className={styles.linkLabel}>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
