// Row of category chips ("All" + one per category). The choice lives in the URL (?category=value),
// like CommunityFilter, so it survives refresh and back. Styled after the marketplace mockup (forest/paper tokens).
import { Link } from 'react-router-dom'
import { listingCategories } from '../schemas'

function chipClass(isActive) {
  return `block shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
    isActive
      ? 'border-forest-700 bg-forest-700 text-white'
      : 'border-stone-300 bg-paper text-stone-700 hover:border-stone-400 hover:bg-white'
  }`
}

export function CategoryFilter({ activeCategory }) {
  return (
    // Scrolls sideways on phones instead of wrapping into several rows.
    <nav aria-label="Filter by category" className="-mx-4 overflow-x-auto px-4">
      <ul className="flex gap-2 pb-1">
        <li className="shrink-0">
          <Link to="/shop" className={chipClass(!activeCategory)} aria-current={!activeCategory ? 'page' : undefined}>
            All
          </Link>
        </li>
        {listingCategories.map(({ value, label }) => {
          const isActive = value === activeCategory
          return (
            <li key={value} className="shrink-0">
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
