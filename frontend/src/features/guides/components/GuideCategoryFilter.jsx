// Row of guide category chips ("All guides" + each category). The choice lives in the URL (?category=value).
import { FilterChipLink } from '../../../components/common/FilterChipLink'
import { guideCategories } from '../schemas'

export function GuideCategoryFilter({ activeCategory }) {
  return (
    // Scrolls sideways on phones instead of wrapping into several rows.
    <nav aria-label="Filter by category" className="-mx-4 overflow-x-auto px-4">
      <ul className="flex gap-2 pb-1">
        <li className="shrink-0">
          <FilterChipLink to="/guide" isActive={!activeCategory}>
            All guides
          </FilterChipLink>
        </li>
        {guideCategories.map(({ value, label }) => (
          <li key={value} className="shrink-0">
            <FilterChipLink to={`/guide?category=${value}`} isActive={value === activeCategory}>
              {label}
            </FilterChipLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
