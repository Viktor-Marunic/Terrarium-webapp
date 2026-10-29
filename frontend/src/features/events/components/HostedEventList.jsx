// The events one user has hosted, past ones included (the profile's "My events" tab), with loading, error and
// empty states. Same cards as the events page.
import { useHostedEvents } from '../hooks'
import { EventCard } from './EventCard'
import { useStaggerIn } from '../../../lib/useStaggerIn'

export function HostedEventList({ hostId, emptyText }) {
  const events = useHostedEvents(hostId)
  // Cards rise in one after another when they appear (before the early returns: hooks run every render).
  const listRef = useStaggerIn([events.data])

  if (events.isLoading) return <p className="text-stone-500">Loading events…</p>
  if (events.error) return <p className="text-red-600">Could not load events: {events.error.message}</p>
  if (!events.data?.length) return <p className="text-stone-500">{emptyText}</p>

  return (
    <ul ref={listRef} className="space-y-4">
      {events.data.map((event) => (
        <li key={event.id} className="min-w-0">
          <EventCard event={event} />
        </li>
      ))}
    </ul>
  )
}
