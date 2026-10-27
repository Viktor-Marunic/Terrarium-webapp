// /posts/:id — one post in full, with its comment thread below. The author can edit or delete it here.
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeftIcon } from '@phosphor-icons/react'
import { EditDeleteButtons } from '../components/common/EditDeleteButtons'
import { useSession } from '../features/auth/hooks'
import { useDeletePost, usePost } from '../features/posts/hooks'
import { PostMeta } from '../features/posts/components/PostMeta'
import { EditPostForm } from '../features/posts/components/EditPostForm'
import { CommentSection } from '../features/comments/components/CommentSection'
import { VoteButtons } from '../features/votes/components/VoteButtons'
import { PostBookmarkButton } from '../features/bookmarks/components/PostBookmarkButton'
import { myVoteOf } from '../features/votes/score'

export function PostPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { session } = useSession()
  const post = usePost(id)
  const deletePost = useDeletePost()
  const [isEditing, setIsEditing] = useState(false)

  if (post.isLoading) return <p className="text-stone-500">Loading post…</p>
  if (post.error) return <p className="text-red-600">Could not load post: {post.error.message}</p>
  if (!post.data) {
    return (
      <p className="text-stone-600">
        This post doesn't exist or was deleted.{' '}
        <Link to="/communities" className="font-medium text-emerald-700 hover:underline">
          Back to communities
        </Link>
      </p>
    )
  }

  const { title, body, community, author_id, image_urls } = post.data
  const backTo = community ? `/communities?c=${community.slug}` : '/communities'
  // UI only; the database's RLS policies are what actually stop others from editing.
  const isOwner = session?.user.id === author_id

  const handleDelete = () => deletePost.mutate({ id, imageUrls: image_urls }, { onSuccess: () => navigate(backTo, { replace: true }) })

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link to={backTo} className="inline-flex items-center gap-1 text-sm text-stone-600 hover:text-emerald-700">
        <ArrowLeftIcon size={16} aria-hidden="true" />
        Back to {community ? community.name : 'communities'}
      </Link>
      {isEditing ? (
        <EditPostForm post={post.data} onDone={() => setIsEditing(false)} />
      ) : (
        <article className="rounded-lg bg-white p-4 shadow-sm">
          <PostMeta post={post.data} />
          <h1 className="mt-2 text-xl font-semibold break-words text-stone-900">{title}</h1>
          {body && <p className="mt-3 break-words whitespace-pre-line text-stone-800">{body}</p>}
          {image_urls.length > 0 && (
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {image_urls.map((url, index) => (
                // A single photo spans the full width instead of leaving an empty half.
                <li key={url} className={image_urls.length === 1 ? 'sm:col-span-2' : ''}>
                  <img src={url} alt={`Photo ${index + 1} of ${title}`} className="w-full rounded-lg bg-sage-100 object-cover" />
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-stone-100 pt-3">
            <VoteButtons target="post" id={id} score={post.data.score} myVote={myVoteOf(post.data)} />
            {isOwner && (
              <EditDeleteButtons
                onEdit={() => setIsEditing(true)}
                onDelete={handleDelete}
                isDeleting={deletePost.isPending}
                confirmMessage="Delete this post and all its comments? This cannot be undone."
              />
            )}
            <PostBookmarkButton postId={id} className="ml-auto" />
          </div>
          {deletePost.error && <p className="mt-2 text-sm text-red-600">{deletePost.error.message}</p>}
        </article>
      )}
      <CommentSection postId={id} />
    </div>
  )
}
