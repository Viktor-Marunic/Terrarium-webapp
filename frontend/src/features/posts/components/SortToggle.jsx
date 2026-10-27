// "Latest discussions / Popular" chips for the feed (TerraSpace Figma). Like the community filter, the choice lives
// in the URL (?sort=top), so it survives refresh and back.
import { Link } from 'react-router-dom'
import { feedPath } from '../../../lib/utils'

const options = [
  { value: 'new', label: 'Latest discussions' },
  { value: 'top', label: 'Popular' },
]

export function SortToggle({ communitySlug, sort }) {
  return (
    <nav aria-label="Sort posts">
      <ul className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = option.value === sort
          return (
            <li key={option.value}>
              <Link
                to={feedPath(communitySlug, option.value)}
                aria-current={isActive ? 'page' : undefined}
                className={`block rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-forest-700 bg-forest-700 text-white'
                    : 'border-stone-300 bg-paper text-stone-700 hover:bg-white'
                }`}
              >
                {option.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
