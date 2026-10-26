// Post feed (all communities, or one when communityId is set; one user's when authorId is set), sorted 'new' or 'top', with loading, error and empty states.
import { usePosts } from '../hooks'
import { PostCard } from './PostCard'

export function PostList({ communityId, sort, authorId, emptyText = 'No posts yet. Be the first!' }) {
  const posts = usePosts(communityId, sort, authorId)

  if (posts.isLoading) return <p className="text-stone-500">Loading posts…</p>
  if (posts.error) return <p className="text-red-600">Could not load posts: {posts.error.message}</p>
  if (posts.data.length === 0) return <p className="text-stone-500">{emptyText}</p>

  return (
    <ul className="space-y-3">
      {posts.data.map((post) => (
        <li key={post.id}>
          <PostCard post={post} />
        </li>
      ))}
    </ul>
  )
}
