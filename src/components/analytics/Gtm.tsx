import Script from 'next/script'

/** Google Tag Manager container for the whole site (all three route groups). */
export const GTM_ID = 'GTM-5L5ZRV3K'

/**
 * GTM bootstrap. Loads AFTER the inline consent-mode defaults (all storage
 * denied) have been pushed to dataLayer, so every tag inside the container
 * respects the CookieBanner's Consent Mode v2 state - place this below the
 * ga-init <Script> in each root layout.
 */
export function GtmScript() {
  return (
    <Script id="gtm-init" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
    </Script>
  )
}

/** GTM no-JS fallback - first element inside <body>. */
export function GtmNoScript() {
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
      />
    </noscript>
  )
}
