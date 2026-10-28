// Host-only buttons on their own event: edit it, delete it. Shown only to the host in the UI;
// the RLS policies are what actually stop anyone else.
import { Link, useNavigate } from 'react-router-dom'
import { PencilSimpleIcon, TrashIcon } from '@phosphor-icons/react'
import { useDeleteEvent } from '../hooks'

export function EventOwnerActions({ event }) {
  const navigate = useNavigate()
  const deleteEvent = useDeleteEvent()

  const handleDelete = () => {
    if (!window.confirm('Delete this event? Everyone’s RSVPs go with it. This cannot be undone.')) return
    deleteEvent.mutate({ id: event.id, imageUrl: event.image_url }, { onSuccess: () => navigate('/events', { replace: true }) })
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium tracking-wide text-stone-500 uppercase">Your event</p>
      <div className="grid grid-cols-2 gap-2">
        <Link
          to={`/events/${event.id}/edit`}
          className="flex items-center justify-center gap-2 rounded-lg border border-stone-300 bg-paper py-2.5 text-sm font-medium text-forest-800 transition-colors hover:border-forest-700"
        >
          <PencilSimpleIcon size={18} aria-hidden="true" />
          Edit
        </Link>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleteEvent.isPending}
          className="flex items-center justify-center gap-2 rounded-lg border border-stone-300 bg-paper py-2.5 text-sm font-medium text-red-700 transition-colors hover:border-red-300 hover:bg-red-50 disabled:opacity-60"
        >
          <TrashIcon size={18} aria-hidden="true" />
          {deleteEvent.isPending ? 'Deleting…' : 'Delete'}
        </button>
      </div>
      {deleteEvent.error && <p className="text-sm text-red-600">{deleteEvent.error.message}</p>}
    </div>
  )
}
