import TagsPageClient from './TagsPageClient'

// Force dynamic rendering to avoid prerendering issues with ContentContainer
export const dynamic = 'force-dynamic'

export default function TagsPage() {
  return <TagsPageClient />
}
