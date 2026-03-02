
import Container from '@/components/Container'
import { TextAnimate } from '@/components/ui/text-animate'
import HeroVideoAnimation from './HeroVideoAnimation'
import { Button } from '@/components/ui/button'
import { PiAsterisk } from "react-icons/pi";
import HeroMobileVideo from './HeroMobileVideo'
import { Marquee } from '@/components/ui/marquee';
import Image from 'next/image';


const Hero = () => {
    return (
        <section id="hero-container" className='relative pt-20 h-full min-h-dvh overflow-hidden space-y-10 z-50'>
            <HeroVideoAnimation />
            <div id="hero-video-wrapper" className="absolute right-0 z-0 opacity-0 pointer-events-none flex items-center justify-center rounded-3xl overflow-hidden">
                <video className='w-full h-full object-cover' autoPlay loop muted playsInline>
                    <source src="/coastVid.webm" type="video/webm" />
                </video>
            </div>

            <div id="hero-text-wrapper" className="absolute z-0 opacity-0 pointer-events-none flex items-center justify-center text-center">
                <p>Business Strategy • Brand Positioning • Category Definition • Brand Design • Brand Transformation</p>
            </div>

            <Container>
                <div className="relative z-10">
                    <h1 className='text-balance leading-none uppercase'>
                        <div className='flex items-center gap-2'>
                            <TextAnimate once delay={4}>
                                <PiAsterisk className='animate-spin hero-large-text  text-primary' />
                            </TextAnimate>
                            <TextAnimate once delay={4} className=' hero-large-text font-light'>
                                We Turn
                            </TextAnimate>
                        </div>

                        <div className='flex items-center'>
                            <TextAnimate once delay={4} className='max-w-2xs hidden md:block text-justify'>
                                The Coast® is a strategic branding agency
                                helping the world&apos;s most innovative companies
                                advance into their next era.
                            </TextAnimate>
                            <TextAnimate once delay={4} className='hero-large-text font-light'>
                                Visions Into
                            </TextAnimate>
                        </div>
                        <div className='flex items-center gap-4'>
                            <TextAnimate once delay={4} className='empire'>
                                Empires
                            </TextAnimate>
                            <span id="hero-initial-video" className="hidden md:inline-flex w-[240px] h-[120px] rounded-xl overflow-hidden translate-y-3"></span>
                        </div>
                    </h1>
                    <TextAnimate once delay={4}>
                        <div className='flex gap-2 items-center mt-2'>
                            <Button animate className='uppercase text-[10px] rounded-xs cursor-pointer'>Start a project</Button>
                            <Button variant={'outline'} className='uppercase text-[10px] rounded-xs cursor-pointer '>Testimonials</Button>
                        </div>
                    </TextAnimate>

                    <Marquee className='md:hidden my-5'>
                        {
                            [1, 2, 3, 4, 5].map((q, i) => (
                                <Image key={i} src={`/carousel${q}.png`} alt={`carousel${q}`} width={50} height={50} className="object-contain grayscale" />
                            ))
                        }
                    </Marquee>
                    <Marquee className='hidden md:flex mt-10 absolute w-full'>
                        {
                            [1, 2, 3, 4, 5].map((q, i) => (
                                <Image key={i} src={`/carousel${q}.png`} alt={`carousel${q}`} width={60} height={60} className="object-contain grayscale" />
                            ))
                        }
                    </Marquee>
                    <div className='flex flex-col items-center md:items-end justify-center my-5 md:-mt-15'>
                        <TextAnimate>

                            <HeroMobileVideo />
                        </TextAnimate>

                        <div id="hero-initial-text" className='max-w-xs text-center mt-4 md:hidden'>
                            <p className="opacity-100">Business Strategy • Brand Positioning • Category Definition • Brand Design • Brand Transformation</p>
                        </div>

                    </div>



                    <h2 className='brand pt-20 md:pb-40 leading-none uppercase text-balance'>
                        Branding <span id="hero-target-video" className=' w-[250px] hidden text-sm md:inline-flex items-center justify-center h-[100px] mr-4'>{/* Video target */}</span>
                        that makes you unforgettable.
                    </h2>
                    <TextAnimate className='max-w-2xs text-lg leading-none pt-5 pb-10 block md:hidden text-justify'>
                        The Coast® is a strategic branding agency
                        helping the world&apos;s most innovative companies
                        advance into their next era.
                    </TextAnimate>
                </div>
            </Container>
        </section>
    )
}

export default Hero