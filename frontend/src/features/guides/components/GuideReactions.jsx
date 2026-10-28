// Heart (like) and bookmark (save) toggles with their counts, on guide cards and the guide page.
// relative z-10 lifts them above a card's stretched link so clicking them doesn't open the guide.
import { BookmarkSimpleIcon, HeartIcon } from '@phosphor-icons/react'
import { useSetGuideLike, useSetGuideSave } from '../hooks'

export function GuideReactions({ guide }) {
  const setLike = useSetGuideLike()
  const setSave = useSetGuideSave()
  // The embedded rows are only ever the viewer's own (RLS), so any row means "done".
  const isLiked = guide.my_like.length > 0
  const isSaved = guide.my_save.length > 0

  const reactions = [
    {
      Icon: HeartIcon,
      isOn: isLiked,
      count: guide.like_count,
      label: isLiked ? 'Unlike guide' : 'Like guide',
      mutation: setLike,
      toggle: () => setLike.mutate({ guideId: guide.id, liked: !isLiked }),
    },
    {
      Icon: BookmarkSimpleIcon,
      isOn: isSaved,
      count: guide.save_count,
      label: isSaved ? 'Remove from saved' : 'Save guide',
      mutation: setSave,
      toggle: () => setSave.mutate({ guideId: guide.id, saved: !isSaved }),
    },
  ]

  return (
    <div className="relative z-10 flex shrink-0 items-center gap-2">
      {reactions.map(({ Icon, isOn, count, label, mutation, toggle }) => (
        <button
          key={label}
          type="button"
          onClick={toggle}
          disabled={mutation.isPending}
          aria-pressed={isOn}
          aria-label={label}
          className={`flex items-center gap-1 rounded-full bg-sage-100 px-2.5 py-1.5 text-xs font-semibold tabular-nums transition-[scale,color] hover:text-forest-800 motion-safe:active:scale-90 ${isOn ? 'text-forest-800' : 'text-stone-600'}`}
        >
          <Icon size={16} weight={isOn ? 'fill' : 'regular'} aria-hidden="true" />
          {count}
        </button>
      ))}
    </div>
  )
}
