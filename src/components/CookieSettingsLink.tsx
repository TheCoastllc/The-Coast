'use client'

type WindowWithSettings = Window & { openCookieSettings?: () => void }

export function CookieSettingsLink({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => (window as WindowWithSettings).openCookieSettings?.()}
      className={className}
    >
      Cookie Settings
    </button>
  )
}
