// /events/new — "Create an event": the event form; on success it opens the new event's page.
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeftIcon } from '@phosphor-icons/react'
import { EventForm } from '../features/events/components/EventForm'

export function CreateEventPage() {
  const navigate = useNavigate()

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Link to="/events" className="inline-flex items-center gap-1.5 text-sm font-medium text-forest-700 hover:text-forest-800">
        <ArrowLeftIcon size={16} aria-hidden="true" />
        Events
      </Link>
      <h1 className="font-display text-3xl text-forest-800">Create an event</h1>
      <EventForm
        // replace: Back from the new event should return to the list, not to an empty form.
        onSaved={(event) => navigate(`/events/${event.id}`, { replace: true })}
        onCancel={() => navigate('/events')}
      />
    </div>
  )
}
