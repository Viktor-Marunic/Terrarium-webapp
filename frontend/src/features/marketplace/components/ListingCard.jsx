// One listing in the shop grid: cover photo, title, price, condition + seller. The whole card opens the product page
// (the title link is stretched over the card, like PostCard).
// Slots filled by the page, so this feature doesn't import other features: `imageOverlay` (the bookmark heart)
// and `action` ("Add to bag"). Without an action, a "View listing" cue keeps the cards lined up.
import { Link } from 'react-router-dom'
import { labelFor, listingConditions } from '../schemas'
import { ListingImage } from '../../../components/common/ListingImage'

export function ListingCard({ listing, imageOverlay, action }) {
  return (
    // has-[a:focus-visible] rings the whole card when its (stretched) title link is focused with the keyboard.
    <article className="group relative flex w-full min-w-0 flex-col overflow-hidden rounded-xl border border-stone-200 bg-paper transition-shadow hover:shadow-md has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-forest-700">
      <div className="relative aspect-[4/3]">
        <ListingImage src={listing.image_urls[0]} />
        {imageOverlay && <div className="absolute top-2 right-2">{imageOverlay}</div>}
      </div>
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <h2 className="font-display text-[17px] leading-snug wrap-anywhere text-stone-900">
          {/* after:absolute inset-0 makes this link cover the whole card. */}
          <Link to={`/shop/${listing.id}`} className="after:absolute after:inset-0 focus-visible:outline-none">
            {listing.title}
          </Link>
        </h2>
        <p className="mt-1 font-semibold text-stone-900">{listing.price} kr</p>
        <p className="mt-0.5 truncate text-xs text-stone-500">
          {labelFor(listingConditions, listing.condition)} · @{listing.seller?.username ?? 'deleted'}
        </p>
        {/* mt-auto pins the action to the bottom so buttons line up across cards with 1- and 2-line titles. */}
        <div className="mt-auto pt-3">
          {action ?? (
            // Only a visual cue: the stretched title link already handles the click.
            <span
              aria-hidden="true"
              className="block rounded-lg border border-stone-300 bg-white py-2 text-center text-sm font-medium text-forest-800 transition-colors group-hover:border-forest-700"
            >
              View listing
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
