import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter, FaPinterestP } from "react-icons/fa6";
import Image from "next/image";
import { DecorIcon } from "@/components/ui/decor-icon";
import { TransitionLink } from "@/components/PageTransition";

const MAIN_SITE = "https://coastglobal.org"

function FooterLink({ href, className, children, isMinimal }: { href: string; className?: string; children: React.ReactNode; isMinimal?: boolean }) {
	if (isMinimal) {
		return <a href={`${MAIN_SITE}${href}`} className={className}>{children}</a>
	}
	return <TransitionLink href={href} className={className}>{children}</TransitionLink>
}

export function Footer({ variant = "default" }: { variant?: "default" | "minimal" }) {
	const isMinimal = variant === "minimal"

	return (
		<footer className={cn("relative w-full px-4", isMinimal && "bg-[#0D1117]")}>
			<div
				className={cn(
					"relative mx-auto",
					!isMinimal && "max-w-6xl",
					!isMinimal && "dark:bg-[radial-gradient(35%_80%_at_15%_0%,--theme(--color-foreground/.1),transparent)]"
				)}
			>
				{!isMinimal && (
					<>
						{/* Blueprint vertical lines */}
						<div aria-hidden="true" className="absolute inset-y-0 -left-px w-px bg-border" />
						<div aria-hidden="true" className="absolute inset-y-0 -right-px w-px bg-border" />

						{/* Top horizontal divider + DecorIcons */}
						<div aria-hidden="true" className="absolute top-0 left-1/2 h-px w-screen -translate-x-1/2 bg-border" />
						<DecorIcon position="top-left" className="size-4" />
						<DecorIcon position="top-right" className="size-4" />
					</>
				)}

				{isMinimal && (
					<div aria-hidden="true" className="absolute top-0 left-1/2 h-px w-screen -translate-x-1/2 bg-border" />
				)}

				<div className={cn("grid grid-cols-6 gap-6 p-4", !isMinimal && "max-w-5xl")}>
					<div className="col-span-6 flex flex-col gap-4 pt-5 md:col-span-4">
						<FooterLink
							href="/"
							isMinimal={isMinimal}
							className="flex items-center rounded-md p-2 hover:bg-muted dark:hover:bg-muted/50 hover-target"
						>
							<Image
								src="/logo.png"
								alt="The Coast Logo"
								width={40}
								height={40}
								style={{ height: 'auto' }}
								className="object-contain"
								loading="lazy"
							/>
						</FooterLink>
						<p className="max-w-sm text-balance text-muted-foreground text-sm">
							Strategic brand design for entrepreneurs, artists, and growing businesses.
						</p>
						<div className="flex gap-2">
							{socialLinks.map((item, index) => (
								<Button key={`social-${item.link}-${index}`} size="icon-sm" variant="outline" render={<a href={item.link} target="_blank" />} nativeButton={false} aria-label={item.name}>{item.icon}</Button>
							))}
						</div>
					</div>
					<div className="col-span-3 w-full md:col-span-1">
						<span className="text-muted-foreground text-xs">Resources</span>
						<div className="mt-2 flex flex-col gap-2">
							{resources.map(({ href, title }) => (
								<FooterLink
									className="w-max text-sm hover:underline"
									href={href}
									isMinimal={isMinimal}
									key={title}
								>
									{title}
								</FooterLink>
							))}
						</div>
					</div>
					<div className="col-span-3 w-full md:col-span-1">
						<span className="text-muted-foreground text-xs">Company</span>
						<div className="mt-2 flex flex-col gap-2">
							{company.map(({ href, title }) => (
								<FooterLink
									className="w-max text-sm hover:underline"
									href={href}
									isMinimal={isMinimal}
									key={title}
								>
									{title}
								</FooterLink>
							))}
						</div>
					</div>
				</div>

				{!isMinimal && (
					<>
						{/* Bottom horizontal divider + DecorIcons */}
						<div aria-hidden="true" className="absolute bottom-0 left-1/2 h-px w-screen -translate-x-1/2 bg-border" />
						<DecorIcon position="bottom-left" className="size-4" />
						<DecorIcon position="bottom-right" className="size-4" />
					</>
				)}

				{isMinimal && (
					<div aria-hidden="true" className="absolute bottom-0 left-1/2 h-px w-screen -translate-x-1/2 bg-border" />
				)}

				<div className={cn("flex px-4 flex-col items-center justify-between gap-2 py-4 sm:flex-row", !isMinimal && "max-w-6xl")}>
					<p className="font-light text-muted-foreground text-sm">
						&copy; {new Date().getFullYear()} The Coast LLC, All rights reserved
					</p>
					<div className="flex gap-4">
						<FooterLink href="/privacy" isMinimal={isMinimal} className="text-xs text-muted-foreground hover:underline">Privacy Policy</FooterLink>
						<FooterLink href="/terms" isMinimal={isMinimal} className="text-xs text-muted-foreground hover:underline">Terms of Service</FooterLink>
					</div>
				</div>
			</div>
		</footer>
	);
}

const company = [
	{
		title: "About",
		href: "/about",
	},
	{
		title: "Services",
		href: "/services",
	},
	{
		title: "Work",
		href: "/work",
	},
	{
		title: "Pricing",
		href: "/pricing",
	},
	{
		title: "Vision",
		href: "/vision",
	},
];

const resources = [
	{
		title: "Blog",
		href: "/blog",
	},
	{
		title: "Our Work",
		href: "/work",
	},
	{
		title: "Free Brand Tools",
		href: "/offers",
	},
	{
		title: "FAQ",
		href: "/#faq",
	},
	{
		title: "Contact",
		href: "/#contact",
	},
	{
		title: "Get Started",
		href: "/get-started",
	},
];

const socialLinks = [
	{
		name: "Facebook",
		icon: <FaFacebookF />,
		link: "https://www.facebook.com/coastglobal",
	},
	{
		name: "Instagram",
		icon: <FaInstagram />,
		link: "https://www.instagram.com/coastglobal",
	},
	{
		name: "LinkedIn",
		icon: <FaLinkedinIn />,
		link: "https://www.linkedin.com/company/thecoastcompanylimited/",
	},
	{
		name: "X (formerly Twitter)",
		icon: <FaXTwitter />,
		link: "https://x.com/TheCoastHQ",
	},
	{
		name: "Pinterest",
		icon: <FaPinterestP />,
		link: "https://pin.it/nW5MRvKEz",
	},
];
