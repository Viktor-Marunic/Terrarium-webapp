// A reply's piece of the root-shaped thread line: a branch that sweeps off the parent's root into this reply's avatar.
// Positioned against the reply's <li>: the parent's root runs 15px left of it, the avatar's middle is 13px down,
// and replies are 16px apart (CommentItem's space-y-4 / mt-4). The root's start under the parent's avatar is
// drawn by CommentItem itself.
import { RootStem } from './RootStem'

export function ThreadRoot({ isLastReply }) {
  return (
    <>
      {/* The parent's root carries on past this reply to the next one. */}
      {!isLastReply && <RootStem className="top-0 bottom-0 -left-[19px] h-full" />}
      <svg aria-hidden="true" width="18" height="29" className="absolute -top-4 -left-[18px] overflow-visible text-root">
        {/* The branch: straight down through the gap above, then one smooth sweep into the avatar. */}
        <path d="M3 0V8C3 21 8 29 18 29" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        {/* The last reply ends the root in a tip that tapers to a point, instead of stopping flat. */}
        {isLastReply && <path d="M1.5 14C1.5 28 1 36 0.5 44C2.5 36 4.5 28 4.5 14Z" fill="currentColor" />}
      </svg>
    </>
  )
}
