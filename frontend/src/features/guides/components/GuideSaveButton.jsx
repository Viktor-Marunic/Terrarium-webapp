// Bookmark (save) toggle with the save count, on guide cards and the guide page.
// relative z-10 lifts it above a card's stretched link so clicking it doesn't open the guide.
import { BookmarkSimpleIcon } from '@phosphor-icons/react'
import { useSetGuideSave } from '../hooks'

export function GuideSaveButton({ guide }) {
  const setSave = useSetGuideSave()
  // Only the viewer's own save row is ever returned (RLS), so any row means "saved".
  const isSaved = guide.my_save.length > 0

  return (
    <button
      type="button"
      onClick={() => setSave.mutate({ guideId: guide.id, saved: !isSaved })}
      disabled={setSave.isPending}
      aria-pressed={isSaved}
      aria-label={isSaved ? 'Remove from saved' : 'Save guide'}
      className={`relative z-10 flex shrink-0 items-center gap-1 rounded-full bg-sage-100 px-2.5 py-1.5 text-xs font-semibold tabular-nums transition-[scale,color] hover:text-forest-800 motion-safe:active:scale-90 ${isSaved ? 'text-forest-800' : 'text-stone-600'}`}
    >
      <BookmarkSimpleIcon size={16} weight={isSaved ? 'fill' : 'regular'} aria-hidden="true" />
      {guide.save_count}
    </button>
  )
}
