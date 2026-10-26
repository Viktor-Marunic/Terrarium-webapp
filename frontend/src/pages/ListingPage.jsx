// /shop/:id — one listing (product page): photos first, then details and add-to-bag/contact/owner actions.
// Stacked on phones like the mockup; photos and details side by side from md up.
// Composes three features: the bookmark heart and "Add to bag" are passed into the marketplace components.
import { Link, useParams } from 'react-router-dom'
import { ArrowLeftIcon } from '@phosphor-icons/react'
import { useSession } from '../features/auth/hooks'
import { useListing } from '../features/marketplace/hooks'
import { ListingGallery } from '../features/marketplace/components/ListingGallery'
import { ListingDetails } from '../features/marketplace/components/ListingDetails'
import { BookmarkButton } from '../features/bookmarks/components/BookmarkButton'
import { AddToBagButton } from '../features/cart/components/AddToBagButton'
import { avatarSrc } from '../features/profiles/avatar'

export function ListingPage() {
  const { id } = useParams()
  const { session } = useSession()
  const listing = useListing(id)

  const backLink = (
    <Link to="/shop" className="inline-flex items-center gap-1.5 text-sm font-medium text-forest-700 hover:text-forest-800">
      <ArrowLeftIcon size={16} aria-hidden="true" />
      Marketplace
    </Link>
  )

  if (listing.isLoading) return <p className="text-stone-500">Loading listing…</p>
  if (listing.error) return <p className="text-red-600">Could not load listing: {listing.error.message}</p>
  if (!listing.data) {
    return (
      <div className="space-y-4">
        {backLink}
        <p className="text-stone-600">This listing doesn't exist or was deleted.</p>
      </div>
    )
  }

  // UI only; the database's RLS policies are what actually stop others from changing it.
  const isOwner = session?.user.id === listing.data.seller_id

  return (
    <div className="space-y-4">
      {backLink}
      {/* grid-cols-1 (not the default auto column) so one very long word can't stretch the page wider than the phone. */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
        <ListingGallery
          imageUrls={listing.data.image_urls}
          title={listing.data.title}
          overlay={<BookmarkButton listingId={listing.data.id} />}
        />
        <ListingDetails
          listing={listing.data}
          isOwner={isOwner}
          buyAction={<AddToBagButton listingId={listing.data.id} variant="primary" />}
          // Same picture as on their profile (uploaded avatar, or the one generated from their username).
          sellerAvatarSrc={listing.data.seller ? avatarSrc(listing.data.seller) : undefined}
        />
      </div>
    </div>
  )
}
