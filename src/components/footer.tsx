import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter, FaPinterestP } from "react-icons/fa6";
import Image from "next/image";
import { DecorIcon } from "@/components/ui/decor-icon";
import { TransitionLink } from "@/components/PageTransition";

export function Footer() {
	return (
		<footer className="relative w-full px-4">
			<div
				className={cn(
					"relative mx-auto max-w-6xl",
					"dark:bg-[radial-gradient(35%_80%_at_15%_0%,--theme(--color-foreground/.1),transparent)]"
				)}
			>
				{/* Blueprint vertical lines */}
				<div aria-hidden="true" className="absolute inset-y-0 -left-px w-px bg-border" />
				<div aria-hidden="true" className="absolute inset-y-0 -right-px w-px bg-border" />

				{/* Top horizontal divider + DecorIcons */}
				<div aria-hidden="true" className="absolute top-0 left-1/2 h-px w-screen -translate-x-1/2 bg-border" />
				<DecorIcon position="top-left" className="size-4" />
				<DecorIcon position="top-right" className="size-4" />

				<div className="grid max-w-5xl grid-cols-6 gap-6 p-4">
					<div className="col-span-6 flex flex-col gap-4 pt-5 md:col-span-4">
						<TransitionLink
							href="/"
							title="The Coast - Home"
							className="flex items-center rounded-md p-2 hover:bg-muted dark:hover:bg-muted/50 hover-target"
						>
							<Image
								src="/logo.png"
								alt="The Coast Logo"
								width={40}
								height={40}
								className="object-contain"
								priority
							/>
						</TransitionLink>
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
								<TransitionLink
									className="w-max text-sm hover:underline"
									href={href}
									key={title}
								>
									{title}
								</TransitionLink>
							))}
						</div>
					</div>
					<div className="col-span-3 w-full md:col-span-1">
						<span className="text-muted-foreground text-xs">Company</span>
						<div className="mt-2 flex flex-col gap-2">
							{company.map(({ href, title }) => (
								<TransitionLink
									className="w-max text-sm hover:underline"
									href={href}
									key={title}
								>
									{title}
								</TransitionLink>
							))}
						</div>
					</div>
				</div>

				{/* Bottom horizontal divider + DecorIcons */}
				<div aria-hidden="true" className="absolute bottom-0 left-1/2 h-px w-screen -translate-x-1/2 bg-border" />
				<DecorIcon position="bottom-left" className="size-4" />
				<DecorIcon position="bottom-right" className="size-4" />

				<div className="flex max-w-6xl px-4 flex-col items-center justify-between gap-2 py-4 sm:flex-row">
					<p className="font-light text-muted-foreground text-sm">
						&copy; {new Date().getFullYear()} The Coast LLC, All rights reserved
					</p>
					<div className="flex gap-4">
						<TransitionLink href="/privacy" className="text-xs text-muted-foreground hover:underline">Privacy Policy</TransitionLink>
						<TransitionLink href="/terms" className="text-xs text-muted-foreground hover:underline">Terms of Service</TransitionLink>
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
		title: "Portfolio",
		href: "/portfolio",
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
