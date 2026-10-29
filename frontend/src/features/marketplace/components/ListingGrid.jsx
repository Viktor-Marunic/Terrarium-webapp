// Grid of active listings (all, or one category) with loading, error and empty states,
// plus "Showing X of Y" and a "Load more listings" button that fetches the next page.
// renderImageOverlay(listing) / renderAction(listing) fill ListingCard's slots (see ListingCard).
import { useListings } from '../hooks'
import { ListingCard } from './ListingCard'
import { useStaggerIn } from '../../../lib/useStaggerIn'

export function ListingGrid({ category, renderImageOverlay, renderAction }) {
  const listings = useListings(category)
  // Cards rise in one after another when they appear (before the early returns: hooks run every render).
  const listRef = useStaggerIn([listings.data])

  if (listings.isLoading) return <p className="text-stone-500">Loading listings…</p>
  if (listings.error) return <p className="text-red-600">Could not load listings: {listings.error.message}</p>

  const items = listings.data.pages.flatMap((page) => page.listings)
  const totalCount = listings.data.pages[0].totalCount
  if (items.length === 0) {
    return <p className="text-stone-500">No listings here yet. Be the first to sell something!</p>
  }

  return (
    <>
      {/* Two columns even on phones, like the mockup; three from md up. */}
      <ul ref={listRef} className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
        {items.map((listing) => (
          // flex so every card stretches to the tallest card in its row.
          <li key={listing.id} className="flex min-w-0">
            <ListingCard listing={listing} imageOverlay={renderImageOverlay?.(listing)} action={renderAction?.(listing)} />
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between gap-4 pt-2">
        <p className="text-sm text-stone-500">
          Showing {items.length} of {totalCount} listings
        </p>
        {listings.hasNextPage && (
          <button
            type="button"
            onClick={() => listings.fetchNextPage()}
            disabled={listings.isFetchingNextPage}
            className="rounded-lg border border-stone-300 bg-paper px-4 py-2.5 text-sm font-medium text-forest-800 transition-colors hover:border-forest-700 hover:bg-white disabled:opacity-60"
          >
            {listings.isFetchingNextPage ? 'Loading…' : 'Load more listings'}
          </button>
        )}
      </div>
      {listings.isFetchNextPageError && <p className="text-sm text-red-600">Could not load more listings. Try again.</p>}
    </>
  )
}
