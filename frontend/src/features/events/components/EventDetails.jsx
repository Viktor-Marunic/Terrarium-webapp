// Event page body, in the mockup's order: photo; type + price; title; facts table; who's going;
// RSVP + calendar buttons (and host tools for the host); About; host card.
import { ListingImage } from '../../../components/common/ListingImage'
import { eventTypeLabel, formatEventPrice } from '../schemas'
import { EventFacts } from './EventFacts'
import { AttendeeSummary } from './AttendeeSummary'
import { RsvpActions } from './RsvpActions'
import { EventOwnerActions } from './EventOwnerActions'
import { HostCard } from './HostCard'

export function EventDetails({ event, currentUserId }) {
  const isHost = event.host_id === currentUserId
  const isGoing = event.attendees.some((attendee) => attendee.user_id === currentUserId)

  return (
    // Photo on the left from md up, everything else in the right column.
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
      <div className="relative aspect-[2/1] min-w-0 overflow-hidden rounded-xl md:aspect-[4/3]">
        <ListingImage src={event.image_url} alt={event.title} />
      </div>
      <div className="min-w-0 space-y-5">
        <div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold tracking-wide text-stone-500 uppercase">{eventTypeLabel(event.type)}</p>
            <p className="font-semibold text-forest-800">{formatEventPrice(event.price)}</p>
          </div>
          <h1 className="mt-1 font-display text-[28px] leading-tight wrap-anywhere text-forest-800">{event.title}</h1>
          {event.price > 0 && <p className="mt-1 text-xs text-stone-500">Pay the host at the door. No online payment.</p>}
        </div>
        <EventFacts event={event} />
        <AttendeeSummary attendees={event.attendees} capacity={event.capacity} />
        <RsvpActions event={event} isGoing={isGoing} />
        {isHost && <EventOwnerActions event={event} />}
        {event.description && (
          <section>
            <h2 className="font-display text-xl text-forest-800">About</h2>
            <p className="mt-2 leading-relaxed wrap-anywhere whitespace-pre-line text-stone-600">{event.description}</p>
          </section>
        )}
        <HostCard hostId={event.host_id} host={event.host} />
      </div>
    </div>
  )
}
