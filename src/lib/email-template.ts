/**
 * Reusable HTML email template for The Coast brand.
 * Based on the dark intake template with gold accents, Georgia serif body,
 * logo header, gold divider, brand signature, services bar, and social footer.
 */

const BRAND = {
  logoUrl: 'https://beefree-storage.onesignal.com/thumbnails/ba73b3e1-9acf-484b-9457-8b81d9ed04ff/lllllAsset%2015.png_thumb.png?hash=1773663275005',
  footerImgUrl: 'https://beefree-storage.onesignal.com/thumbnails/ba73b3e1-9acf-484b-9457-8b81d9ed04ff/lllllArtboard%2043-100.jpg_thumb.png?hash=1773657383202',
  name: 'The Coast',
  url: 'https://coastglobal.org',
  email: 'hello@coastglobal.org',
  phone: '(682) 702-0374',
  gold: '#C9A24B',
  dark: '#0a0a0a',
  card: '#111111',
  ctaUrl: 'https://coastglobal.org/get-started',
  socials: {
    instagram: 'https://www.instagram.com/coastglobal',
    linkedin: 'https://www.linkedin.com/company/thecoastcompanylimited',
    twitter: 'https://twitter.com/TCoast13363',
  },
}

/** Wraps body content in the full branded email shell (table-based, dark theme). */
export function emailShell(opts: { title?: string; body: string }) {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>${opts.title ?? 'The Coast'}</title>
    <!--[if mso]>
    <style>
        table {border-collapse:collapse;}
        td {font-family: Arial, sans-serif;}
    </style>
    <![endif]-->
    <style>
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        body { margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: ${BRAND.dark}; }
        a { color: ${BRAND.gold}; text-decoration: none; }
        @media screen and (max-width: 600px) {
            .email-container { width: 100% !important; }
            .section-pad { padding: 30px 24px !important; }
            .body-text { font-size: 16px !important; line-height: 27px !important; }
        }
    </style>
</head>
<body style="margin:0; padding:0; background-color:${BRAND.dark};">

    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:${BRAND.dark};">
    <tr>
    <td align="center" style="padding: 20px 10px;">

    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="email-container" style="background-color:${BRAND.card};">

        <!-- LOGO -->
        <tr>
            <td align="center" style="padding: 28px 40px 22px; background-color:${BRAND.card};">
                <img src="${BRAND.logoUrl}" alt="${BRAND.name}" width="140" style="display:block; width:140px; max-width:140px;" />
            </td>
        </tr>

        <!-- GOLD LINE -->
        <tr>
            <td align="center" style="padding: 0 40px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr><td style="border-top: 2px solid ${BRAND.gold}; font-size:0; line-height:0;">&nbsp;</td></tr>
                </table>
            </td>
        </tr>

        <!-- BODY -->
        <tr>
            <td style="background-color:${BRAND.card}; padding: 40px 50px;" class="section-pad">
                ${opts.body}
            </td>
        </tr>

        <!-- BRAND SIGNATURE -->
        <tr>
            <td style="background-color:${BRAND.card}; padding: 0 50px 35px;" class="section-pad">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                        <td style="border-top:1px solid #2a2a2a; padding-top:22px;">
                            <p style="margin:0 0 3px; font-family: Georgia, 'Times New Roman', serif; font-size:16px; color:#ffffff; font-weight:700;">${BRAND.name}</p>
                            <p style="margin:0 0 3px; font-family: Arial, Helvetica, sans-serif; font-size:13px; color:#888888;">Creative Branding &amp; Digital Marketing</p>
                            <p style="margin:0 0 3px; font-family: Arial, Helvetica, sans-serif; font-size:13px; color:${BRAND.gold};">${BRAND.email}</p>
                            <p style="margin:0; font-family: Arial, Helvetica, sans-serif; font-size:13px; color:#888888;">${BRAND.phone}</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>

        <!-- SERVICES BAR -->
        <tr>
            <td style="background-color:${BRAND.dark}; padding:18px 40px; text-align:center;">
                <p style="margin:0; font-family: Arial, Helvetica, sans-serif; font-size:11px; color:#666666; letter-spacing:0.5px;">
                    Logos &bull; Brand Identity &bull; Web Design &bull; Social Media &bull; SEO &bull; Lead Gen &bull; Video &bull; Merch
                </p>
            </td>
        </tr>

        <!-- FOOTER -->
        <tr>
            <td style="background-color:${BRAND.dark}; padding: 20px 40px 30px; text-align:center; border-top:1px solid #1a1a1a;">
                <img src="${BRAND.footerImgUrl}" alt="${BRAND.name}" width="120" style="display:block; margin:0 auto 12px; width:120px; max-width:120px; border-radius:4px;" />
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin-bottom:14px;">
                    <tr>
                        <td align="center" style="background-color:${BRAND.gold}; border-radius:50%; width:32px; height:32px; vertical-align:middle;">
                            <a href="${BRAND.socials.instagram}" style="display:block; width:32px; height:32px; line-height:32px; font-family:Arial,sans-serif; font-size:14px; color:${BRAND.dark}; text-decoration:none; text-align:center;">&#9679;</a>
                        </td>
                        <td style="width:8px;">&nbsp;</td>
                        <td align="center" style="background-color:${BRAND.gold}; border-radius:50%; width:32px; height:32px; vertical-align:middle;">
                            <a href="${BRAND.socials.linkedin}" style="display:block; width:32px; height:32px; line-height:32px; font-family:Arial,sans-serif; font-size:14px; color:${BRAND.dark}; text-decoration:none; text-align:center;">in</a>
                        </td>
                        <td style="width:8px;">&nbsp;</td>
                        <td align="center" style="background-color:${BRAND.gold}; border-radius:50%; width:32px; height:32px; vertical-align:middle;">
                            <a href="${BRAND.socials.twitter}" style="display:block; width:32px; height:32px; line-height:32px; font-family:Arial,sans-serif; font-size:14px; color:${BRAND.dark}; text-decoration:none; text-align:center;">X</a>
                        </td>
                    </tr>
                </table>
                <p style="margin:0 0 8px; font-family: Arial, Helvetica, sans-serif; font-size:11px; color:#555555;">
                    The Coast LLC &bull; Dallas-Fort Worth, TX
                </p>
                <p style="margin:0; font-family: Arial, Helvetica, sans-serif; font-size:11px;">
                    <a href="${BRAND.url}" style="color:${BRAND.gold}; text-decoration:none;">coastglobal.org</a>
                </p>
            </td>
        </tr>

    </table>
    </td>
    </tr>
    </table>
</body>
</html>`
}

// ─── Body content helpers (use Georgia serif to match template) ───

const bodyFont = "font-family: Georgia, 'Times New Roman', serif;"
const sansFont = "font-family: Arial, Helvetica, sans-serif;"

/** Body paragraph in Georgia serif. */
export function paragraph(text: string) {
  return `<p class="body-text" style="margin:0 0 18px; ${bodyFont} font-size:17px; line-height:29px; color:#e8e4dc;">${text}</p>`
}

/** Bold-highlighted text span. */
export function highlight(text: string, color: string = BRAND.gold) {
  return `<strong style="color:${color};">${text}</strong>`
}

/** Centered CTA button. */
export function ctaButton(text: string, href: string = BRAND.ctaUrl) {
  return `
<table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:28px 0;">
    <tr>
        <td style="border-radius: 4px; background-color: ${BRAND.gold};">
            <a href="${href}" target="_blank" style="display:inline-block; padding:16px 40px; ${sansFont} font-size:13px; font-weight:700; color:${BRAND.dark}; text-decoration:none; text-transform:uppercase; letter-spacing:2px; border-radius:4px;">
                ${text}
            </a>
        </td>
    </tr>
</table>`
}

/** Large centered score display with colored badge. */
export function scoreBlock(opts: { score: number; total: number; color: string; badge: string }) {
  return `
<div style="text-align:center; padding:24px 0 28px;">
  <span style="font-size:48px; font-weight:700; color:${opts.color}; ${sansFont}">${opts.score}</span>
  <span style="font-size:24px; font-weight:300; color:#555555; ${sansFont}"> / ${opts.total}</span>
  <div style="margin-top:12px;">
    <span style="display:inline-block; background:${opts.color}20; color:${opts.color}; font-size:10px; letter-spacing:2px; text-transform:uppercase; padding:4px 12px; border-radius:2px; ${sansFont}">${opts.badge}</span>
  </div>
</div>`
}

/** Section heading (white, centered). */
export function heading(text: string) {
  return `<p style="margin:0 0 18px; ${bodyFont} font-size:22px; line-height:32px; color:#ffffff; font-weight:700; text-align:center;">${text}</p>`
}

/** Info box with a title and bulleted items. */
export function infoBox(opts: { title: string; items: string[]; color?: string }) {
  const dotColor = opts.color ?? BRAND.gold
  return `
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#1a1a1a; border-radius:4px; margin:20px 0;">
  <tr><td style="padding:24px;">
    <p style="margin:0 0 14px; ${sansFont} font-size:12px; font-weight:700; color:#ffffff; text-transform:uppercase; letter-spacing:1px;">${opts.title}</p>
    ${opts.items.map((item) => `<p style="margin:0 0 6px; ${sansFont} font-size:13px; line-height:22px; color:#aaaaaa; padding-left:14px; position:relative;"><span style="position:absolute;left:0;top:8px;width:6px;height:6px;border-radius:50%;background:${dotColor};display:inline-block;"></span>${item}</p>`).join('')}
  </td></tr>
</table>`
}

/** Ordered list. */
export function orderedList(items: string[]) {
  return items.map((item, i) => `<p style="margin:0 0 6px; ${sansFont} font-size:13px; line-height:22px; color:#aaaaaa;">${i + 1}. ${item}</p>`).join('')
}

/** Horizontal gold divider. */
export function divider() {
  return `
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin:24px 0;">
    <tr><td style="border-top: 1px solid #2a2a2a; font-size:0; line-height:0;">&nbsp;</td></tr>
</table>`
}
