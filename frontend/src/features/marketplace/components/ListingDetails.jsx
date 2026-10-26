// Product page info column, in the mockup's order: title, price and summary line; the actions
// (add to bag + contact for other users, owner actions for the seller); "About this item"; specs table; seller card.
import { labelFor, listingCategories, listingConditions } from '../schemas'
import { ContactSeller } from './ContactSeller'
import { ListingOwnerActions } from './ListingOwnerActions'
import { ListingSpecs } from './ListingSpecs'
import { SellerCard } from './SellerCard'

// `buyAction` ("Add to bag", passed in by the page) is shown above "Contact seller" for other users' active listings.
export function ListingDetails({ listing, isOwner, buyAction }) {
  const isSold = listing.status === 'sold'
  const sellerUsername = listing.seller?.username ?? 'deleted'

  return (
    <div className="min-w-0 space-y-6">
      <div>
        <h1 className="font-display text-[26px] leading-tight wrap-anywhere text-forest-800">{listing.title}</h1>
        <p className="mt-2 flex items-center gap-2 text-xl font-bold text-stone-900">
          {listing.price} kr
          {isSold && <span className="rounded-full bg-stone-200 px-2.5 py-0.5 text-xs font-semibold text-stone-700">Sold</span>}
        </p>
        <p className="mt-1 text-sm text-stone-500">
          {labelFor(listingConditions, listing.condition)} · {labelFor(listingCategories, listing.category)}
        </p>
      </div>

      {isOwner ? (
        <ListingOwnerActions listing={listing} />
      ) : isSold ? (
        <p className="rounded-lg bg-stone-100 p-3 text-sm text-stone-600">This item has been sold.</p>
      ) : (
        // Primary + secondary pair, like the mockup's "Add to bag" / "Message seller".
        <div className="space-y-2">
          {buyAction}
          <ContactSeller contactInfo={listing.contact_info} sellerUsername={sellerUsername} />
        </div>
      )}

      {listing.description && (
        <section>
          <h2 className="font-display text-xl text-forest-800">About this item</h2>
          <p className="mt-2 leading-relaxed wrap-anywhere whitespace-pre-line text-stone-600">{listing.description}</p>
        </section>
      )}

      <ListingSpecs listing={listing} />
      <SellerCard username={sellerUsername} listedAt={listing.created_at} />
    </div>
  )
}
