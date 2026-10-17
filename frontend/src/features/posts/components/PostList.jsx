// Post feed (all communities, or one when communityId is set) with loading, error and empty states.
import { usePosts } from '../hooks'
import { PostCard } from './PostCard'

export function PostList({ communityId }) {
  const posts = usePosts(communityId)

  if (posts.isLoading) return <p className="text-stone-500">Loading posts…</p>
  if (posts.error) return <p className="text-red-600">Could not load posts: {posts.error.message}</p>
  if (posts.data.length === 0) return <p className="text-stone-500">No posts yet. Be the first!</p>

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
