// /shop/:id — one listing (product page): photos on the left, details and contact/owner actions on the right.
import { Link, useParams } from 'react-router-dom'
import { ArrowLeftIcon } from '@phosphor-icons/react'
import { useSession } from '../features/auth/hooks'
import { useListing } from '../features/marketplace/hooks'
import { ListingGallery } from '../features/marketplace/components/ListingGallery'
import { ListingDetails } from '../features/marketplace/components/ListingDetails'

export function ListingPage() {
  const { id } = useParams()
  const { session } = useSession()
  const listing = useListing(id)

  const backLink = (
    <Link to="/shop" className="inline-flex items-center gap-1 text-sm text-stone-600 hover:text-emerald-700">
      <ArrowLeftIcon size={16} aria-hidden="true" />
      Back to marketplace
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
      <div className="grid gap-6 md:grid-cols-2">
        <ListingGallery imageUrls={listing.data.image_urls} title={listing.data.title} />
        <ListingDetails listing={listing.data} isOwner={isOwner} />
      </div>
    </div>
  )
}
