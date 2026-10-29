// ▲ score ▼ for a post or comment. Shows the new vote immediately while it's being saved (optimistic UI).
// Tap feedback: the arrow pops when a vote switches on, and the score bumps whenever it changes.
import { useRef } from 'react'
import { ArrowFatDownIcon, ArrowFatUpIcon } from '@phosphor-icons/react'
import { bump, pop } from '../../../lib/motion'
import { useVote } from '../hooks'
import { nextVote, scoreDelta } from '../score'

export function VoteButtons({ target, id, score, myVote, size = 18 }) {
  const vote = useVote()
  const upRef = useRef(null)
  const downRef = useRef(null)
  const scoreRef = useRef(null)

  // While saving, pretend the vote already went through; the refetch afterwards brings the real score.
  // Refetches run inside the mutation (onSettled awaits them), so the numbers never jump back mid-way.
  const shownVote = vote.isPending ? vote.variables.next : myVote
  const shownScore = score + scoreDelta(myVote, shownVote)

  const handleClick = (clicked) => {
    if (vote.isPending) return
    const next = nextVote(myVote, clicked)
    // Pop only when the vote turns on; un-voting is a quiet action.
    if (next !== 0) pop(clicked === 1 ? upRef.current : downRef.current)
    bump(scoreRef.current)
    vote.mutate({ target, id, current: myVote, next })
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
        <ArrowFatUpIcon ref={upRef} size={size} weight={shownVote === 1 ? 'fill' : 'regular'} aria-hidden="true" />
      </button>
      <span
        ref={scoreRef}
        className={`inline-block min-w-6 text-center text-sm font-semibold tabular-nums ${
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
        <ArrowFatDownIcon ref={downRef} size={size} weight={shownVote === -1 ? 'fill' : 'regular'} aria-hidden="true" />
      </button>
      {vote.error && (
        <span role="alert" className="ml-2 text-xs text-red-600">
          Vote failed
        </span>
      )}
    </div>
  )
}
