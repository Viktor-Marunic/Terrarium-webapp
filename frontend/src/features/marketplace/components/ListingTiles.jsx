// A profile's listings as a card grid (the profile "Listings" and "Saved" tabs): one seller's, or a set of ids.
// Includes sold listings, marked with a "Sold" tag on the photo; loading, error and empty states included.
import { useProfileListings } from '../hooks'
import { ListingCard } from './ListingCard'

export function ListingTiles({ sellerId, ids, emptyText }) {
  const listings = useProfileListings({ sellerId, ids })

  if (listings.isLoading) return <p className="text-stone-500">Loading listings…</p>
  if (listings.error) return <p className="text-red-600">Could not load listings: {listings.error.message}</p>
  if (!listings.data?.length) return <p className="text-stone-500">{emptyText}</p>

  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
      {listings.data.map((listing) => (
        <li key={listing.id} className="flex min-w-0">
          <ListingCard
            listing={listing}
            imageOverlay={
              listing.status === 'sold' && (
                <span className="rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-stone-700 shadow-sm">Sold</span>
              )
            }
          />
        </li>
      ))}
    </ul>
  )
}
