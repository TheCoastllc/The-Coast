import React from 'react'
import Noise from './Noise'

const NoiseLayer = () => {
  return (
    <div className='fixed h-dvh w-full inset-0 z-1000000 pointer-events-none'>
  <Noise
    patternSize={250}
    patternScaleX={2}
    patternScaleY={2}
    patternRefreshInterval={2}
    patternAlpha={15}
  />
</div>
  )
}

export default NoiseLayer