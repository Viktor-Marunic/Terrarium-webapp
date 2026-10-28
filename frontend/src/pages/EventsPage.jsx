// /events — upcoming community events (workshops, plant swaps, meetups), filterable with ?type=<value>,
// plus the way into "Create an event".
import { Link, useSearchParams } from 'react-router-dom'
import { PlusIcon } from '@phosphor-icons/react'
import { eventTypes } from '../features/events/schemas'
import { EventTypeFilter } from '../features/events/components/EventTypeFilter'
import { EventList } from '../features/events/components/EventList'

export function EventsPage() {
  const [searchParams] = useSearchParams()
  // An unknown type (e.g. a typo in the URL) falls back to showing everything.
  const type = eventTypes.find(({ value }) => value === searchParams.get('type'))?.value

  return (
    <div className="space-y-5">
      {/* flex-wrap: on very narrow phones the button drops under the heading instead of overflowing. */}
      <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <h1 className="font-display text-3xl text-forest-800">Events</h1>
        <Link
          to="/events/new"
          className="flex shrink-0 items-center gap-2 rounded-lg bg-forest-700 px-4 py-2.5 text-sm font-medium text-white transition-[background-color,scale] hover:bg-forest-800 motion-safe:active:scale-[0.97]"
        >
          <PlusIcon size={16} weight="bold" aria-hidden="true" />
          Create an event
        </Link>
      </header>
      <EventTypeFilter activeType={type} />
      <EventList type={type} />
    </div>
  )
}
