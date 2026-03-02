'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { WORKS } from '@/constants'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

const WorksAnimation = () => {
    useGSAP(() => {
        const mm = gsap.matchMedia()

        mm.add('(min-width: 768px)', () => {
            const trigger = document.getElementById('works-trigger')
            const imgWrappers = gsap.utils.toArray<HTMLElement>('.works-img-wrapper')

            if (!trigger || imgWrappers.length === 0) return

            // Initial state: hide all images except the first one using clipPath
            gsap.set(imgWrappers.slice(1), { clipPath: 'inset(100% 0 0 0)' })

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: true,
                    pin: '.right-col-container',
                    pinSpacing: true,
                },
            })

            WORKS.forEach((_, i) => {
                if (i < WORKS.length - 1) {
                    tl.to(imgWrappers[i + 1], {
                        clipPath: 'inset(0% 0 0 0)',
                        ease: 'none',
                    })
                }
            })

            return () => {
                tl.kill()
            }
        })
    }, [])

    return null
}

export default WorksAnimation
