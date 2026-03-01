import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'
import { fileURLToPath } from 'url'

import config from '@/payload.config'
import './styles.css'
import Header from '@/components/Header'
import Hero from '@/components/pages/landingPage/Hero'
import SmoothScrolling from '@/components/SmoothScrolling'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`

  return (
    <SmoothScrolling>
      <div className='flex flex-col gap-2 min-h-dvh'>
        <Header />
        <main className='flex-1'>
          <Hero />
        </main>
        <footer>Footer</footer>
      </div>
    </SmoothScrolling>
  )
}
