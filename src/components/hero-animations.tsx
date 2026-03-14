"use client";

import { motion, type Transition } from "motion/react";
import { useState, type ReactNode, createContext, useContext, useEffect } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;
const STAGGER = 0.12;

// Global flag to track if we've already done the intro animation in this session.
// This persists across SPA navigations.
let hasDoneIntro = false;

// ─── Context for Syncing with Preloader ───

const HeroUIContext = createContext<{
    isFirstLoad: boolean;
    isPreloaderActive: boolean;
}>({ isFirstLoad: true, isPreloaderActive: true });

export function HeroUIProvider({ children }: { children: ReactNode }) {
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // 1. Navigation Back: Visible immediately
        if (hasDoneIntro) {
            setIsFirstLoad(false);
            setIsReady(true);
            return;
        }

        // Helper to trigger the reveal after the 2.5s "after-preloader" delay
        const triggerReveal = () => {
            setTimeout(() => {
                setIsReady(true);
                hasDoneIntro = true;
            }, 50);
        };

        // 2. Already Done (e.g. mounting late)
        if (typeof window !== "undefined" && (window as any).__PRELOADER_DONE__) {
            triggerReveal();
            return;
        }

        // 3. Wait for Event
        const handlePreloaderDone = () => {
            triggerReveal();
        };

        window.addEventListener("preloader-done", handlePreloaderDone);

        // 4. Safety Timeout: Force content to show if preloader hangs
        // Total wait: ~1.5s for preloader + 2.5s delay = 4s
        const safetyTimeout = setTimeout(() => {
            if (!hasDoneIntro) {
                setIsReady(true);
                hasDoneIntro = true;
            }
        }, 4500);

        return () => {
            window.removeEventListener("preloader-done", handlePreloaderDone);
            clearTimeout(safetyTimeout);
        };
    }, []);

    return (
        <HeroUIContext.Provider value={{ isFirstLoad, isPreloaderActive: !isReady }}>
            {children}
        </HeroUIContext.Provider>
    );
}

function useHeroUI() {
    return useContext(HeroUIContext);
}

/* ─── Badge (slide-in from left) ─── */

const badgeVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (step: number) => ({
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.8,
            delay: STAGGER * step,
            ease: EASE as unknown as Transition["ease"],
        },
    }),
};

export function HeroAnimatedBadge({
    children,
    step = 0,
}: {
    children: ReactNode;
    step?: number;
}) {
    const { isFirstLoad, isPreloaderActive } = useHeroUI();
    return (
        <motion.a
            href="#link"
            variants={badgeVariants}
            custom={step}
            initial={isFirstLoad ? "hidden" : "visible"}
            animate={!isPreloaderActive ? "visible" : "hidden"}
            className="group mx-auto flex w-fit items-center gap-3 rounded-sm border bg-card p-1 shadow transition-all"
        >
            {children}
        </motion.a>
    );
}

/* ─── Word reveal (y: 100% → 0) ─── */

const wordVariants = {
    hidden: { y: "100%" },
    visible: (step: number) => ({
        y: 0,
        transition: {
            duration: 1.2,
            delay: STAGGER * step,
            ease: EASE as unknown as Transition["ease"],
        },
    }),
};

export function HeroAnimatedWord({
    children,
    step = 0,
}: {
    children: ReactNode;
    step?: number;
}) {
    const { isFirstLoad, isPreloaderActive } = useHeroUI();
    return (
        <span className="block overflow-hidden">
            <motion.span
                variants={wordVariants}
                custom={step}
                initial={isFirstLoad ? "hidden" : "visible"}
                animate={!isPreloaderActive ? "visible" : "hidden"}
                className="block origin-bottom-left"
            >
                {children}
            </motion.span>
        </span>
    );
}

/* ─── Fade-up (for subtitle and CTAs) ─── */

const fadeUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (step: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 1,
            delay: STAGGER * step,
            ease: EASE as unknown as Transition["ease"],
        },
    }),
};

export function HeroAnimatedFadeUp({
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
    const { isFirstLoad, isPreloaderActive } = useHeroUI();
    const Component = as === "p" ? motion.p : motion.div;
    return (
        <Component
            variants={fadeUpVariants}
            custom={step}
            initial={isFirstLoad ? "hidden" : "visible"}
            animate={!isPreloaderActive ? "visible" : "hidden"}
            className={className}
        >
            {children}
        </Component>
    );
}

/* ─── Video section wrapper (fade-up with ease) ─── */

const videoVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (step: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 1.2,
            delay: STAGGER * step,
            ease: EASE as unknown as Transition["ease"],
        },
    }),
};

export function HeroAnimatedVideo({
    children,
    step = 0,
}: {
    children: ReactNode;
    step?: number;
}) {
    const { isFirstLoad, isPreloaderActive } = useHeroUI();
    return (
        <motion.div
            variants={videoVariants}
            custom={step}
            initial={isFirstLoad ? "hidden" : "visible"}
            animate={!isPreloaderActive ? "visible" : "hidden"}
            className="relative"
        >
            {children}
        </motion.div>
    );
}
