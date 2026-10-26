// One post in a feed. The whole card opens the post page (the title link is stretched over the card).
import { Link } from 'react-router-dom'
import { ChatCircleIcon } from '@phosphor-icons/react'
import { VoteButtons } from '../../votes/components/VoteButtons'
import { myVoteOf } from '../../votes/score'
import { PostMeta } from './PostMeta'

export function PostCard({ post }) {
  const commentCount = post.comments?.[0]?.count ?? 0

  return (
    <article className="relative rounded-lg bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <PostMeta post={post} />
      <h2 className="mt-2 font-semibold break-words text-stone-900">
        {/* after:absolute inset-0 makes this link cover the card without nesting other links inside it. */}
        <Link to={`/posts/${post.id}`} className="after:absolute after:inset-0">
          {post.title}
        </Link>
      </h2>
      {post.body && <p className="mt-1 line-clamp-3 text-sm break-words whitespace-pre-line text-stone-700">{post.body}</p>}
      <div className="mt-3 flex items-center gap-4">
        {/* relative z-10 lifts the buttons above the stretched title link so votes don't open the post. */}
        <div className="relative z-10">
          <VoteButtons target="post" id={post.id} score={post.score} myVote={myVoteOf(post)} />
        </div>
        <p className="flex items-center gap-1 text-xs text-stone-500">
          <ChatCircleIcon size={16} aria-hidden="true" />
          {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
        </p>
      </div>
    </article>
  )
}
