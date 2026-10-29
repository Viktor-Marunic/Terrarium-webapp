// Post feed (all communities, or one when communityId is set; one user's when authorId is set), sorted 'new' or 'top',
// one page at a time (?page= in the URL), with loading, error and empty states.
import { useSearchParams } from 'react-router-dom'
import { usePosts } from '../hooks'
import { POSTS_PAGE_SIZE } from '../api'
import { PostCard } from './PostCard'
import { Pagination } from './Pagination'
import { useStaggerIn } from '../../../lib/useStaggerIn'

// ids is the profile's optional "Saved" filter; see listPosts.
export function PostList({ communityId, sort, authorId, ids, emptyText = 'No posts yet. Be the first!' }) {
  const [searchParams] = useSearchParams()
  // A missing or broken ?page= (e.g. "abc" or "-3") means page 1.
  const page = Math.max(1, Number.parseInt(searchParams.get('page'), 10) || 1)
  const posts = usePosts({ communityId, sort, authorId, ids, page: page - 1 })
  // Cards rise in one after another when they appear (before the early returns: hooks run every render).
  const listRef = useStaggerIn([posts.data])

  if (posts.isLoading) return <p className="text-stone-500">Loading posts…</p>
  if (posts.error) return <p className="text-red-600">Could not load posts: {posts.error.message}</p>

  const { posts: items, totalCount } = posts.data
  if (totalCount === 0) return <p className="text-stone-500">{emptyText}</p>

  return (
    <div className="space-y-3">
      <ul ref={listRef} className={`space-y-3 transition-opacity ${posts.isPlaceholderData ? 'opacity-60' : ''}`}>
        {items.map((post) => (
          <li key={post.id}>
            <PostCard post={post} />
          </li>
        ))}
      </ul>
      {/* Past the last page (e.g. an old link after posts were deleted) the list is empty but the pager still leads back. */}
      {items.length === 0 && <p className="text-stone-500">There are no posts on this page.</p>}
      <Pagination
        page={page}
        totalPages={Math.ceil(totalCount / POSTS_PAGE_SIZE)}
        shownCount={items.length}
        totalCount={totalCount}
      />
    </div>
  )
}
