// One listing in the shop grid: cover photo, title, price, condition + seller. The whole card opens the product page
// (the title link is stretched over the card, like PostCard). Deliberately no "Add to bag": the marketplace has no cart.
import { Link } from 'react-router-dom'
import { labelFor, listingConditions } from '../schemas'
import { ListingImage } from './ListingImage'

export function ListingCard({ listing }) {
  return (
    <article className="relative flex w-full flex-col overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="aspect-[4/3]">
        <ListingImage src={listing.image_urls[0]} />
      </div>
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <h2 className="font-medium break-words text-stone-900">
          {/* after:absolute inset-0 makes this link cover the whole card. */}
          <Link to={`/shop/${listing.id}`} className="after:absolute after:inset-0">
            {listing.title}
          </Link>
        </h2>
        <p className="mt-1 font-semibold text-stone-900">{listing.price} kr</p>
        <p className="mt-0.5 text-xs text-stone-500">
          {labelFor(listingConditions, listing.condition)} · @{listing.seller?.username ?? 'deleted'}
        </p>
      </div>
    </article>
  )
}
