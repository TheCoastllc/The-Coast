import Container from '@/components/Container'
import { TextAnimate } from '@/components/ui/text-animate'
import { LucideAsterisk } from 'lucide-react'
import React from 'react'

const Hero = () => {
    return (
        <section className='relative pt-20 h-dvh'>
            <Container>
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
                <div className='flex justify-end absolute bottom-0 right-5'>
                    <div className='overflow-hidden  rounded-lg'>
                        <video className=' h-[200px] p-0' autoPlay loop muted>
                            <source src="coastVid.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
            </Container>
        </section>
    )
}

export default Hero