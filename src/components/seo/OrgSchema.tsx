// Sitewide Organization/LocalBusiness JSON-LD - mounted once per root layout
// (same convention as the analytics components). Server component; inert JSON.
import { buildOrgGraph } from '@/lib/schema'

export function OrgSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(buildOrgGraph()) }}
    />
  )
}
