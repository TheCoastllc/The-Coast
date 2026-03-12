"use client";

import dynamic from "next/dynamic";
import { motion, type Transition } from "motion/react";
import { useState, type ReactNode, createContext, useContext, useEffect, memo } from "react";
import type { FaultyTerminalProps } from "./FaultyTerminal";

// ─── Heavy WebGL/canvas components — loaded on demand, no SSR output ───

const FaultyTerminal = dynamic(() => import("./FaultyTerminal"), {
    ssr: false,
});
const FuzzyText = dynamic(() => import("./FuzzyText"), { ssr: false });

// ─── Constants & Performance Hoisting ───

const EASE = [0.16, 1, 0.3, 1] as const;
const PRELOADER_DELAY = 2.5;
const STAGGER = 0.15;

// Persists across client-side navigations, resets on full page reload
let hasLoadedOnce = false;

// ─── Context for Hydration Parity ───

const HeroUIContext = createContext<{ isFirstLoad: boolean }>({ isFirstLoad: true });

export function HeroUIProvider({ children }: { children: ReactNode }) {
    const [isFirstLoad, setIsFirstLoad] = useState(true);

    useEffect(() => {
        // On the client, after mount, determine if this is a "first load"
        // or if the user navigated here internally.
        if (hasLoadedOnce) {
            setIsFirstLoad(false);
        } else {
            hasLoadedOnce = true;
            // Stay true for the first ever load to show animations
        }
    }, []);

    return (
        <HeroUIContext.Provider value={{ isFirstLoad }}>
            {children}
        </HeroUIContext.Provider>
    );
}

function useHeroUI() {
    return useContext(HeroUIContext);
}

function getDelay(isFirstLoad: boolean, step: number) {
    return isFirstLoad ? PRELOADER_DELAY + STAGGER * step : 0;
}

/* ─── Badge (slide-in from left) ─── */

export const HeroAnimatedBadge = memo(function HeroAnimatedBadge({
    children,
    step = 0,
}: {
    children: ReactNode;
    step?: number;
}) {
    const { isFirstLoad } = useHeroUI();
    return (
        <motion.a
            href="#link"
            initial={isFirstLoad ? { opacity: 0, x: -20 } : false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: getDelay(isFirstLoad, step) }}
            className="group mx-auto flex w-fit items-center gap-3 rounded-sm border bg-card p-1 shadow transition-all"
        >
            {children}
        </motion.a>
    );
});

/* ─── Word reveal (y: 100% → 0) ─── */

export const HeroAnimatedWord = memo(function HeroAnimatedWord({
    children,
    step = 0,
}: {
    children: ReactNode;
    step?: number;
}) {
    const { isFirstLoad } = useHeroUI();
    return (
        <span className="block overflow-hidden">
            <motion.span
                initial={isFirstLoad ? { y: "100%" } : false}
                animate={{ y: 0 }}
                transition={{
                    duration: 1.2,
                    delay: getDelay(isFirstLoad, step),
                    ease: EASE as unknown as Transition["ease"],
                }}
                className="block origin-bottom-left"
            >
                {children}
            </motion.span>
        </span>
    );
});

/* ─── Fade-up (for subtitle and CTAs) ─── */

export const HeroAnimatedFadeUp = memo(function HeroAnimatedFadeUp({
    children,
    step = 0,
    className = "",
    as = "div",
}: {
    children: ReactNode;
    step?: number;
    className?: string;
    as?: "div" | "p";
}) {
    const { isFirstLoad } = useHeroUI();
    const Component = as === "p" ? motion.p : motion.div;
    return (
        <Component
            initial={isFirstLoad ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: getDelay(isFirstLoad, step) }}
            className={className}
        >
            {children}
        </Component>
    );
});

/* ─── Video section wrapper (fade-up with ease) ─── */

export const HeroAnimatedVideo = memo(function HeroAnimatedVideo({
    children,
    step = 0,
}: {
    children: ReactNode;
    step?: number;
}) {
    const { isFirstLoad } = useHeroUI();
    return (
        <motion.div
            initial={isFirstLoad ? { opacity: 0, y: 30 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 1.2,
                delay: getDelay(isFirstLoad, step),
                ease: EASE as unknown as Transition["ease"],
            }}
            className="relative"
        >
            {children}
        </motion.div>
    );
});

/* ─── FaultyTerminal passthrough (dynamically imported, ssr: false) ─── */

export function HeroFaultyTerminal(props: FaultyTerminalProps) {
    return <FaultyTerminal {...props} />;
}

/* ─── FuzzyText word (dynamically imported, ssr: false) ─── */

export function HeroFuzzyWord({
    children,
    fontSize,
    fontWeight,
    color,
    baseIntensity = 0.2,
    hoverIntensity = 0.5,
}: {
    children: string;
    fontSize?: string;
    fontWeight?: number;
    color?: string;
    baseIntensity?: number;
    hoverIntensity?: number;
}) {
    return (
        <FuzzyText
            baseIntensity={baseIntensity}
            hoverIntensity={hoverIntensity}
            enableHover
            fontSize={fontSize}
            fontWeight={fontWeight}
            color={color}
        >
            {children}
        </FuzzyText>
    );
}
