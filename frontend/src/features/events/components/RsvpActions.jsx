// The two stacked buttons on the event page (mockup): "I'm going" (or "You're going ✓", which cancels when clicked,
// or a disabled "Full" / "This event has ended") and the secondary "Add to calendar" (.ics download).
import { CalendarPlusIcon, CheckIcon } from '@phosphor-icons/react'
import { useJoinEvent, useLeaveEvent } from '../hooks'
import { downloadEventIcs } from '../calendar'

export function RsvpActions({ event, isGoing }) {
  const joinEvent = useJoinEvent()
  const leaveEvent = useLeaveEvent()
  const isFull = event.capacity !== null && event.attendees.length >= event.capacity
  const hasEnded = new Date(event.ends_at) < new Date()
  const isPending = joinEvent.isPending || leaveEvent.isPending
  const error = joinEvent.error ?? leaveEvent.error

  const label = isGoing ? "You're going" : hasEnded ? 'This event has ended' : isFull ? 'Full' : "I'm going"

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => (isGoing ? leaveEvent.mutate(event.id) : joinEvent.mutate(event.id))}
        disabled={isPending || (!isGoing && (isFull || hasEnded))}
        aria-pressed={isGoing}
        className={`flex w-full items-center justify-center gap-2 rounded-lg py-3 font-medium transition-[background-color,scale] disabled:opacity-60 motion-safe:active:scale-[0.98] ${
          isGoing ? 'border border-forest-700 bg-sage-50 text-forest-800 hover:bg-sage-100' : 'bg-forest-700 text-white hover:bg-forest-800'
        }`}
      >
        {isGoing && <CheckIcon size={18} weight="bold" aria-hidden="true" />}
        {isPending ? 'Saving…' : label}
      </button>
      {isGoing && !isPending && <p className="text-center text-xs text-stone-500">Tap again if you can't make it.</p>}
      <button
        type="button"
        onClick={() => downloadEventIcs(event)}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-stone-300 bg-paper py-2.5 text-sm font-medium text-forest-800 transition-colors hover:border-forest-700"
      >
        <CalendarPlusIcon size={18} aria-hidden="true" />
        Add to calendar
      </button>
      {error && <p className="text-sm text-red-600">{error.message}</p>}
    </div>
  )
}
