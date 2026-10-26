// Small "who's selling" card at the bottom of the product page: the seller's profile picture, username, and
// when it was listed. `avatarSrc` comes from the page (the profiles feature decides what a user's picture is,
// so it matches their profile); initials are the fallback when there isn't one (e.g. a deleted seller).
import { formatDistanceToNow } from 'date-fns'

export function SellerCard({ username, avatarSrc, listedAt }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-stone-200 bg-paper p-4">
      {avatarSrc ? (
        <img src={avatarSrc} alt="" width={40} height={40} className="size-10 shrink-0 rounded-full bg-stone-100 object-cover" />
      ) : (
        <span
          aria-hidden="true"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sage-100 text-sm font-semibold text-forest-800"
        >
          {username.slice(0, 2).toUpperCase()}
        </span>
      )}
      <div className="min-w-0">
        <p className="truncate font-medium text-stone-900">@{username}</p>
        <p className="text-sm text-stone-500">
          Seller · listed{' '}
          <time dateTime={listedAt}>{formatDistanceToNow(new Date(listedAt), { addSuffix: true })}</time>
        </p>
      </div>
    </div>
  )
}
