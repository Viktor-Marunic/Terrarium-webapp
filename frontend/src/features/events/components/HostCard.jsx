// "Hosted by …" card at the bottom of the event page (mockup): the host's profile picture, username,
// and how many events they've hosted (counted in the database).
import { Avatar } from '../../profiles/components/Avatar'
import { useHostedEventCount } from '../hooks'

export function HostCard({ hostId, host }) {
  const hostedCount = useHostedEventCount(hostId)

  return (
    <div className="flex items-center gap-3 rounded-xl border border-stone-200 bg-paper p-4">
      <Avatar profile={host} size={40} />
      <div className="min-w-0">
        <p className="truncate font-medium text-stone-900">Hosted by @{host?.username ?? 'deleted'}</p>
        {/* Nothing while loading or on error: it's a nice-to-have line, not worth an error message. */}
        {hostedCount.data !== undefined && (
          <p className="text-sm text-stone-500">
            Hosted {hostedCount.data} {hostedCount.data === 1 ? 'event' : 'events'}
          </p>
        )}
      </div>
    </div>
  )
}
