'use client'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

interface Props {
    sectionRef: React.RefObject<HTMLDivElement | null>
    cardsRef: React.MutableRefObject<HTMLDivElement[]>
}

const WorksAnimation = ({ sectionRef, cardsRef }: Props) => {
    useGSAP(() => {

        // Header animation
        const header = sectionRef.current?.querySelector('.works-header')

        if (header) {
            gsap.from(header, {
                y: 100,
                opacity: 0,
                duration: 1.2,
                ease: 'power4.out',
                scrollTrigger: {
                    trigger: header,
                    start: 'top 95%',
                }
            })
        }

        // Cards animation
        cardsRef.current.forEach((card, i) => {
            const imgWrap = card.querySelector('[data-img-wrap]')
            const img = card.querySelector('img')
            const info = card.querySelector('[data-info-wrap]')

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse',
                }
            })

            const delay = i % 2 !== 0 ? 0.2 : 0

            tl.from(imgWrap, {
                clipPath: 'inset(100% 0% 0% 0%)',
                duration: 1.5,
                ease: 'expo.inOut'
            }, delay)

            tl.from(img, {
                scale: 1.5,
                yPercent: 20,
                duration: 2,
                ease: 'power3.out'
            }, delay)

            tl.from(info, {
                opacity: 0,
                y: 40,
                duration: 1,
                ease: 'power2.out'
            }, delay + 0.5)
        })

    }, { dependencies: [] })

    return null
}

export default WorksAnimation