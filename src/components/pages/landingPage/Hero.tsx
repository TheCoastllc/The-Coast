/* eslint-disable react/no-unescaped-entities */
import Container from '@/components/Container'
import { TextAnimate } from '@/components/ui/text-animate'
import { LucideAsterisk } from 'lucide-react'
import React from 'react'
import HeroVideoAnimation from './HeroVideoAnimation'

const Hero = () => {
    return (
        <section id="hero-container" className='relative pt-20 h-full min-h-dvh overflow-hidden'>
            <HeroVideoAnimation />

            <div id="hero-video-wrapper" className="absolute z-0 opacity-0 pointer-events-none flex items-center justify-center">
                <video className='w-full h-full object-cover' autoPlay loop muted playsInline>
                    <source src="coastVid.mp4" type="video/mp4" />
                </video>
            </div>

            <div id="hero-text-wrapper" className="absolute z-0 opacity-0 pointer-events-none flex items-center justify-center text-center">
                <p>Business Strategy • Brand Positioning • Category Definition • Brand Design • Brand Transformation</p>
            </div>

            <Container>
                <div className="relative z-10">
                    <h1 className='leading-none uppercase'>
                        <div className='flex items-center'>
                            <LucideAsterisk size={100} className='animate-spin text-primary' />
                            <TextAnimate className='text-[8rem] font-light'>
                                We Turn
                            </TextAnimate>
                        </div>

                        <div className='flex items-center'>
                            <TextAnimate className='max-w-2xs text-justify'>
                                The Coast® is a strategic branding agency
                                helping the world's most innovative companies
                                advance into their next era.
                            </TextAnimate>
                            <TextAnimate animation='blurIn' className='text-[8rem] font-light'>
                                Visions Into
                            </TextAnimate>
                        </div>
                        <TextAnimate className='text-[12rem] font-bold' delay={1}>
                            Empires
                        </TextAnimate>
                    </h1>
                    <div className='flex flex-col items-end justify-center xl:-mt-15'>
                        <div id="hero-initial-video" className='overflow-hidden rounded-lg'>
                            <video className='h-[200px] p-0 opacity-0' playsInline>
                                <source src="coastVid.mp4" type="video/mp4" />
                            </video>
                        </div>
                        <div id="hero-initial-text" className='max-w-xs text-center mt-4'>
                            <p className="opacity-0">Business Strategy • Brand Positioning • Category Definition • Brand Design • Brand Transformation</p>
                        </div>
                    </div>

                    <h2 className='text-[5rem] pt-20 pb-40 leading-none uppercase'>
                        Branding <span id="hero-target-video" className='w-[250px] text-sm inline-flex items-center justify-center h-[100px] mr-4'>{/* Video target */}</span>
                        that makes you unforgettable.
                    </h2>
                </div>
            </Container>
        </section>
    )
}

export default Hero