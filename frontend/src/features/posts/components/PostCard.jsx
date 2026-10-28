// One post in a feed (TerraSpace Figma): title, excerpt and cover photo (if any), author, then votes, comments,
// community and the bookmark. The post type only shows on the post page.
// The whole card opens the post page (the title link is stretched over the card).
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { ChatCircleIcon } from '@phosphor-icons/react'
import { Avatar } from '../../profiles/components/Avatar'
import { PostBookmarkButton } from '../../bookmarks/components/PostBookmarkButton'
import { VoteButtons } from '../../votes/components/VoteButtons'
import { myVoteOf } from '../../votes/score'

export function PostCard({ post }) {
  const commentCount = post.comments?.[0]?.count ?? 0

  return (
    <article className="relative rounded-xl bg-paper p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg leading-snug font-semibold break-words text-forest-800">
            {/* after:absolute inset-0 makes this link cover the card without nesting other links inside it. */}
            <Link to={`/posts/${post.id}`} className="after:absolute after:inset-0">
              {post.title}
            </Link>
          </h2>
          {post.body && <p className="mt-1 line-clamp-3 text-sm break-words whitespace-pre-line text-stone-600">{post.body}</p>}
        </div>
        {/* The first photo is the cover; posts without photos just have no thumbnail. */}
        {post.image_urls?.length > 0 && (
          <img src={post.image_urls[0]} alt="" loading="lazy" className="size-20 shrink-0 rounded-lg bg-sage-100 object-cover sm:size-24" />
        )}
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs text-stone-500">
        <Avatar profile={post.author} size={26} />
        <span className="font-medium text-stone-700">@{post.author?.username ?? 'deleted'}</span>
        <span aria-hidden="true">·</span>
        <time dateTime={post.created_at}>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</time>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs">
        {/* relative z-10 lifts the votes and community link above the stretched title link so they stay clickable. */}
        {/* Sage pills behind votes, comments and the bookmark, matching the post page. */}
        <div className="relative z-10 rounded-full bg-sage-100 px-1 py-0.5">
          <VoteButtons target="post" id={post.id} score={post.score} myVote={myVoteOf(post)} size={16} />
        </div>
        <span className="flex items-center gap-1 rounded-full bg-sage-100 px-2.5 py-1.5 font-semibold text-stone-600">
          <ChatCircleIcon size={16} aria-hidden="true" />
          {commentCount}
          <span className="sr-only">{commentCount === 1 ? 'comment' : 'comments'}</span>
        </span>
        {post.community && (
          <Link to={`/communities?c=${post.community.slug}`} className="relative z-10 font-medium text-forest-700 hover:underline">
            {post.community.name}
          </Link>
        )}
        <PostBookmarkButton postId={post.id} className="ml-auto bg-sage-100" />
      </div>
    </article>
  )
}
