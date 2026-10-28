// /guide/:id/edit — the author edits their own guide with the same form, filled in.
// Others get a message instead of the form (and RLS would reject their save anyway).
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeftIcon } from '@phosphor-icons/react'
import { useSession } from '../features/auth/hooks'
import { useGuide } from '../features/guides/hooks'
import { GuideForm } from '../features/guides/components/GuideForm'

export function EditGuidePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { session, isLoading: isSessionLoading } = useSession()
  const guide = useGuide(id)
  const backTo = `/guide/${id}`

  if (guide.isLoading || isSessionLoading) return <p className="text-stone-500">Loading guide…</p>
  if (guide.error) return <p className="text-red-600">Could not load guide: {guide.error.message}</p>
  if (!guide.data) return <p className="text-stone-600">This guide doesn't exist or was deleted.</p>
  if (guide.data.author_id !== session?.user.id) return <p className="text-stone-600">Only the author can edit this guide.</p>

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Link to={backTo} className="inline-flex items-center gap-1.5 text-sm font-medium text-forest-700 hover:text-forest-800">
        <ArrowLeftIcon size={16} aria-hidden="true" />
        Back to guide
      </Link>
      <h1 className="font-display text-3xl text-forest-800">Edit guide</h1>
      <GuideForm
        guide={guide.data}
        // replace: Back from the saved guide should not reopen the edit form.
        onSaved={() => navigate(backTo, { replace: true })}
        onCancel={() => navigate(backTo)}
      />
    </div>
  )
}
