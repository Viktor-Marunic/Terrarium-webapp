// "Latest discussions / Popular" chips for the feed (TerraSpace Figma). Like the community filter, the choice lives
// in the URL (?sort=top), so it survives refresh and back. Same chip as the other filter rows.
import { FilterChipLink } from '../../../components/common/FilterChipLink'
import { feedPath } from '../../../lib/utils'

const options = [
  { value: 'new', label: 'Latest discussions' },
  { value: 'top', label: 'Popular' },
]

export function SortToggle({ communitySlug, sort }) {
  return (
    <nav aria-label="Sort posts">
      <ul className="flex flex-wrap gap-2">
        {options.map((option) => (
          <li key={option.value}>
            <FilterChipLink to={feedPath(communitySlug, option.value)} isActive={option.value === sort}>
              {option.label}
            </FilterChipLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
