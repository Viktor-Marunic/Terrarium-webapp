// Bookmark (save) toggle with the save count, on guide cards and the guide page.
// relative z-10 lifts it above a card's stretched link so clicking it doesn't open the guide.
// Saving pops the icon and bumps the count; un-saving stays quiet.
import { useRef } from 'react'
import { BookmarkSimpleIcon } from '@phosphor-icons/react'
import { bump, pop } from '../../../lib/motion'
import { useSetGuideSave } from '../hooks'

export function GuideSaveButton({ guide }) {
  const setSave = useSetGuideSave()
  const iconRef = useRef(null)
  const countRef = useRef(null)
  // Only the viewer's own save row is ever returned (RLS), so any row means "saved".
  const isSaved = guide.my_save.length > 0

  const handleClick = () => {
    if (!isSaved) {
      pop(iconRef.current)
      bump(countRef.current)
    }
    setSave.mutate({ guideId: guide.id, saved: !isSaved })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={setSave.isPending}
      aria-pressed={isSaved}
      aria-label={isSaved ? 'Remove from saved' : 'Save guide'}
      className={`relative z-10 flex shrink-0 items-center gap-1 rounded-full bg-sage-100 px-2.5 py-1.5 text-xs font-semibold tabular-nums transition-[scale,color] hover:text-forest-800 motion-safe:active:scale-90 ${isSaved ? 'text-forest-800' : 'text-stone-600'}`}
    >
      <BookmarkSimpleIcon ref={iconRef} size={16} weight={isSaved ? 'fill' : 'regular'} aria-hidden="true" />
      <span ref={countRef} className="inline-block">
        {guide.save_count}
      </span>
    </button>
  )
}
