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
		href: "/#about",
	},
	{
		label: "Contact",
		href: "/#contact",
	},
];

export function Header() {
	const scrolled = useScroll(10);

	return (
		<header
			className={cn(
				"sticky top-0 z-50 mx-auto w-full max-w-6xl border-transparent border-b md:rounded-md md:border md:transition-all md:ease-out",
				{
					"border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/50 md:top-2 md:max-w-3xl md:shadow":
						scrolled,
				}
			)}
		>
			<nav
				className={cn(
					"flex h-14 w-full items-center justify-between px-4 md:h-12 md:transition-all md:ease-out",
					{
						"md:px-2": scrolled,
					}
				)}
			>
				<Link
					href="/"
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
				</Link>
				<div className="hidden items-center gap-2 md:flex">
					<div>
						{navLinks.map((link) => (
							<Button key={link.label} size="sm" variant="ghost" render={<Link href={link.href} />} nativeButton={false}>{link.label}</Button>
						))}
					</div>
					<ShineButton size='sm'>
						<Link href="/get-started" className=" font-mono ">
							Start Project
						</Link>
					</ShineButton>
				</div>
				<MobileNav />
			</nav>
			{/* Bottom divider line — visible when header is flat */}
			{!scrolled && (
				<>
					<div aria-hidden="true" className="absolute inset-y-0 -left-px w-px bg-border" />
					<div aria-hidden="true" className="absolute inset-y-0 -right-px w-px bg-border" />
					<div aria-hidden="true" className="absolute bottom-0 left-1/2 h-px w-screen -translate-x-1/2 bg-border" />
					<DecorIcon position="bottom-left" className="size-4" />
					<DecorIcon position="bottom-right" className="size-4" />
				</>
			)}
		</header>
	);
}
