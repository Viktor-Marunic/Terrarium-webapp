// /guide/new — "Write a guide": the guide form; on success it opens the new guide.
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeftIcon } from '@phosphor-icons/react'
import { GuideForm } from '../features/guides/components/GuideForm'

export function CreateGuidePage() {
  const navigate = useNavigate()

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Link to="/guide" className="inline-flex items-center gap-1.5 text-sm font-medium text-forest-700 hover:text-forest-800">
        <ArrowLeftIcon size={16} aria-hidden="true" />
        Guides
      </Link>
      <h1 className="font-display text-3xl text-forest-800">Write a guide</h1>
      <GuideForm
        // replace: Back from the new guide should return to the list, not to an empty form.
        onSaved={(guide) => navigate(`/guide/${guide.id}`, { replace: true })}
        onCancel={() => navigate('/guide')}
      />
    </div>
  )
}
