import { DecorIcon } from "@/components/ui/decor-icon";
import { FullWidthDivider } from "@/components/ui/full-width-divider";

export function SectionBoundary() {
	return (
		<div className="relative z-10 px-4" aria-hidden="true">
			<div className="relative mx-auto max-w-6xl">
				<FullWidthDivider />
				<DecorIcon position="top-left" className="size-4" />
				<DecorIcon position="top-right" className="size-4" />
			</div>
		</div>
	);
}

export function BlueprintLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="relative">
			{/* Persistent vertical guide lines — spans entire page */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 z-10 px-4"
			>
				<div className="relative mx-auto h-full max-w-6xl">
					<div className="absolute inset-y-0 -left-px w-px bg-border" />
					<div className="absolute inset-y-0 -right-px w-px bg-border" />
				</div>
			</div>

			<main>{children}</main>
		</div>
	);
}
