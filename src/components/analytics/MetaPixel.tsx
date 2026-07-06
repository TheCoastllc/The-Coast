import Script from 'next/script'

/** Meta (Facebook) Pixel for the whole site - all three route groups. */
export const META_PIXEL_ID = '1574056140777852'

/**
 * Meta Pixel bootstrap, consent-gated to match the cookie banner's promise
 * ("no cookies are set unless you accept"): fbq('consent','revoke') runs
 * BEFORE init, so the pixel queues events without dropping cookies until the
 * CookieBanner grants. A prior 'granted' choice is restored from the same
 * localStorage key the GA consent flow uses; the queued PageView then fires.
 *
 * lazyOnload keeps fbevents.js off the boot chain (same reasoning as GTM -
 * the eval cost isn't worth paying before idle; attribution params like fbclid
 * live in the URL and are read whenever the pixel fires).
 */
export function MetaPixelScript() {
  return (
    <Script id="meta-pixel" strategy="lazyOnload">
      {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('consent', 'revoke');
try {
  if (localStorage.getItem('coast-cookie-consent') === 'granted') {
    fbq('consent', 'grant');
  }
} catch (e) {}
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`}
    </Script>
  )
}

/** Meta Pixel no-JS fallback - first elements inside <body>, next to GTM's. */
export function MetaPixelNoScript() {
  return (
    <noscript>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        height="1"
        width="1"
        style={{ display: 'none' }}
        src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
        alt=""
      />
    </noscript>
  )
}
