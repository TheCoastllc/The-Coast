import { Accordion, AccordionButton, AccordionItem, AccordionPanel } from '@/components/animate-ui/components/headless/accordion'
import Container from '@/components/Container'
import { Button } from '@/components/ui/button'
import { BEST_AT, CLIENTS, THE_APPROACH } from '@/constants'
import React from 'react'

const FeaturesSection = () => {
    return (
        <section className=''>
            <Container>
                <div className='grid grid-cols-1 md:grid-cols-2 relative min-h-dvh'>
                    <div className='sticky flex-1 top-0 left-0 max-w-xs space-y-5'>
                        <h3 className='text-lg leading-none'>From early launches to complex products, every decision is intentional and built to support long-term impact.</h3>
                        <Button animate className='uppercase text-[10px] rounded-xs cursor-pointer'>Start a project</Button>
                    </div>
                    <div className=' flex-1 flex gap-10 flex-col'>
                        <div className='space-y-3'>
                            <h4 className='text-primary'>Best At</h4>
                            <ul>
                                {BEST_AT.map((q) => <li key={q}>{q}</li>)}
                            </ul>
                        </div>
                        <div className='space-y-3'>
                            <h4 className='text-primary'>Clients</h4>
                            <ul>
                                {CLIENTS.map((q) => <li key={q}>{q}</li>)}
                            </ul>
                        </div>
                        <div>
                            <h4 className='text-primary'>The Apporach</h4>
                            <Accordion className='max-w-lg'>
                                {THE_APPROACH.map((q, i) => (
                                    <AccordionItem key={i} defaultOpen={i === 0}>
                                        <AccordionButton>{q.question}</AccordionButton>
                                        <AccordionPanel>
                                            <p>{q.answer}</p>
                                        </AccordionPanel>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    )
}

export default FeaturesSection