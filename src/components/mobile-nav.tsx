"use client";

import React, { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { navLinks } from "@/components/header";
import { XIcon, MenuIcon, ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePageTransition } from "@/components/PageTransition";

export function MobileNav() {
	const [open, setOpen] = useState(false);
	const [mounted, setMounted] = useState(false);
	const [expanded, setExpanded] = useState<string | null>(null);
	const pathname = usePathname();

	const { navigateTo } = usePageTransition();
	const close = useCallback(() => {
		setOpen(false);
		setExpanded(null);
	}, []);

	useEffect(() => {
		setMounted(true);
	}, []);

	// Close on route change
	useEffect(() => {
		close();
	}, [pathname, close]);

	// Lock body scroll and make background inert when open
	useEffect(() => {
		if (open) {
			document.body.style.overflow = "hidden";
			// Make everything outside the header and menu inert for accessibility and isolation
			const header = document.querySelector('header');
			if (header && header.parentElement) {
				Array.from(header.parentElement.children).forEach((child: Element) => {
					if (
						child !== header &&
						child.tagName !== 'SCRIPT' &&
						child.tagName !== 'STYLE' &&
						child.tagName !== 'NOSCRIPT' &&
						child.id !== 'mobile-menu-portal'
					) {
						child.setAttribute('inert', 'true');
						child.classList.add('mobile-menu-inert');
					}
				});
			}
		} else {
			document.body.style.overflow = "";
			document.querySelectorAll('.mobile-menu-inert').forEach((child: Element) => {
				child.removeAttribute('inert');
				child.classList.remove('mobile-menu-inert');
			});
		}

		return () => {
			document.body.style.overflow = "";
			document.querySelectorAll('.mobile-menu-inert').forEach((child: Element) => {
				child.removeAttribute('inert');
				child.classList.remove('mobile-menu-inert');
			});
		};
	}, [open]);

	return (
		<div className="md:hidden mr-2">
			<button
				aria-controls="mobile-menu"
				aria-expanded={open}
				aria-label="Toggle menu"
				onClick={() => setOpen(!open)}
				className="relative z-50 flex items-center justify-center size-11 rounded-md border border-border text-foreground hover:bg-muted/50 transition-colors"
			>
				<AnimatePresence mode="wait" initial={false}>
					{open ? (
						<motion.span
							key="close"
							initial={{ rotate: -90, opacity: 0 }}
							animate={{ rotate: 0, opacity: 1 }}
							exit={{ rotate: 90, opacity: 0 }}
							transition={{ duration: 0.15 }}
						>
							<XIcon className="size-4.5" />
						</motion.span>
					) : (
						<motion.span
							key="menu"
							initial={{ rotate: 90, opacity: 0 }}
							animate={{ rotate: 0, opacity: 1 }}
							exit={{ rotate: -90, opacity: 0 }}
							transition={{ duration: 0.15 }}
						>
							<MenuIcon className="size-4.5" />
						</motion.span>
					)}
				</AnimatePresence>
			</button>

			{mounted && typeof document !== 'undefined' && createPortal(
				<AnimatePresence>
					{open && (
						<motion.div
							id="mobile-menu-portal"
							role="dialog"
							aria-modal="true"
							className="fixed inset-0 z-[60] flex flex-col bg-background"
							initial={{ clipPath: "circle(0% at calc(100% - 2.5rem) 1.75rem)" }}
							animate={{ clipPath: "circle(150% at calc(100% - 2.5rem) 1.75rem)" }}
							exit={{ clipPath: "circle(0% at calc(100% - 2.5rem) 1.75rem)" }}
							transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
						>
							{/* Content area */}
							<div className="flex flex-col justify-between h-full pt-24 pb-12 px-8">
								{/* Nav links */}
								<nav className="flex flex-col gap-1">
									{navLinks.map((link, index) => {
										const hasChildren = !!link.children?.length;
										const isExpanded = expanded === link.label;
										return (
											<motion.div
												key={link.label}
												initial={{ opacity: 0, x: -20 }}
												animate={{ opacity: 1, x: 0 }}
												exit={{ opacity: 0, x: -20 }}
												transition={{
													duration: 0.3,
													delay: open ? 0.15 + index * 0.06 : (navLinks.length - index) * 0.03,
													ease: "easeOut",
												}}
												className="border-b border-border/50"
											>
												{hasChildren ? (
													<button
														type="button"
														onClick={() => setExpanded(isExpanded ? null : link.label)}
														aria-expanded={isExpanded}
														className="group flex w-full items-center justify-between py-4 text-foreground hover:text-primary transition-colors duration-200"
													>
														<div className="flex items-center gap-4">
															<span className="text-mono text-muted-foreground/40 text-xs tabular-nums">
																{String(index + 1).padStart(2, "0")}
															</span>
															<span className="text-heading text-2xl">{link.label}</span>
														</div>
														<ChevronDown
															className={`size-5 text-muted-foreground/40 transition-transform duration-200 ${
																isExpanded ? "rotate-180 text-primary" : ""
															}`}
														/>
													</button>
												) : (
													<Link
														href={link.href}
														onClick={(e) => {
															const href = link.href;
															if (!href.startsWith('http') && !href.startsWith('#') && !href.startsWith('/#')) {
																e.preventDefault();
																close();
																setTimeout(() => navigateTo(href), 100);
															} else {
																close();
															}
														}}
														className="group flex items-center justify-between py-4 text-foreground hover:text-primary transition-colors duration-200"
													>
														<div className="flex items-center gap-4">
															<span className="text-mono text-muted-foreground/40 text-xs tabular-nums">
																{String(index + 1).padStart(2, "0")}
															</span>
															<span className="text-heading text-2xl">{link.label}</span>
														</div>
														<ArrowRight className="size-5 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
													</Link>
												)}

												<AnimatePresence initial={false}>
													{hasChildren && isExpanded && (
														<motion.div
															key="submenu"
															initial={{ height: 0, opacity: 0 }}
															animate={{ height: "auto", opacity: 1 }}
															exit={{ height: 0, opacity: 0 }}
															transition={{ duration: 0.25, ease: "easeOut" }}
															className="overflow-hidden"
														>
															<div className="flex flex-col pb-3 pl-10">
																{link.children!.map((child) => {
																	const isExternal =
																		child.external || child.href.startsWith("http");
																	return isExternal ? (
																		<a
																			key={child.href}
																			href={child.href}
																			target="_blank"
																			rel="noopener"
																			onClick={close}
																			className="group flex items-center justify-between py-3 text-foreground/80 hover:text-primary transition-colors"
																		>
																			<span className="text-base">{child.label}</span>
																			<ArrowRight className="size-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
																		</a>
																	) : (
																		<Link
																			key={child.href}
																			href={child.href}
																			onClick={(e) => {
																				e.preventDefault();
																				close();
																				setTimeout(() => navigateTo(child.href), 100);
																			}}
																			className="group flex items-center justify-between py-3 text-foreground/80 hover:text-primary transition-colors"
																		>
																			<span className="text-base">{child.label}</span>
																			<ArrowRight className="size-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
																		</Link>
																	);
																})}
															</div>
														</motion.div>
													)}
												</AnimatePresence>
											</motion.div>
										);
									})}
								</nav>

								{/* Bottom CTA */}
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: 20 }}
									transition={{
										duration: 0.3,
										delay: 0.15 + navLinks.length * 0.06 + 0.05,
										ease: "easeOut",
									}}
									className="flex flex-col gap-4"
								>
									<Link
										href="/get-started"
										onClick={(e) => {
											e.preventDefault();
											close();
											setTimeout(() => navigateTo('/get-started'), 100);
										}}
										className="flex items-center justify-center gap-2 w-full py-4 bg-primary text-primary-foreground text-mono text-sm rounded-full hover:bg-primary/90 transition-colors"
									>
										Start a Project
										<ArrowRight className="size-4" />
									</Link>
									<p className="text-center text-muted-foreground/40 text-xs">
										© {new Date().getFullYear()} The Coast
									</p>
								</motion.div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>,
				document.body
			)}
		</div>
	);
}
