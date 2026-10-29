// The two stacked buttons on the event page (mockup): "I'm going" (or "You're going ✓", which cancels when clicked,
// or a disabled "Full" / "This event has ended") and the secondary "Add to calendar" (.ics download).
// Joining is a rare, happy moment, so it gets a small confetti burst once the RSVP is actually saved.
import { useRef } from 'react'
import { CalendarPlusIcon, CheckIcon } from '@phosphor-icons/react'
import { FadeIn } from '../../../components/common/FadeIn'
import { burst, pop } from '../../../lib/motion'
import { useJoinEvent, useLeaveEvent } from '../hooks'
import { downloadEventIcs } from '../calendar'

// The app's own palette (forest, sage, root brown) instead of rainbow confetti.
const CONFETTI_COLORS = ['#2c4a3b', '#6f8c76', '#9a7b5c']

export function RsvpActions({ event, isGoing }) {
  const joinEvent = useJoinEvent()
  const leaveEvent = useLeaveEvent()
  const buttonRef = useRef(null)

  const celebrate = () => {
    pop(buttonRef.current)
    CONFETTI_COLORS.forEach((color) => burst(buttonRef.current, { color, count: 7, distance: 80 }))
  }
  const handleClick = () => (isGoing ? leaveEvent.mutate(event.id) : joinEvent.mutate(event.id, { onSuccess: celebrate }))
  const isFull = event.capacity !== null && event.attendees.length >= event.capacity
  const hasEnded = new Date(event.ends_at) < new Date()
  const isPending = joinEvent.isPending || leaveEvent.isPending
  const error = joinEvent.error ?? leaveEvent.error

  const label = isGoing ? "You're going" : hasEnded ? 'This event has ended' : isFull ? 'Full' : "I'm going"

  return (
    <div className="space-y-2">
      <button
        ref={buttonRef}
        type="button"
        onClick={handleClick}
        disabled={isPending || (!isGoing && (isFull || hasEnded))}
        aria-pressed={isGoing}
        className={`flex w-full items-center justify-center gap-2 rounded-lg py-3 font-medium transition-[background-color,scale] disabled:opacity-60 motion-safe:active:scale-[0.98] ${
          isGoing ? 'border border-forest-700 bg-sage-50 text-forest-800 hover:bg-sage-100' : 'bg-forest-700 text-white hover:bg-forest-800'
        }`}
      >
        {/* key = the shown label, so "I'm going" → "Saving…" → "You're going" fades instead of snapping. */}
        <FadeIn key={isPending ? 'saving' : label} className="flex items-center gap-2">
          {isGoing && <CheckIcon size={18} weight="bold" aria-hidden="true" />}
          {isPending ? 'Saving…' : label}
        </FadeIn>
      </button>
      {isGoing && !isPending && (
        <FadeIn as="p" className="block text-center text-xs text-stone-500">
          Tap again if you can't make it.
        </FadeIn>
      )}
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
