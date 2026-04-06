'use client'

import { useRowLabel } from '@payloadcms/ui'

export const FAQRowLabel = () => {
  const { data, rowNumber } = useRowLabel<{ question?: string }>()
  return <span>{data?.question || `Question ${String(rowNumber).padStart(2, '0')}`}</span>
}
