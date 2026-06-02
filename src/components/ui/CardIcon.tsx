import type { ReactNode } from "react";

/**
 * Bespoke line-art card icons (Round 12). Stroked with currentColor so each
 * inherits its card's accent (--gc) + a drop-shadow glow via the .cardIcon CSS.
 * viewBox 0 0 24 24, 1.4 stroke, round joins.
 */
const ICONS: Record<string, ReactNode> = {
  identity: (
    <>
      <polygon points="12,3 20,7.5 20,16.5 12,21 4,16.5 4,7.5" />
      <circle cx="12" cy="12" r="3.2" />
    </>
  ),
  web: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="1.6" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <circle cx="6" cy="7" r="0.5" />
      <circle cx="8.3" cy="7" r="0.5" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <polygon points="12,6.5 14,12 12,17.5 10,12" />
    </>
  ),
  megaphone: (
    <>
      <path d="M4 10 L13 6 L13 18 L4 14 Z" />
      <path d="M13 8 C17 9.2 17 14.8 13 16" />
      <line x1="6.5" y1="14.4" x2="6.5" y2="19" />
    </>
  ),
  deck: (
    <>
      <rect x="4" y="4" width="16" height="11" rx="1.2" />
      <line x1="12" y1="15" x2="12" y2="19" />
      <line x1="8" y1="20" x2="16" y2="20" />
      <polyline points="7.5,11 10.5,8.5 13,10.5 16.5,7" />
    </>
  ),
  book: (
    <>
      <path d="M12 6 C9 4.2 5.5 4.2 4 5 L4 18 C5.5 17.2 9 17.2 12 19 C15 17.2 18.5 17.2 20 18 L20 5 C18.5 4.2 15 4.2 12 6 Z" />
      <line x1="12" y1="6" x2="12" y2="19" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6" />
      <line x1="15.5" y1="15.5" x2="20" y2="20" />
    </>
  ),
  pen: (
    <>
      <path d="M5 19 L7 13 L15 5 L19 9 L11 17 Z" />
      <line x1="7" y1="13" x2="11" y2="17" />
    </>
  ),
  rocket: (
    <>
      <path d="M12 3 C15 6 16 10 15 14 L9 14 C8 10 9 6 12 3 Z" />
      <circle cx="12" cy="9" r="1.5" />
      <path d="M9 14 L6 18 M15 14 L18 18" />
      <polyline points="10.5,16.5 12,21 13.5,16.5" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12 C6.5 6.5 17.5 6.5 21.5 12 C17.5 17.5 6.5 17.5 2.5 12 Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  gem: (
    <>
      <path d="M6 4 L18 4 L22 9.5 L12 21 L2 9.5 Z" />
      <path d="M2 9.5 L22 9.5 M9 4 L7 9.5 L12 21 M15 4 L17 9.5 L12 21" />
    </>
  ),
  bolt: <polygon points="13,2 5,13 11,13 9,22 19,10 13,10" />,
};

export function CardIcon({ name, className }: { name?: string; className?: string }) {
  if (!name || !ICONS[name]) return null;
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {ICONS[name]}
    </svg>
  );
}
