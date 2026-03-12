"use client";

import { cn } from "@/lib/utils";
import { DecorIcon } from "@/components/ui/decor-icon";
import { FullWidthDivider } from "@/components/ui/full-width-divider";
import { ArrowRightIcon } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { ShineButton } from "./ui/ShineButton";
import { HyperspaceBackground } from "./ui/hyperspace-background";
import { LiveIndicator } from "./LiveIndicator";
import FaultyTerminal from "./FaultyTerminal";
import FuzzyText from "./FuzzyText";

const EASE = [0.16, 1, 0.3, 1] as const;
const PRELOADER_DELAY = 2.5;
const STAGGER = 0.15;

// Persists across client-side navigations, resets on full page reload
let hasLoadedOnce = false;

export function HeroSection() {
	const [isFirstLoad] = useState(() => {
		// Server: always render intro state so SSR HTML matches first client render
		if (typeof window === "undefined") return true;
		// Client: true only on first ever page load
		if (hasLoadedOnce) return false;
		hasLoadedOnce = true;
		return true;
	});

	const d = (step: number) =>
		isFirstLoad ? PRELOADER_DELAY + STAGGER * step : 0;

	return (
		<section>
			<div className="relative flex flex-col items-center justify-center gap-5 px-4 py-12 md:px-4 md:py-20 ">
				{/* <HyperspaceBackground /> */}
				<FaultyTerminal
					scale={1.5}
					gridMul={[2, 1]}
					digitSize={1.2}
					timeScale={0.5}
					pause={false}
					scanlineIntensity={0.5}
					glitchAmount={1}
					flickerAmount={1}
					noiseAmp={1}
					chromaticAberration={0}
					dither={0}
					curvature={0.1}
					tint="#e09410"
					mouseReact
					mouseStrength={0.5}
					pageLoadAnimation
					brightness={0.6}
				/>

				{/* Decorative Background Elements */}
				<div aria-hidden="true" className="absolute inset-0 -z-1 size-full overflow-hidden">
					<div className={cn(
						"absolute -inset-x-20 inset-y-0 z-0 rounded-full",
						"bg-[radial-gradient(ellipse_at_center,theme(--color-foreground/.1),transparent,transparent)]",
						"blur-[50px]"
					)} />
					<div className="absolute inset-y-0 left-4 w-px bg-linear-to-b from-transparent via-border to-border md:left-8" />
					<div className="absolute inset-y-0 right-4 w-px bg-linear-to-b from-transparent via-border to-border md:right-8" />
				</div>

				<div className="relative z-100 flex flex-col items-center justify-center min-h-[75dvh] gap-5 w-full">
					{/* Badge */}
					<motion.a
						href="#link"
						initial={isFirstLoad ? { opacity: 0, x: -20 } : false}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8, delay: d(0) }}
						className="group mx-auto flex w-fit items-center gap-3 rounded-sm border bg-card p-1 shadow transition-all"
					>
						<LiveIndicator />
						<span className="text-xs pl-1">Brand Builders</span>
						<span className="block h-5 border-l" />
						<div className="pr-1">
							<ArrowRightIcon className="size-3 -translate-x-0.5 duration-150 ease-out group-hover:translate-x-0.5" />
						</div>
					</motion.a>

					{/* Headline - Giant Typography Style */}
					<h1 className="relative z-10 text-center font-bold leading-[0.85] tracking-tighter uppercase 
    text-5xl sm:text-7xl md:text-8xl lg:text-[7rem]">

						{["Design", "The", "Future."].map((word, i) => (
							<span key={word} className="block overflow-hidden">
								<motion.span
									initial={isFirstLoad ? { y: "100%" } : false}
									animate={{ y: 0 }}
									transition={{ duration: 1.2, delay: d(i + 1), ease: EASE }}
									className={cn(
										"block origin-bottom-left",
										// Use opacity-80 or similar if you want a ghost look, 
										// but keeping it transparent + stroke for the "outline" style
									)}
								>
									{word === "Future." ? (
										<FuzzyText
											baseIntensity={0.2}
											hoverIntensity={0.5}
											enableHover
											fontSize="clamp(3rem, 8vw, 7rem)"
											fontWeight={700}
											color="#c9a24b"
										>
											FUTURE.
										</FuzzyText>
									) : word}
								</motion.span>
							</span>
						))}
					</h1>

					{/* Subtitle */}
					<motion.p
						initial={isFirstLoad ? { opacity: 0, y: 20 } : false}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 1, delay: d(4) }}
						className="text-center text-muted-foreground text-sm tracking-wider sm:text-lg"
					>
						Strategic brand design for entrepreneurs, artists, and growing businesses. <br />
						We turn visions into empires, helping brands scale faster.
					</motion.p>

					{/* CTA Buttons */}
					<motion.div
						initial={isFirstLoad ? { opacity: 0, y: 20 } : false}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 1, delay: d(5) }}
						className="flex w-fit items-center justify-center gap-3 pt-2"
					>
						<ShineButton size="sm">Book a Call</ShineButton>
						<ShineButton size="sm">Get started</ShineButton>
					</motion.div>
				</div>
			</div>

			{/* Video Section */}
			<motion.div
				initial={isFirstLoad ? { opacity: 0, y: 30 } : false}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 1.2, delay: d(6), ease: EASE }}
				className="relative"
			>
				<DecorIcon className="size-4" position="top-left" />
				<DecorIcon className="size-4" position="top-right" />
				<DecorIcon className="size-4" position="bottom-left" />
				<DecorIcon className="size-4" position="bottom-right" />

				<FullWidthDivider className="-top-px" />
				<div className="overflow-hidden">
					<video
						autoPlay
						muted
						loop
						playsInline
						className="pointer-events-none aspect-video w-full select-none object-cover"
					>
						<source src="/coastVid.mp4" type="video/mp4" />
					</video>
				</div>
				<FullWidthDivider className="-bottom-px" />
			</motion.div>
		</section>
	);
}

