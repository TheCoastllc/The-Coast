import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Coast Brand Index',
  robots: { index: false, follow: false },
}

const CbiPage = () => {
    return (
        <main className='flex min-h-screen justify-center items-center flex-col'>
            <h1 className='text-3xl font-black text-muted-foreground'>COAST BRAND INDEX</h1>
            <p>Coming soon</p>
        </main>
    )
}

export default CbiPage