import { ImageResponse } from 'next/og'

/**
 * OG card for /ai - hero headline on Deep Ocean (#243A44) per the funnel brief.
 * Next auto-wires this file as og:image + twitter:image for the route.
 */

export const alt = 'Put AI to work in your business. The Coast - AI Consulting & Implementation'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#f7f4ec',
          color: '#131a23',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 26,
            letterSpacing: 10,
            color: '#177f73',
            textTransform: 'uppercase',
            marginBottom: 36,
          }}
        >
          {'AI Consulting & Implementation'}
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontSize: 84,
            fontWeight: 800,
            lineHeight: 1.12,
            textAlign: 'center',
            letterSpacing: -2,
          }}
        >
          <div>{'Put AI to work'}</div>
          <div style={{ display: 'flex' }}>
            <span>{'in your '}</span>
            <span style={{ color: '#8f6a1d' }}>{'business.'}</span>
          </div>
        </div>
        <div
          style={{
            marginTop: 52,
            fontSize: 24,
            color: '#4e5a66',
            letterSpacing: 6,
            textTransform: 'uppercase',
          }}
        >
          {'The Coast • coastglobal.org/ai'}
        </div>
      </div>
    ),
    { ...size },
  )
}
