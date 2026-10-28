// Row of event type chips ("All events" + Workshops / Plant swaps / Meetups). The choice lives in the URL (?type=value).
import { FilterChipLink } from '../../../components/common/FilterChipLink'
import { eventTypes } from '../schemas'

export function EventTypeFilter({ activeType }) {
  return (
    // Scrolls sideways on phones instead of wrapping into several rows.
    <nav aria-label="Filter by event type" className="-mx-4 overflow-x-auto px-4">
      <ul className="flex gap-2 pb-1">
        <li className="shrink-0">
          <FilterChipLink to="/events" isActive={!activeType}>
            All events
          </FilterChipLink>
        </li>
        {eventTypes.map(({ value, filter }) => (
          <li key={value} className="shrink-0">
            <FilterChipLink to={`/events?type=${value}`} isActive={value === activeType}>
              {filter}
            </FilterChipLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
