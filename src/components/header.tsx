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
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type NavChild = {
	label: string;
	description?: string;
	href: string;
	external?: boolean;
};

export type NavLink = {
	label: string;
	href: string;
	children?: NavChild[];
};

export const navLinks: NavLink[] = [
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
		children: [
			{
				label: "Brand Quiz",
				description: "10 questions. 60-second diagnosis.",
				href: "https://offers.coastglobal.org/brand-quiz",
				external: true,
			},
			{
				label: "Brand Consistency Checklist",
				description: "Score your brand across 5 pillars.",
				href: "https://offers.coastglobal.org/brand-checklist",
				external: true,
			},
			{
				label: "The 3-Second Test",
				description: "See what a new visitor judges first.",
				href: "https://offers.coastglobal.org/3-second-test",
				external: true,
			},
			{
				label: "See all offers",
				href: "/offers",
			},
		],
	},
	{
		label: "Contact",
		href: "/contact",
	},
];

function DesktopNavItem({ link }: { link: NavLink }) {
	const [open, setOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		if (!open) return;
		const onDocClick = (e: MouseEvent) => {
			if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
		};
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setOpen(false);
		};
		document.addEventListener("mousedown", onDocClick);
		document.addEventListener("keydown", onKey);
		return () => {
			document.removeEventListener("mousedown", onDocClick);
			document.removeEventListener("keydown", onKey);
		};
	}, [open]);

	const clearCloseTimer = () => {
		if (closeTimer.current) {
			clearTimeout(closeTimer.current);
			closeTimer.current = null;
		}
	};

	if (!link.children?.length) {
		return (
			<TransitionLink
				href={link.href}
				className={cn(
					"inline-flex shrink-0 items-center justify-center rounded-[min(var(--radius-md),12px)] h-7 gap-1 px-2.5 text-[0.8rem] font-medium whitespace-nowrap transition-all outline-none select-none",
					"hover:bg-muted hover:text-foreground dark:hover:bg-muted/50",
				)}
			>
				{link.label}
			</TransitionLink>
		);
	}

	return (
		<div
			ref={containerRef}
			className="relative"
			onMouseEnter={() => {
				clearCloseTimer();
				setOpen(true);
			}}
			onMouseLeave={() => {
				clearCloseTimer();
				closeTimer.current = setTimeout(() => setOpen(false), 120);
			}}
		>
			<button
				type="button"
				aria-haspopup="menu"
				aria-expanded={open}
				onClick={() => setOpen((v) => !v)}
				className={cn(
					"inline-flex shrink-0 items-center justify-center rounded-[min(var(--radius-md),12px)] h-7 gap-1 px-2.5 text-[0.8rem] font-medium whitespace-nowrap transition-all outline-none select-none cursor-pointer",
					"hover:bg-muted hover:text-foreground dark:hover:bg-muted/50",
					open && "bg-muted text-foreground dark:bg-muted/50",
				)}
			>
				{link.label}
				<ChevronDown
					className={cn(
						"size-3 transition-transform duration-200",
						open && "rotate-180",
					)}
				/>
			</button>
			<AnimatePresence>
				{open && (
					<motion.div
						role="menu"
						initial={{ opacity: 0, y: -6 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -6 }}
						transition={{ duration: 0.15, ease: "easeOut" }}
						onClickCapture={() => setOpen(false)}
						className="absolute left-1/2 top-full z-50 mt-2 w-72 -translate-x-1/2 rounded-md border border-border bg-background/95 p-1.5 shadow-lg backdrop-blur-sm supports-backdrop-filter:bg-background/80"
					>
						{link.children.map((child) => {
							const commonClass =
								"flex flex-col gap-0.5 rounded-sm px-3 py-2 text-sm hover:bg-muted dark:hover:bg-muted/50 transition-colors";
							const content = (
								<>
									<span className="font-medium text-foreground">{child.label}</span>
									{child.description && (
										<span className="text-xs text-muted-foreground">{child.description}</span>
									)}
								</>
							);
							return child.external ? (
								<a
									key={child.href}
									href={child.href}
									target="_blank"
									rel="noopener"
									className={commonClass}
								>
									{content}
								</a>
							) : (
								<TransitionLink key={child.href} href={child.href} className={commonClass}>
									{content}
								</TransitionLink>
							);
						})}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

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
								style={{ height: 'auto' }}
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
							<div className="flex items-center">
								{navLinks.map((link) => (
									<DesktopNavItem key={link.label} link={link} />
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
