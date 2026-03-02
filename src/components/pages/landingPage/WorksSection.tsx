import Image from 'next/image'
import Container from '@/components/Container'
import DotGrid from '@/components/DotGrid'
import { Button } from '@/components/ui/button'
import { WORKS } from '@/constants'
import WorksAnimation from './WorksAnimation'

const WorksSection = () => {
    return (
        <section className="relative w-full">
            <WorksAnimation />
            <Container>
                {/* Main Animation Wrapper */}
                <div id="works-trigger" className="flex flex-col md:flex-row justify-between gap-[60px] max-w-[1100px] mx-auto relative">

                    {/* Left Column: Text Cards */}
                    <div className="relative flex flex-col min-w-[300px] flex-1">
                        <div className="relative z-10">
                            <p className="text-lg pt-20 leading-none max-w-sm mb-5">
                                Our Selected Works – High-Impact Projects & Performance-Driven Results
                            </p>
                            <Button animate className='uppercase mb-10 text-[10px] rounded-xs cursor-pointer'>See all project</Button>

                            {WORKS.map((work) => (
                                <div
                                    key={work.title}
                                    className="works-info-card min-h-screen md:h-screen flex flex-col justify-center py-20 md:py-0"
                                >
                                    {/* Mobile Only Image View */}
                                    <div className="md:hidden w-full mb-6">
                                        <div className="relative h-[200px] sm:h-[280px] w-full rounded-[10px] overflow-hidden">
                                            <Image src={work.image} alt={work.title} fill className="object-cover" />
                                        </div>
                                    </div>

                                    {/* Text Content + Grid Background Wrapper */}
                                    <div className="max-w-[400px] min-h-[300px] md:min-h-[400px] relative flex flex-col justify-center p-8 md:p-0">

                                        {/* The DotGrid acting as Background */}
                                        <div className="absolute inset-0 h-full w-full -z-10 dark:opacity-20 opacity-50 pointer-events-none overflow-hidden rounded-2xl border border-white/5">
                                            <DotGrid
                                                dotSize={2}
                                                gap={6}
                                                baseColor={work.accentColor}
                                                activeColor={work.accentColor}
                                                proximity={120}
                                                returnDuration={1.5}
                                            />
                                        </div>

                                        {/* Foreground Text */}
                                        <div className="relative z-20 space-y-4">
                                            <h2 className="text-xl font-bold tracking-tight leading-tight">
                                                {work.title}
                                            </h2>
                                            <p className="text-muted-foreground leading-none max-w-[320px]">
                                                {work.description}
                                            </p>
                                            <Button
                                                style={{
                                                    backgroundColor: work.accentColor,
                                                    color: '#000'
                                                }}
                                                className="uppercase text-[11px] rounded-xs cursor-pointer"
                                            >
                                                Visit Site
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Pinned Images (Desktop Only) */}
                    <div className="right-col-container hidden md:flex flex-col h-screen w-full max-w-[540px] justify-center items-center">
                        <div className="relative h-[400px] w-full">
                            {WORKS.map((work, i) => (
                                <div
                                    key={work.title}
                                    className="works-img-wrapper absolute inset-0 rounded-2xl overflow-hidden"
                                    style={{ zIndex: i }}
                                >
                                    <Image
                                        src={work.image}
                                        alt={work.title}
                                        fill
                                        className="object-cover"
                                        sizes="540px"
                                        priority={i === 0}
                                    />
                                    {/* Subtle overlay to help blend with the UI */}
                                    <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent pointer-events-none" />
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </Container>
        </section>
    )
}

export default WorksSection