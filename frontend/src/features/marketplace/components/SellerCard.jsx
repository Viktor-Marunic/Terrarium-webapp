// Small "who's selling" card at the bottom of the product page: initials circle, username, when it was listed.
// Initials instead of the profile avatar keep this inside the marketplace feature and match the mockup.
import { formatDistanceToNow } from 'date-fns'

export function SellerCard({ username, listedAt }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-stone-200 bg-paper p-4">
      <span
        aria-hidden="true"
        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sage-100 text-sm font-semibold text-forest-800"
      >
        {username.slice(0, 2).toUpperCase()}
      </span>
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
