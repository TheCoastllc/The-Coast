import type {
  DefaultNodeTypes,
  SerializedAutoLinkNode,
  SerializedLinkNode,
} from '@payloadcms/richtext-lexical'
import type { JSXConverters, JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
import { TransitionLink } from '@/components/PageTransition'

type PostDoc = { slug?: string }
type PageDoc = { slug?: string }

function resolveInternalHref(linkNode: SerializedLinkNode): string {
  const doc = linkNode.fields.doc
  if (!doc || typeof doc !== 'object') return '#'
  const relationTo = doc.relationTo
  const value = doc.value

  // value can be a string ID or a populated document
  const slug = typeof value === 'object' && value !== null ? (value as PostDoc | PageDoc).slug : undefined
  if (!slug) return '#'

  switch (relationTo) {
    case 'posts':
      return `/blog/${slug}`
    case 'pages':
      return slug === 'home' ? '/' : `/${slug}`
    default:
      return '#'
  }
}

function isInternalUrl(url: string) {
  if (!url) return false
  if (url.startsWith('/')) return true
  try {
    const u = new URL(url)
    return u.hostname === 'coastglobal.org' || u.hostname.endsWith('.coastglobal.org')
  } catch {
    return false
  }
}

const linkConverters: JSXConverters<SerializedAutoLinkNode | SerializedLinkNode> = {
  autolink: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children })
    const url = node.fields.url ?? ''
    const newTab = Boolean(node.fields.newTab)

    if (!newTab && isInternalUrl(url)) {
      return <TransitionLink href={url}>{children}</TransitionLink>
    }

    return (
      <a
        href={url}
        {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    )
  },
  link: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children })
    const newTab = Boolean(node.fields.newTab)
    let href = node.fields.url ?? ''

    if (node.fields.linkType === 'internal') {
      href = resolveInternalHref(node)
    }

    if (!newTab && isInternalUrl(href)) {
      return <TransitionLink href={href}>{children}</TransitionLink>
    }

    return (
      <a
        href={href}
        {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    )
  },
}

export const jsxConverters: JSXConvertersFunction<DefaultNodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...linkConverters,
})
