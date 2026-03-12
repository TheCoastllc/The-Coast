import { cn } from "@/lib/utils";
import { DecorIcon } from "@/components/ui/decor-icon";
import { FullWidthDivider } from "@/components/ui/full-width-divider";

const clients = [
	"AMG Records",
	"Zapped Co",
	"OgaTicket",
	"Coast Global",
	"Brand Builders",
	"Empire Studios",
	"Vision Labs",
	"Nova Creative",
];

export function LogosSection() {
	return (
		<section className="mb-12">
			<h2 className="py-6 text-center font-medium text-lg text-muted-foreground tracking-tight md:text-xl">
				Trusted by <span className="text-foreground">industry leaders</span>
			</h2>
			<div className="relative">
				<DecorIcon className="size-4" position="top-left" />
				<DecorIcon className="size-4" position="top-right" />
				<DecorIcon className="size-4" position="bottom-left" />
				<DecorIcon className="size-4" position="bottom-right" />

				<FullWidthDivider className="-top-px" />
				<div className="grid grid-cols-2 border md:grid-cols-4">
					{clients.map((client, i) => (
						<div
							key={client}
							className={cn(
								"flex items-center justify-center bg-background px-4 py-8 md:p-8",
								i % 4 !== 3 && "md:border-r",
								i % 2 === 0 && "border-r md:border-r",
								i < clients.length - 2 && "border-b md:border-b",
								i < clients.length - 4 && "md:border-b",
								i >= clients.length - 4 && "md:border-b-0",
								(i === 0 || i === 2 || i === 5 || i === 7) && "bg-secondary dark:bg-secondary/30",
							)}
						>
							<span className="pointer-events-none select-none font-display text-sm md:text-base uppercase tracking-wider text-muted-foreground/60 hover:text-foreground transition-colors duration-300">
								{client}
							</span>
						</div>
					))}
				</div>
				<FullWidthDivider className="-bottom-px" />
			</div>
		</section>
	);
}
