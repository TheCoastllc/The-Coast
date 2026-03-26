"use client";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { useScroll } from "@/hooks/use-scroll";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/mobile-nav";
import Image from "next/image";
import Link from "next/link";
import { ShineButton } from "./ui/ShineButton";
import { DecorIcon } from "@/components/ui/decor-icon";
import { usePathname } from "next/navigation";
import { TransitionLink } from "@/components/PageTransition";

export const navLinks = [
	{
		label: "Services",
		href: "/services",
	},
	{
		label: "Work",
		href: "/work",
	},
	{
		label: "Blog",
		href: "/blog",
	},
	{
		label: "About",
		href: "/about",
	},
	{
		label: "Offers",
		href: "/offers",
	},
	{
		label: "Contact",
		href: "/#contact",
	},
];

export function Header() {
	const scrolled = useScroll(10);
	const pathname = usePathname()

	return (
		<header
			className={cn(
				"fixed inset-x-0 top-0 z-50 mx-auto w-full border-transparent border-b md:border md:transition-all md:ease-out",
				{
					"border-border max-w-3xl md:bg-background/95 md:backdrop-blur-sm md:supports-backdrop-filter:bg-background/50 md:top-2":
						scrolled,
				}
			)}
		>
			{/* Outer padding wrapper — matches BlueprintLayout's px-4 layer */}
			<div className="px-4">
				{/* Inner positioning container — lines sit at its edges */}
				<div
					className={cn(
						"relative mx-auto max-w-6xl",
						{
							"md:max-w-3xl md:rounded-md md:shadow": scrolled,
						}
					)}
				>
					<nav
						className={cn(
							"flex h-14 w-full items-center justify-between md:h-12 md:transition-all md:ease-out",
							{
								"md:px-2": scrolled,
							}
						)}
					>
						<TransitionLink
							href={pathname === '/' ? '#' : '/'}
							title="The Coast - Home"
							className="flex items-center rounded-md p-2 hover:bg-muted dark:hover:bg-muted/50 hover-target"
						>
							{/* Mobile Logo */}
							<Image
								src="/logo.png"
								alt="The Coast Logo"
								width={40}
								height={40}
								className="block md:hidden object-contain"
								priority
							/>

							{/* Desktop Logo */}
							<Image
								src="/full-logo.png"
								alt="The Coast Logo"
								width={70}
								height={40}
								className="hidden md:block object-contain"
								priority
							/>
						</TransitionLink>
						<div className="hidden items-center gap-2 md:flex mr-2">
							<div>
								{navLinks.map((link) => (
									<TransitionLink key={link.label} href={link.href} className={cn(
										"inline-flex shrink-0 items-center justify-center rounded-[min(var(--radius-md),12px)] h-7 gap-1 px-2.5 text-[0.8rem] font-medium whitespace-nowrap transition-all outline-none select-none",
										"hover:bg-muted hover:text-foreground dark:hover:bg-muted/50"
									)}>{link.label}</TransitionLink>
								))}
							</div>
							<ShineButton size='sm' href="/get-started" className="font-mono">
								Start Project
							</ShineButton>
						</div>
						<MobileNav />
					</nav>
					{/* Vertical border lines — always visible to enclose header */}
					<div aria-hidden="true" className="absolute inset-y-0 -left-px w-px bg-border" />
					<div aria-hidden="true" className="absolute inset-y-0 -right-px w-px bg-border" />
					{/* Bottom divider + DecorIcons — visible when header is flat */}
					{!scrolled && (
						<>
							<div aria-hidden="true" className="absolute bottom-0 inset-x-0 h-px bg-border" />
							<DecorIcon position="bottom-left" className="size-4" />
							<DecorIcon position="bottom-right" className="size-4" />
						</>
					)}
				</div>
			</div>
		</header>
	);
}
