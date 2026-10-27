// Bookmark icon on a post (feed cards and the post page). Filled = saved.
// relative z-10 lifts it above the feed card's stretched link so clicking it doesn't open the post.
import { BookmarkSimpleIcon } from '@phosphor-icons/react'
import { useSavedPostIds, useSetPostBookmark } from '../hooks'

export function PostBookmarkButton({ postId, className = '' }) {
  const savedIds = useSavedPostIds()
  const setBookmark = useSetPostBookmark()
  const isSaved = savedIds.data?.includes(postId) ?? false

  return (
    <button
      type="button"
      onClick={() => setBookmark.mutate({ postId, saved: !isSaved })}
      disabled={savedIds.isLoading}
      aria-pressed={isSaved}
      aria-label={isSaved ? 'Remove from saved' : 'Save post'}
      className={`relative z-10 flex size-8 items-center justify-center rounded-full transition-[scale,color] hover:text-forest-800 motion-safe:active:scale-90 ${isSaved ? 'text-forest-800' : 'text-stone-500'} ${className}`}
    >
      <BookmarkSimpleIcon size={20} weight={isSaved ? 'fill' : 'regular'} aria-hidden="true" />
    </button>
  )
}
