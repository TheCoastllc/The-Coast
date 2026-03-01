import React from 'react'
import { ProgressiveBlur } from './ui/progressive-blur'

const BlurLayer = () => {
  return (
    <div className='fixed h-dvh w-full z-500000000 pointer-events-none'>
        <ProgressiveBlur className='absolute bottom-0 left-0 w-full h-50'/>
    </div>
  )
}

export default BlurLayer