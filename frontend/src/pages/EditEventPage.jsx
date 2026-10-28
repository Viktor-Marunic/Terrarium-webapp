// /events/:id/edit — the host edits their own event with the same form, filled in.
// Others get a message instead of the form (and RLS would reject their save anyway).
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeftIcon } from '@phosphor-icons/react'
import { useSession } from '../features/auth/hooks'
import { useEvent } from '../features/events/hooks'
import { EventForm } from '../features/events/components/EventForm'

export function EditEventPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { session, isLoading: isSessionLoading } = useSession()
  const event = useEvent(id)
  const backTo = `/events/${id}`

  if (event.isLoading || isSessionLoading) return <p className="text-stone-500">Loading event…</p>
  if (event.error) return <p className="text-red-600">Could not load event: {event.error.message}</p>
  if (!event.data) return <p className="text-stone-600">This event doesn't exist or was cancelled.</p>
  if (event.data.host_id !== session?.user.id) return <p className="text-stone-600">Only the host can edit this event.</p>

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Link to={backTo} className="inline-flex items-center gap-1.5 text-sm font-medium text-forest-700 hover:text-forest-800">
        <ArrowLeftIcon size={16} aria-hidden="true" />
        Back to event
      </Link>
      <h1 className="font-display text-3xl text-forest-800">Edit event</h1>
      <EventForm
        event={event.data}
        // replace: Back from the saved event should not reopen the edit form.
        onSaved={() => navigate(backTo, { replace: true })}
        onCancel={() => navigate(backTo)}
      />
    </div>
  )
}
