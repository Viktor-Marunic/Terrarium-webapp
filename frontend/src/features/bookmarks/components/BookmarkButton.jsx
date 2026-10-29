// Round white heart button laid over a listing photo (shop cards and the product page). Filled = saved.
// relative z-10 lifts it above the card's stretched link so clicking it doesn't open the product page.
// Saving pops the heart and sends out a small burst; un-saving stays quiet.
import { useRef } from 'react'
import { HeartIcon } from '@phosphor-icons/react'
import { burst, pop } from '../../../lib/motion'
import { useBookmarkedListingIds, useSetBookmark } from '../hooks'

export function BookmarkButton({ listingId, className = '' }) {
  const bookmarks = useBookmarkedListingIds()
  const setBookmark = useSetBookmark()
  const heartRef = useRef(null)
  const isSaved = bookmarks.data?.includes(listingId) ?? false

  const handleClick = () => {
    if (!isSaved) {
      pop(heartRef.current)
      burst(heartRef.current)
    }
    setBookmark.mutate({ listingId, saved: !isSaved })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={bookmarks.isLoading}
      aria-pressed={isSaved}
      aria-label={isSaved ? 'Remove from saved' : 'Save listing'}
      className={`relative z-10 flex size-9 items-center justify-center rounded-full bg-white/95 text-forest-800 shadow-sm transition-[scale,background-color] hover:bg-white motion-safe:active:scale-90 ${className}`}
    >
      <HeartIcon ref={heartRef} size={20} weight={isSaved ? 'fill' : 'regular'} aria-hidden="true" />
    </button>
  )
}
