// Row of filter chips ("All" + one per community). The choice lives in the URL (?c=slug) so it survives refresh and back.
// Chips keep the current sort, so switching community doesn't reset New/Top. Same chip as the shop and events filters.
import { FilterChipLink } from '../../../components/common/FilterChipLink'
import { feedPath } from '../../../lib/utils'

export function CommunityFilter({ communities, activeSlug, sort }) {
  return (
    // Scrolls sideways on phones instead of wrapping into several rows.
    <nav aria-label="Filter by community" className="-mx-4 overflow-x-auto px-4">
      <ul className="flex gap-2 pb-1">
        <li className="shrink-0">
          <FilterChipLink to={feedPath(null, sort)} isActive={!activeSlug}>
            All
          </FilterChipLink>
        </li>
        {communities.map((community) => (
          <li key={community.id} className="shrink-0">
            <FilterChipLink to={feedPath(community.slug, sort)} isActive={community.slug === activeSlug}>
              {community.name}
            </FilterChipLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
