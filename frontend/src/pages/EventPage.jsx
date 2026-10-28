// /events/:id — one event: photo, details, who's going, RSVP / add to calendar, host tools for the host.
import { Link, useParams } from 'react-router-dom'
import { ArrowLeftIcon } from '@phosphor-icons/react'
import { useSession } from '../features/auth/hooks'
import { useEvent } from '../features/events/hooks'
import { EventDetails } from '../features/events/components/EventDetails'

export function EventPage() {
  const { id } = useParams()
  const { session } = useSession()
  const event = useEvent(id)

  const backLink = (
    <Link to="/events" className="inline-flex items-center gap-1.5 text-sm font-medium text-forest-700 hover:text-forest-800">
      <ArrowLeftIcon size={16} aria-hidden="true" />
      Events
    </Link>
  )

  if (event.isLoading) return <p className="text-stone-500">Loading event…</p>
  if (event.error) return <p className="text-red-600">Could not load event: {event.error.message}</p>

  return (
    <div className="space-y-4">
      {backLink}
      {event.data ? (
        <EventDetails event={event.data} currentUserId={session?.user.id} />
      ) : (
        <p className="text-stone-600">This event doesn't exist or was cancelled.</p>
      )}
    </div>
  )
}
