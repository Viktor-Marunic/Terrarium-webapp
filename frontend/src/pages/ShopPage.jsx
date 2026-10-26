// /shop — marketplace for terrarium supplies (lowest priority feature, no payments, cart or checkout).
// Active listings in a grid, filterable with ?category=<value>, plus the way into the sell form.
import { Link, useSearchParams } from 'react-router-dom'
import { TagIcon } from '@phosphor-icons/react'
import { listingCategories } from '../features/marketplace/schemas'
import { CategoryFilter } from '../features/marketplace/components/CategoryFilter'
import { ListingGrid } from '../features/marketplace/components/ListingGrid'

export function ShopPage() {
  const [searchParams] = useSearchParams()
  // An unknown category (e.g. a typo in the URL) falls back to showing everything.
  const category = listingCategories.find(({ value }) => value === searchParams.get('category'))?.value

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold text-stone-800">Marketplace</h1>
        <Link
          to="/shop/new"
          className="flex items-center gap-2 rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
        >
          <TagIcon size={18} aria-hidden="true" />
          Sell an item
        </Link>
      </header>
      <CategoryFilter activeCategory={category} />
      <ListingGrid category={category} />
    </div>
  )
}
