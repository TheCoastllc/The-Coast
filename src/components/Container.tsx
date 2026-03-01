import React from 'react'

const Container = ({children}: {children: React.ReactNode}) => {
  return (
    <div className='container mx-auto max-sm:px-3'>{children}</div>
  )
}

export default Container