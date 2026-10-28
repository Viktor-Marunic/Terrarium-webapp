// Overlapping avatars of the first few people going, plus "14 going · 10 spots left" (mockup).
import { Avatar } from '../../profiles/components/Avatar'

const SHOWN = 4

export function AttendeeSummary({ attendees, capacity }) {
  const going = attendees.length
  const spotsLeft = capacity ? Math.max(capacity - going, 0) : null

  return (
    <div className="flex items-center gap-3">
      {going > 0 && (
        <ul className="flex -space-x-2" aria-label="Some of the people going">
          {attendees.slice(0, SHOWN).map((attendee) => (
            // The ring separates overlapping avatars, like the mockup.
            <li key={attendee.user_id} className="rounded-full ring-2 ring-cream" title={`@${attendee.profile?.username ?? 'deleted'}`}>
              <Avatar profile={attendee.profile} size={30} />
            </li>
          ))}
        </ul>
      )}
      <p className="text-sm text-stone-600">
        {going === 0 ? 'Nobody going yet. Be the first!' : `${going} going`}
        {spotsLeft !== null && going > 0 && ` · ${spotsLeft === 0 ? 'Full' : `${spotsLeft} spots left`}`}
      </p>
    </div>
  )
}
