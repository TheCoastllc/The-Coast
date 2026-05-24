import { DecorIcon } from "@/components/ui/decor-icon";

/**
 * SectionBoundary (W12 upgrade)
 *
 * Replaces the previous flat `bg-border` line with a gradient hairline
 * that fades into transparency at the page edges, plus a centered gold
 * dot. Reads as architectural rendering instead of a generic <hr>.
 *
 * Corner DecorIcons remain at the page rails for grid continuity.
 */
export function SectionBoundary() {
	return (
		<div className="relative z-10 px-4" aria-hidden="true">
			<div className="relative mx-auto max-w-6xl">
				{/* Full-bleed gradient hairline */}
				<div className="pointer-events-none absolute left-1/2 top-0 h-px w-screen -translate-x-1/2 divider-x" />

				{/* Centered gold dot — signature ornament */}
				<div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
					<span className="block size-1 rounded-full bg-[var(--gold)] opacity-70" />
				</div>

				{/* Rail markers */}
				<DecorIcon position="top-left" className="size-4" />
				<DecorIcon position="top-right" className="size-4" />
			</div>
		</div>
	);
}

export function BlueprintLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="relative overflow-x-clip surface-floor">
			{/* Persistent vertical guide lines — spans entire page */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 z-10 px-4"
			>
				<div className="relative mx-auto h-full max-w-6xl">
					<div className="absolute inset-y-0 -left-px w-px bg-[var(--hairline)]" />
					<div className="absolute inset-y-0 -right-px w-px bg-[var(--hairline)]" />
				</div>
			</div>

			<main>{children}</main>
		</div>
	);
}
