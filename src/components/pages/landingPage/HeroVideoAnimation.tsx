'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger)
}

const HeroVideoAnimation = () => {
    useGSAP(() => {
        const mm = gsap.matchMedia();

        mm.add("(min-width: 768px)", () => {
            const container = document.getElementById('hero-container');
            const initialVideo = document.getElementById('hero-initial-video');
            const targetVideo = document.getElementById('hero-target-video');
            const videoWrapper = document.getElementById('hero-video-wrapper');

            if (!container || !initialVideo || !targetVideo || !videoWrapper) return;

            // Make wrapper initially visible
            gsap.set(videoWrapper, { autoAlpha: 1 });

            const createTimelines = () => {
                const sectionRect = container.getBoundingClientRect();

                // --- VIDEO COORDS ---
                const initialRect = initialVideo.getBoundingClientRect();
                const targetRect = targetVideo.getBoundingClientRect();

                const initTop = initialRect.top - sectionRect.top;
                const initLeft = initialRect.left - sectionRect.left;
                const initWidth = initialRect.width;
                const initHeight = initialRect.height;

                const targetTop = targetRect.top - sectionRect.top;
                const targetLeft = targetRect.left - sectionRect.left;
                const targetWidth = targetRect.width;
                const targetHeight = targetRect.height;

                // Enlarge step bounds: 80vw, 80vh, dead center
                const vw = window.innerWidth;
                const vh = window.innerHeight;
                const midWidth = vw * 0.8;
                const midHeight = vh * 0.8;
                const midTop = (vh - midHeight) / 2;
                const midLeft = (vw - midWidth) / 2;

                // Initial states (absolute to the section container)
                gsap.set(videoWrapper, {
                    position: 'absolute',
                    top: initTop,
                    left: initLeft,
                    width: initWidth,
                    height: initHeight,
                    borderRadius: '8px',
                    zIndex: 40,
                });

                // Timeline 1: Enlarge and center (PINNED)
                const pinTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: container,
                        start: "top top",
                        end: "+=150%", // User scrolls 1.5x screen height to enlarge
                        pin: true,
                        scrub: 1,
                        id: "pinTl" // Reference ID for connecting timelines
                    }
                });

                pinTl.to(videoWrapper, {
                    top: midTop,
                    left: midLeft,
                    width: midWidth,
                    height: midHeight,
                    borderRadius: '24px',
                    zIndex: 50,
                    duration: 1,
                    ease: "power1.inOut"
                }, 0);

                // Timeline 2: Shrink into place (UNPINNED - normal scrolling)
                const unpinTl = gsap.timeline({
                    scrollTrigger: {
                        // Start exactly when the pin ends
                        start: () => {
                            const pinST = ScrollTrigger.getById("pinTl");
                            return pinST ? pinST.end : 0;
                        },
                        end: () => `+=${Math.max(0, targetTop - (vh / 2) + (targetHeight / 2))}`,
                        scrub: 1,
                    }
                });

                unpinTl.to(videoWrapper, {
                    top: targetTop,
                    left: targetLeft,
                    width: targetWidth,
                    height: targetHeight,
                    borderRadius: '0px',
                    zIndex: 0,
                    duration: 1,
                    ease: "none" // Linear ensures it matches scrolling speed perfectly
                }, 0);

                return [pinTl, unpinTl];
            };

            let timelines = createTimelines();

            const handleResize = () => {
                timelines.forEach(tl => {
                    tl.scrollTrigger?.kill();
                    tl.kill();
                });
                gsap.set(videoWrapper, { clearProps: "all" });
                gsap.set(videoWrapper, { autoAlpha: 1 });
                timelines = createTimelines();
            }

            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);
                timelines.forEach(tl => {
                    tl.scrollTrigger?.kill();
                    tl.kill();
                });
                gsap.set(videoWrapper, { clearProps: "all" });
            };
        });
    }, []);

    return null;
}

export default HeroVideoAnimation
