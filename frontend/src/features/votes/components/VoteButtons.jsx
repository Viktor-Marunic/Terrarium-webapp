// ▲ score ▼ for a post or comment. Shows the new vote immediately while it's being saved (optimistic UI).
import { ArrowFatDownIcon, ArrowFatUpIcon } from '@phosphor-icons/react'
import { useVote } from '../hooks'
import { nextVote, scoreDelta } from '../score'

export function VoteButtons({ target, id, score, myVote, size = 18 }) {
  const vote = useVote()

  // While saving, pretend the vote already went through; the refetch afterwards brings the real score.
  // Refetches run inside the mutation (onSettled awaits them), so the numbers never jump back mid-way.
  const shownVote = vote.isPending ? vote.variables.next : myVote
  const shownScore = score + scoreDelta(myVote, shownVote)

  const handleClick = (clicked) => {
    if (vote.isPending) return
    vote.mutate({ target, id, current: myVote, next: nextVote(myVote, clicked) })
  }

  const arrowClass = (isActive, activeColor) =>
    `rounded p-1 transition-transform active:scale-90 motion-reduce:transition-none ${
      isActive ? activeColor : 'text-stone-400 hover:text-stone-600'
    }`

  return (
    <div className="flex items-center gap-0.5">
      <button
        type="button"
        onClick={() => handleClick(1)}
        aria-pressed={shownVote === 1}
        aria-label="Upvote"
        className={arrowClass(shownVote === 1, 'text-emerald-600')}
      >
        <ArrowFatUpIcon size={size} weight={shownVote === 1 ? 'fill' : 'regular'} aria-hidden="true" />
      </button>
      <span
        className={`min-w-6 text-center text-sm font-semibold tabular-nums ${
          shownVote === 1 ? 'text-emerald-700' : shownVote === -1 ? 'text-red-600' : 'text-stone-600'
        }`}
        aria-live="polite"
      >
        {shownScore}
      </span>
      <button
        type="button"
        onClick={() => handleClick(-1)}
        aria-pressed={shownVote === -1}
        aria-label="Downvote"
        className={arrowClass(shownVote === -1, 'text-red-500')}
      >
        <ArrowFatDownIcon size={size} weight={shownVote === -1 ? 'fill' : 'regular'} aria-hidden="true" />
      </button>
      {vote.error && (
        <span role="alert" className="ml-2 text-xs text-red-600">
          Vote failed
        </span>
      )}
    </div>
  )
}
