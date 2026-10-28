// /guide/:id — one guide in full, with like/save, and edit/delete for its author.
import { Link, useParams } from 'react-router-dom'
import { ArrowLeftIcon } from '@phosphor-icons/react'
import { useSession } from '../features/auth/hooks'
import { useGuide } from '../features/guides/hooks'
import { GuideDetails } from '../features/guides/components/GuideDetails'

export function GuidePage() {
  const { id } = useParams()
  const { session } = useSession()
  const guide = useGuide(id)

  if (guide.isLoading) return <p className="text-stone-500">Loading guide…</p>
  if (guide.error) return <p className="text-red-600">Could not load guide: {guide.error.message}</p>

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Link to="/guide" className="inline-flex items-center gap-1.5 text-sm font-medium text-forest-700 hover:text-forest-800">
        <ArrowLeftIcon size={16} aria-hidden="true" />
        Guides
      </Link>
      {guide.data ? (
        <GuideDetails guide={guide.data} currentUserId={session?.user.id} />
      ) : (
        <p className="text-stone-600">This guide doesn't exist or was deleted.</p>
      )}
    </div>
  )
}
