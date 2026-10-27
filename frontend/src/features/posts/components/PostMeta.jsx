// The small line above a post on the post page: community link, type badge, author and age.
// (Feed cards use their own layout from the Figma, see PostCard.)
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { Avatar } from '../../profiles/components/Avatar'
import { PostTypeBadge } from './PostTypeBadge'

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
      <PostTypeBadge type={post.type} />
      <span className="flex items-center gap-1.5">
        <Avatar profile={post.author} size={26} />@{post.author?.username ?? 'deleted'}
      </span>
      <span aria-hidden="true">·</span>
      <time dateTime={post.created_at}>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</time>
    </div>
  )
}
