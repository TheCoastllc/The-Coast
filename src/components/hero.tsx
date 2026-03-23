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
	HeroUIProvider,
} from "./hero-animations";
import { RetroGrid } from "./RetroGrid";
import { LazyHeroVideo } from "./LazyHeroVideo";

export function HeroSection() {
	return (
		<HeroUIProvider>
			<section>
				<div className="relative flex flex-col items-center justify-center gap-5 px-4 py-12 md:px-4 md:py-22 ">
					<RetroGrid />
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

					<div className="relative z-10 flex flex-col justify-center md:justify-start max-sm:min-h-[90dvh] md:h-fit xl:min-h-[75dvh] gap-3 w-full">
						{/* Badge */}
						<HeroAnimatedBadge step={0}>
							<LiveIndicator />
							<span className="text-xs pl-1">Full-Stack Creative Ecosystem</span>
							<span className="block h-5 border-l" />
							<div className="pr-1">
								<ArrowRightIcon className="size-3 -translate-x-0.5 duration-150 ease-out group-hover:translate-x-0.5" />
							</div>
						</HeroAnimatedBadge>

						{/* Headline - Giant Typography Style */}
						<h1 className=" flex flex-col hero-header tracking-tighter leading-none font-bold">
							<HeroAnimatedWord step={1}>DESIGN THE</HeroAnimatedWord>
							<HeroAnimatedWord step={2} className="md:flex md:gap-2">
								<HeroAnimatedWord step={3} className="flex-1 text-base text-muted-foreground font-normal hidden lg:inline-block  font-sans tracking-normal">
									<span className="mt-4 inline-block">At The Coast®, we’ve built an end-to-end ecosystem for the visionaries behind the brands. Whether we’re crafting your brand guidelines, managing your digital marketing, or producing cinematic digital experiences, we’re here to help you scale. <span className="text-white">We turn visions into empires.</span></span>
									<HeroAnimatedFadeUp
										step={5}
										className="flex w-fit items-center justify-center gap-3 pt-2"
									>
										<ShineButton size="sm" href="#contact">Book a Call</ShineButton>
										<ShineButton size="sm" variant="ghost" href="/get-started">Get started</ShineButton>
									</HeroAnimatedFadeUp>
								</HeroAnimatedWord>
								<span className="text-muted-foreground">FUTURE </span>
							</HeroAnimatedWord>
						</h1>

						<HeroAnimatedWord step={3} className="text-base text-muted-foreground font-normal leading-none lg:hidden max-w-lg font-sans tracking-normal">
							At The Coast®, we’ve built an end-to-end ecosystem for the visionaries behind the brands. Whether we’re crafting your brand guidelines, managing your digital marketing, or producing cinematic digital experiences, we’re here to help you scale. <span className="text-white">We turn visions into empires.</span>
							<HeroAnimatedFadeUp
								step={5}
								className="flex w-fit items-center justify-center gap-3 pt-2"
							>
								<ShineButton size="sm" variant="ghost" href="#contact">Book a Call</ShineButton>
								<ShineButton size="sm" href="/get-started">Get started</ShineButton>
							</HeroAnimatedFadeUp>
						</HeroAnimatedWord>
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
						<LazyHeroVideo className="pointer-events-none aspect-video w-full select-none object-cover" />
					</div>
					<FullWidthDivider className="-bottom-px" />
				</HeroAnimatedVideo>
			</section>
		</HeroUIProvider>
	);
}