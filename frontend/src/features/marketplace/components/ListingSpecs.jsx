// Label/value table on the product page (the mockup's Size/Includes/Condition/Delivery box),
// filled with the fields a listing actually has.
import { labelFor, listingCategories, listingConditions } from '../schemas'

export function ListingSpecs({ listing }) {
  const rows = [
    ['Category', labelFor(listingCategories, listing.category)],
    ['Condition', labelFor(listingConditions, listing.condition)],
    ['Status', listing.status === 'sold' ? 'Sold' : 'Available'],
  ]

  return (
    <dl className="divide-y divide-stone-200 rounded-xl border border-stone-200 bg-paper px-4">
      {rows.map(([term, value]) => (
        <div key={term} className="flex justify-between gap-4 py-3 text-sm">
          <dt className="text-stone-500">{term}</dt>
          <dd className="text-right text-stone-900">{value}</dd>
        </div>
      ))}
    </dl>
  )
}
