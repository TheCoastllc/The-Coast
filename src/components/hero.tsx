import { cn } from "@/lib/utils";
import { DecorIcon } from "@/components/ui/decor-icon";
import { FullWidthDivider } from "@/components/ui/full-width-divider";
import { ArrowRightIcon } from "lucide-react";
import { ShineButton } from "./ui/ShineButton";
import { LiveIndicator } from "./LiveIndicator";
import {
	HeroAnimatedBadge,
	HeroAnimatedWord,
	HeroAnimatedFadeUp,
	HeroAnimatedVideo,
	HeroFaultyTerminal,
	HeroFuzzyWord,
	HeroUIProvider,
} from "./hero-animations";

export function HeroSection() {
	return (
		<HeroUIProvider>
			<section>
				<div className="relative flex flex-col items-center justify-center gap-5 px-4 py-12 md:px-4 md:py-20 ">
					<HeroFaultyTerminal
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

					<div className="relative z-100 flex flex-col items-center justify-center min-h-[90dvh] md:min-h-[75dvh] gap-5 w-full">
						{/* Badge */}
						<HeroAnimatedBadge step={0}>
							<LiveIndicator />
							<span className="text-xs pl-1">Brand Builders</span>
							<span className="block h-5 border-l" />
							<div className="pr-1">
								<ArrowRightIcon className="size-3 -translate-x-0.5 duration-150 ease-out group-hover:translate-x-0.5" />
							</div>
						</HeroAnimatedBadge>

						{/* Headline - Giant Typography Style */}
						<h1 className="relative z-10 text-center font-bold leading-[0.85] tracking-tighter uppercase 
    text-5xl sm:text-7xl md:text-8xl lg:text-[7rem]">

							<HeroAnimatedWord step={1}>Design</HeroAnimatedWord>
							<HeroAnimatedWord step={2}>The</HeroAnimatedWord>
							<HeroAnimatedWord step={3}>
								<HeroFuzzyWord
									baseIntensity={0.2}
									hoverIntensity={0.5}
									fontSize="clamp(3rem, 8vw, 7rem)"
									fontWeight={700}
									color="#c9a24b"
								>
									FUTURE.
								</HeroFuzzyWord>
							</HeroAnimatedWord>
						</h1>

						{/* Subtitle */}
						<HeroAnimatedFadeUp
							step={4}
							as="p"
							className="text-center text-muted-foreground text-sm tracking-wider sm:text-lg"
						>
							Strategic brand design for entrepreneurs, artists, and growing businesses. <br />
							We turn visions into empires, helping brands scale faster.
						</HeroAnimatedFadeUp>

						{/* CTA Buttons */}
						<HeroAnimatedFadeUp
							step={5}
							className="flex w-fit items-center justify-center gap-3 pt-2"
						>
							<ShineButton size="sm">Book a Call</ShineButton>
							<ShineButton size="sm">Get started</ShineButton>
						</HeroAnimatedFadeUp>
					</div>
				</div>

				{/* Video Section */}
				<HeroAnimatedVideo step={6}>
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
				</HeroAnimatedVideo>
			</section>
		</HeroUIProvider>
	);
}
