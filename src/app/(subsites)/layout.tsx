import React from 'react'
import { Footer } from '@/components/footer'
import '../(frontend)/styles.css'
import Noise from '@/components/Noise'
import CustomCursor from '@/components/CustomCursor'

export default function SubsitesLayout(props: { children: React.ReactNode }) {
    const { children } = props
    return (
        <html lang="en">
            <body>
                <Noise />
                {children}
                <Footer variant="minimal" />
                <CustomCursor />
            </body>
        </html>
    )
}
