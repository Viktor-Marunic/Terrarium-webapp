// One comment with Reply (everyone) and Edit/Delete (its author), plus its nested replies (renders itself recursively).
import { useState } from 'react'
import { format, formatDistanceToNow } from 'date-fns'
import { EditDeleteButtons } from '../../../components/common/EditDeleteButtons'
import { Avatar } from '../../profiles/components/Avatar'
import { VoteButtons } from '../../votes/components/VoteButtons'
import { myVoteOf } from '../../votes/score'
import { useCreateComment, useDeleteComment, useUpdateComment } from '../hooks'
import { CommentForm } from './CommentForm'
import { RootStem } from './RootStem'
import { ThreadRoot } from './ThreadRoot'

// Past this depth replies stop indenting further, so deep threads stay readable on a phone.
const MAX_INDENT_DEPTH = 4

// connector: draw the root branch into this reply (see ThreadRoot); isLastReply: the parent's root ends at this reply.
export function CommentItem({ comment, postId, currentUserId, depth = 0, connector = false, isLastReply = false }) {
  // Which inline form is open under this comment: 'reply', 'edit' or none.
  const [mode, setMode] = useState(null)
  const createComment = useCreateComment()
  const updateComment = useUpdateComment()
  const deleteComment = useDeleteComment()
  const isOwner = currentUserId === comment.author_id
  const close = () => setMode(null)
  // Replies past the max depth just stack, without roots.
  const hasThreadedReplies = comment.replies.length > 0 && depth < MAX_INDENT_DEPTH

  return (
    <li className="relative">
      {connector && <ThreadRoot isLastReply={isLastReply} />}
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

      {/* Everything below the header is indented by pl-8 (avatar + gap) so it lines up with the username, like Reddit. */}
      <div className="relative pl-8">
        {/* The start of the root under this comment's avatar (its middle is 13px in). It reaches 16px past this block,
            where the first reply's branch picks it up. */}
        {hasThreadedReplies && <RootStem className="top-0 -bottom-4 left-[9px] h-[calc(100%+16px)]" />}

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
      </div>

      {comment.replies.length > 0 && (
        // mt-4 matches space-y-4, so every reply's curve reaches up by the same 16px.
        // ml-3 puts the line under the middle of this comment's avatar; past the max depth replies just stack.
        <ul className={`mt-4 space-y-4 ${hasThreadedReplies ? 'ml-3 pl-4' : ''}`}>
          {comment.replies.map((reply, index) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              currentUserId={currentUserId}
              depth={depth + 1}
              connector={hasThreadedReplies}
              isLastReply={index === comment.replies.length - 1}
            />
          ))}
        </ul>
      )}
    </li>
  )
}
