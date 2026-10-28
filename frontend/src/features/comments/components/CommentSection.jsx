// Everything under a post: the "add a comment" box and the threaded comments, with loading/error/empty states.
import { useMemo } from 'react'
import { useSession } from '../../auth/hooks'
import { useComments, useCreateComment } from '../hooks'
import { buildCommentTree } from '../tree'
import { CommentForm } from './CommentForm'
import { CommentItem } from './CommentItem'

export function CommentSection({ postId }) {
  const { session } = useSession()
  const comments = useComments(postId)
  const createComment = useCreateComment()
  const tree = useMemo(() => buildCommentTree(comments.data ?? []), [comments.data])

  return (
    // No visible heading: the post page shows the comment count next to the votes instead.
    <section aria-label="Comments" className="space-y-4">
      <CommentForm
        label="Add a comment"
        submitLabel="Comment"
        onSubmit={(body) => createComment.mutateAsync({ postId, body })}
        isPending={createComment.isPending}
        error={createComment.error}
      />
      {comments.isLoading && <p className="text-sm text-stone-500">Loading comments…</p>}
      {comments.error && <p className="text-sm text-red-600">Could not load comments: {comments.error.message}</p>}
      {comments.data?.length === 0 && <p className="text-sm text-stone-500">No comments yet. Start the conversation!</p>}
      {tree.length > 0 && (
        <ul className="space-y-4">
          {tree.map((comment) => (
            <CommentItem key={comment.id} comment={comment} postId={postId} currentUserId={session?.user.id} />
          ))}
        </ul>
      )}
    </section>
  )
}
