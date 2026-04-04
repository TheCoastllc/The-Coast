"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import Link from "next/link";

const STAGGER = 0.15;

let hasDoneIntro = false;

// ─── Shared hook: hide on mount, animate on preloader-done ───

function useHeroReveal(
    ref: React.RefObject<HTMLElement | null>,
    from: gsap.TweenVars,
    to: gsap.TweenVars,
    step: number,
) {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        // Return visit — show immediately, no animation
        if (hasDoneIntro) {
            gsap.set(el, to);
            return;
        }

        // Hide immediately
        gsap.set(el, from);

        const reveal = () => {
            gsap.to(el, {
                ...to,
                duration: 1.4,
                delay: STAGGER * step,
                ease: "power3.out",
                onComplete: () => { hasDoneIntro = true; },
            });
        };

        // Already done (late mount)
        if ((window as any).__PRELOADER_DONE__) {
            reveal();
            return;
        }

        const handler = () => reveal();
        window.addEventListener("preloader-done", handler);

        // Safety timeout
        const timeout = setTimeout(() => {
            if (!hasDoneIntro) reveal();
        }, 5000);

        return () => {
            window.removeEventListener("preloader-done", handler);
            clearTimeout(timeout);
        };
    }, []);
}

// ─── Provider (just marks intro done, no state) ───

export function HeroUIProvider({ children }: { children: ReactNode }) {
    return <>{children}</>;
}

// ─── Badge (fade + slide from left) ───

export function HeroAnimatedBadge({
    children,
    step = 0,
}: {
    children: ReactNode;
    step?: number;
}) {
    const ref = useRef<HTMLDivElement>(null);
    useHeroReveal(
        ref,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0 },
        step,
    );

    return (
        <div ref={ref}>
            <Link href="/services"
                className="group flex w-fit items-center gap-3 rounded-sm border bg-card p-1 shadow transition-all"
            >
                {children}
            </Link>
        </div>
    );
}

// ─── Word mask reveal (yPercent 120 → 0 inside overflow-hidden) ───

export function HeroAnimatedWord({
    children,
    step = 0,
    className = "",
}: {
    children: ReactNode;
    step?: number;
    className?: string;
}) {
    const ref = useRef<HTMLSpanElement>(null);
    useHeroReveal(
        ref,
        { yPercent: 120 },
        { yPercent: 0 },
        step,
    );

    return (
        <span className="block overflow-hidden pb-[0.1em]">
            <span
                ref={ref}
                className={cn("block", className)}
                style={{ willChange: "transform" }}
            >
                {children}
            </span>
        </span>
    );
}

// ─── Fade-up (subtitle, CTAs) ───

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
    const ref = useRef<HTMLDivElement>(null);
    useHeroReveal(
        ref,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0 },
        step,
    );

    const Tag = as === "p" ? "p" : "div";
    return (
        <Tag ref={ref as any} className={className}>
            {children}
        </Tag>
    );
}

// ─── Video section (fade + rise) ───

export function HeroAnimatedVideo({
    children,
    step = 0,
}: {
    children: ReactNode;
    step?: number;
}) {
    const ref = useRef<HTMLDivElement>(null);
    useHeroReveal(
        ref,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0 },
        step,
    );

    return (
        <div ref={ref} className="relative">
            {children}
        </div>
    );
}
