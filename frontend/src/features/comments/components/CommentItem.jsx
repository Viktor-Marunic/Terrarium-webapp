// One comment with Reply (everyone) and Edit/Delete (its author), plus its nested replies (renders itself recursively).
import { useState } from 'react'
import { format, formatDistanceToNow } from 'date-fns'
import { EditDeleteButtons } from '../../../components/common/EditDeleteButtons'
import { Avatar } from '../../profiles/components/Avatar'
import { VoteButtons } from '../../votes/components/VoteButtons'
import { myVoteOf } from '../../votes/score'
import { useCreateComment, useDeleteComment, useUpdateComment } from '../hooks'
import { CommentForm } from './CommentForm'

// Past this depth replies stop indenting further, so deep threads stay readable on a phone.
const MAX_INDENT_DEPTH = 4

export function CommentItem({ comment, postId, currentUserId, depth = 0 }) {
  // Which inline form is open under this comment: 'reply', 'edit' or none.
  const [mode, setMode] = useState(null)
  const createComment = useCreateComment()
  const updateComment = useUpdateComment()
  const deleteComment = useDeleteComment()
  const isOwner = currentUserId === comment.author_id
  const close = () => setMode(null)

  return (
    <li>
      <div className="flex flex-wrap items-center gap-x-2 text-xs text-stone-500">
        <span className="flex items-center gap-1.5 font-medium text-stone-700">
          <Avatar profile={comment.author} />@{comment.author?.username ?? 'deleted'}
        </span>
        <span aria-hidden="true">·</span>
        <time dateTime={comment.created_at}>
          {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
        </time>
        {comment.edited_at && (
          <>
            <span aria-hidden="true">·</span>
            {/* Hover (desktop) shows when; the word itself is enough on phones. */}
            <time dateTime={comment.edited_at} title={`Edited ${format(new Date(comment.edited_at), 'd MMM yyyy, HH:mm')}`} className="italic">
              edited
            </time>
          </>
        )}
      </div>

      {mode === 'edit' ? (
        <div className="mt-1">
          <CommentForm
            label="Edit comment"
            submitLabel="Save"
            defaultBody={comment.body}
            rows={2}
            autoFocus
            onSubmit={async (body) => {
              await updateComment.mutateAsync({ id: comment.id, body })
              close()
            }}
            onCancel={close}
            isPending={updateComment.isPending}
            error={updateComment.error}
          />
        </div>
      ) : (
        <p className="mt-1 text-sm break-words whitespace-pre-line text-stone-800">{comment.body}</p>
      )}

      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
        <VoteButtons target="comment" id={comment.id} score={comment.score} myVote={myVoteOf(comment)} size={14} />
        <button
          type="button"
          onClick={() => setMode(mode === 'reply' ? null : 'reply')}
          className="text-xs font-medium text-stone-500 hover:text-emerald-700"
          aria-expanded={mode === 'reply'}
        >
          Reply
        </button>
        {isOwner && mode !== 'edit' && (
          <EditDeleteButtons
            onEdit={() => setMode('edit')}
            onDelete={() => deleteComment.mutate({ id: comment.id, postId })}
            isDeleting={deleteComment.isPending}
            confirmMessage="Delete this comment and all replies to it? This cannot be undone."
          />
        )}
      </div>
      {deleteComment.error && <p className="mt-1 text-sm text-red-600">{deleteComment.error.message}</p>}

      {mode === 'reply' && (
        <div className="mt-2">
          <CommentForm
            label="Write a reply"
            submitLabel="Reply"
            rows={2}
            autoFocus
            onSubmit={async (body) => {
              await createComment.mutateAsync({ postId, parentId: comment.id, body })
              close()
            }}
            onCancel={close}
            isPending={createComment.isPending}
            error={createComment.error}
          />
        </div>
      )}

      {comment.replies.length > 0 && (
        <ul className={`mt-3 space-y-4 border-l-2 border-stone-200 ${depth < MAX_INDENT_DEPTH ? 'ml-1 pl-3' : 'pl-2'}`}>
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              currentUserId={currentUserId}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  )
}
