// Row of category chips ("All" + one per category). The choice lives in the URL (?category=value),
// like CommunityFilter, so it survives refresh and back. Chip styling matches CommunityFilter;
// if a third filter row appears, move the chip into components/common.
import { Link } from 'react-router-dom'
import { listingCategories } from '../schemas'

function chipClass(isActive) {
  return `shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
    isActive
      ? 'border-emerald-700 bg-emerald-700 text-white'
      : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-50'
  }`
}

export function CategoryFilter({ activeCategory }) {
  return (
    // Scrolls sideways on phones instead of wrapping into several rows.
    <nav aria-label="Filter by category" className="-mx-4 overflow-x-auto px-4">
      <ul className="flex gap-2 pb-1">
        <li>
          <Link to="/shop" className={chipClass(!activeCategory)} aria-current={!activeCategory ? 'page' : undefined}>
            All
          </Link>
        </li>
        {listingCategories.map(({ value, label }) => {
          const isActive = value === activeCategory
          return (
            <li key={value}>
              <Link to={`/shop?category=${value}`} className={chipClass(isActive)} aria-current={isActive ? 'page' : undefined}>
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
