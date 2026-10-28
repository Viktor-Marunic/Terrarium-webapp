// Row of category chips ("All" + one per category). The choice lives in the URL (?category=value),
// like CommunityFilter, so it survives refresh and back.
import { FilterChipLink } from '../../../components/common/FilterChipLink'
import { listingCategories } from '../schemas'

export function CategoryFilter({ activeCategory }) {
  return (
    // Scrolls sideways on phones instead of wrapping into several rows.
    <nav aria-label="Filter by category" className="-mx-4 overflow-x-auto px-4">
      <ul className="flex gap-2 pb-1">
        <li className="shrink-0">
          <FilterChipLink to="/shop" isActive={!activeCategory}>
            All
          </FilterChipLink>
        </li>
        {listingCategories.map(({ value, label }) => (
          <li key={value} className="shrink-0">
            <FilterChipLink to={`/shop?category=${value}`} isActive={value === activeCategory}>
              {label}
            </FilterChipLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
