// Upcoming events (all, or one type) with loading, error and empty states. One column on phones, two from md up.
import { useEvents } from '../hooks'
import { EventCard } from './EventCard'

export function EventList({ type }) {
  const events = useEvents(type)

  if (events.isLoading) return <p className="text-stone-500">Loading events…</p>
  if (events.error) return <p className="text-red-600">Could not load events: {events.error.message}</p>
  if (events.data.length === 0) {
    return <p className="text-stone-500">No upcoming events here yet. Why not host one?</p>
  }

  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {events.data.map((event) => (
        <li key={event.id} className="min-w-0">
          <EventCard event={event} />
        </li>
      ))}
    </ul>
  )
}
