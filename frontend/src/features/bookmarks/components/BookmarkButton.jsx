// Round white heart button laid over a listing photo (shop cards and the product page). Filled = saved.
// relative z-10 lifts it above the card's stretched link so clicking it doesn't open the product page.
import { HeartIcon } from '@phosphor-icons/react'
import { useBookmarkedListingIds, useSetBookmark } from '../hooks'

export function BookmarkButton({ listingId, className = '' }) {
  const bookmarks = useBookmarkedListingIds()
  const setBookmark = useSetBookmark()
  const isSaved = bookmarks.data?.includes(listingId) ?? false

  return (
    <button
      type="button"
      onClick={() => setBookmark.mutate({ listingId, saved: !isSaved })}
      disabled={bookmarks.isLoading}
      aria-pressed={isSaved}
      aria-label={isSaved ? 'Remove from saved' : 'Save listing'}
      className={`relative z-10 flex size-9 items-center justify-center rounded-full bg-white/95 text-forest-800 shadow-sm transition-[scale,background-color] hover:bg-white motion-safe:active:scale-90 ${className}`}
    >
      <HeartIcon size={20} weight={isSaved ? 'fill' : 'regular'} aria-hidden="true" />
    </button>
  )
}
