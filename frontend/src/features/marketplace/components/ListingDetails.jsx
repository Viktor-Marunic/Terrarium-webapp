// Product page info column: title, price, sold tag, category/condition/seller/age, description,
// and either the contact button (other users) or the owner actions (the seller).
import { formatDistanceToNow } from 'date-fns'
import { labelFor, listingCategories, listingConditions } from '../schemas'
import { ContactSeller } from './ContactSeller'
import { ListingOwnerActions } from './ListingOwnerActions'

export function ListingDetails({ listing, isOwner }) {
  const isSold = listing.status === 'sold'
  const sellerUsername = listing.seller?.username ?? 'deleted'

  return (
    <div className="space-y-4 rounded-lg bg-white p-4 shadow-sm">
      <div>
        <h1 className="text-xl font-semibold break-words text-stone-900">{listing.title}</h1>
        <p className="mt-1 flex items-center gap-2 text-lg font-semibold text-stone-900">
          {listing.price} kr
          {isSold && <span className="rounded-full bg-stone-200 px-2 py-0.5 text-xs font-medium text-stone-700">Sold</span>}
        </p>
      </div>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
        <dt className="text-stone-500">Category</dt>
        <dd className="text-stone-800">{labelFor(listingCategories, listing.category)}</dd>
        <dt className="text-stone-500">Condition</dt>
        <dd className="text-stone-800">{labelFor(listingConditions, listing.condition)}</dd>
        <dt className="text-stone-500">Seller</dt>
        <dd className="text-stone-800">@{sellerUsername}</dd>
        <dt className="text-stone-500">Listed</dt>
        <dd className="text-stone-800">
          <time dateTime={listing.created_at}>{formatDistanceToNow(new Date(listing.created_at), { addSuffix: true })}</time>
        </dd>
      </dl>
      {listing.description && (
        <p className="break-words whitespace-pre-line text-stone-800">{listing.description}</p>
      )}
      {isOwner ? (
        <ListingOwnerActions listing={listing} />
      ) : isSold ? (
        <p className="text-sm text-stone-500">This item has been sold.</p>
      ) : (
        <ContactSeller contactInfo={listing.contact_info} sellerUsername={sellerUsername} />
      )}
    </div>
  )
}
