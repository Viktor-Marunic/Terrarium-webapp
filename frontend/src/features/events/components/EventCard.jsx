// One event in the list (mockup): photo, type + price, title, date · time · place, host, "8 / 16 going",
// and "View & RSVP". The whole card opens the event page (the title link is stretched over the card).
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { ArrowUpRightIcon } from '@phosphor-icons/react'
import { ListingImage } from '../../../components/common/ListingImage'
import { Avatar } from '../../profiles/components/Avatar'
import { eventTypeLabel, formatEventPrice, formatEventTime } from '../schemas'

export function EventCard({ event }) {
  const going = event.going?.[0]?.count ?? 0

  return (
    // has-[a:focus-visible] rings the whole card when its stretched title link is focused with the keyboard.
    <article className="relative overflow-hidden rounded-xl border border-stone-200 bg-paper transition-shadow hover:shadow-md has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-forest-700">
      <div className="relative aspect-[5/2]">
        <ListingImage src={event.image_url} />
      </div>
      <div className="space-y-2 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] font-semibold tracking-wide text-stone-500 uppercase">{eventTypeLabel(event.type)}</p>
          <p className="text-sm font-semibold text-forest-800">{formatEventPrice(event.price)}</p>
        </div>
        <h2 className="text-lg leading-snug font-semibold wrap-anywhere text-stone-900">
          {/* after:absolute inset-0 makes this link cover the whole card. */}
          <Link to={`/events/${event.id}`} className="after:absolute after:inset-0 focus-visible:outline-none">
            {event.title}
          </Link>
        </h2>
        <p className="text-sm wrap-anywhere text-stone-600">
          <time dateTime={event.starts_at}>{format(new Date(event.starts_at), 'EEE d MMM yyyy').toUpperCase()}</time>
          {' · '}
          {formatEventTime(event)} · {event.place}
        </p>
        <div className="flex items-center gap-2 pt-1 text-xs">
          <Avatar profile={event.host} size={22} />
          <span className="min-w-0 flex-1 truncate text-stone-600">Hosted by @{event.host?.username ?? 'deleted'}</span>
          <span className="shrink-0 text-stone-500 tabular-nums">
            {going}
            {event.capacity ? ` / ${event.capacity}` : ''} going
          </span>
          {/* Visual cue only; the stretched title link handles the click. */}
          <span aria-hidden="true" className="flex shrink-0 items-center gap-0.5 pl-2 text-sm font-semibold text-forest-800">
            View &amp; RSVP
            <ArrowUpRightIcon size={14} weight="bold" />
          </span>
        </div>
      </div>
    </article>
  )
}
