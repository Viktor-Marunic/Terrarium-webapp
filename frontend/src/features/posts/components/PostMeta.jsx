// The small line above a post: community link, type badge, author and age. Shared by the feed card and the post page.
// The community link sits above PostCard's full-card link (relative z-10) so both stay clickable.
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'

const typeStyles = {
  showcase: 'bg-emerald-100 text-emerald-800',
  question: 'bg-amber-100 text-amber-800',
}

export function PostMeta({ post }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-stone-500">
      {post.community && (
        <Link
          to={`/communities?c=${post.community.slug}`}
          className="relative z-10 font-semibold text-emerald-800 hover:underline"
        >
          c/{post.community.slug}
        </Link>
      )}
      <span className={`rounded-full px-2 py-0.5 font-medium capitalize ${typeStyles[post.type]}`}>{post.type}</span>
      <span>@{post.author?.username ?? 'deleted'}</span>
      <span aria-hidden="true">·</span>
      <time dateTime={post.created_at}>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</time>
    </div>
  )
}
