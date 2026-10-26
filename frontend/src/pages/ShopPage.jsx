// /shop — marketplace for terrarium supplies (lowest priority feature; a bag but no checkout or payments).
// Active listings in a grid, filterable with ?category=<value>, plus the way into the sell form.
// Composes three features: marketplace cards get the bookmark heart and "Add to bag" from this page.
import { Link, useSearchParams } from 'react-router-dom'
import { TagIcon } from '@phosphor-icons/react'
import { useSession } from '../features/auth/hooks'
import { listingCategories } from '../features/marketplace/schemas'
import { CategoryFilter } from '../features/marketplace/components/CategoryFilter'
import { ListingGrid } from '../features/marketplace/components/ListingGrid'
import { BookmarkButton } from '../features/bookmarks/components/BookmarkButton'
import { AddToBagButton } from '../features/cart/components/AddToBagButton'

export function ShopPage() {
  const { session } = useSession()
  const [searchParams] = useSearchParams()
  // An unknown category (e.g. a typo in the URL) falls back to showing everything.
  const category = listingCategories.find(({ value }) => value === searchParams.get('category'))?.value

  return (
    <div className="space-y-5">
      {/* flex-wrap: on very narrow phones (~320px) the button drops under the heading instead of overflowing. */}
      <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <h1 className="font-display text-3xl text-forest-800">Marketplace</h1>
        <Link
          to="/shop/new"
          className="flex shrink-0 items-center gap-2 rounded-lg bg-forest-700 px-4 py-2.5 text-sm font-medium text-white transition-[background-color,scale] hover:bg-forest-800 motion-safe:active:scale-[0.97]"
        >
          <TagIcon size={18} aria-hidden="true" />
          Sell an item
        </Link>
      </header>
      <CategoryFilter activeCategory={category} />
      <ListingGrid
        category={category}
        renderImageOverlay={(listing) => <BookmarkButton listingId={listing.id} />}
        // Sellers can't put their own listing in the bag (the database refuses it too), so they get the "View listing" cue.
        renderAction={(listing) =>
          listing.seller_id === session?.user.id ? null : <AddToBagButton listingId={listing.id} variant="card" />
        }
      />
    </div>
  )
}
