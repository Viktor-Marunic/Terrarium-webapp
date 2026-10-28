// Date / Time / Place / Address table on the event page (mockup). The address links to Google Maps.
import { format } from 'date-fns'
import { formatEventTime } from '../schemas'

export function EventFacts({ event }) {
  const rows = [
    ['Date', format(new Date(event.starts_at), 'EEEE d MMMM yyyy')],
    ['Time', formatEventTime(event)],
    ['Place', event.place],
  ]

  return (
    <dl className="divide-y divide-stone-200 rounded-xl border border-stone-200 bg-paper px-4">
      {rows.map(([term, value]) => (
        <div key={term} className="flex justify-between gap-4 py-3 text-sm">
          <dt className="shrink-0 text-stone-500">{term}</dt>
          <dd className="text-right font-medium wrap-anywhere text-stone-900">{value}</dd>
        </div>
      ))}
      {event.address && (
        <div className="flex justify-between gap-4 py-3 text-sm">
          <dt className="shrink-0 text-stone-500">Address</dt>
          <dd className="text-right font-medium wrap-anywhere">
            {/* External site, so a plain <a> (not a router <Link>) is correct. */}
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address)}`}
              target="_blank"
              rel="noreferrer"
              className="text-stone-900 underline decoration-stone-300 underline-offset-2 hover:decoration-forest-700"
            >
              {event.address}
            </a>
          </dd>
        </div>
      )}
    </dl>
  )
}
