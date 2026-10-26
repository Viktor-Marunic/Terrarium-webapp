// "New / Top" switch for the feed. Like the community filter, the choice lives in the URL (?sort=top).
import { Link } from 'react-router-dom'
import { feedPath } from '../../../lib/utils'

const options = [
  { value: 'new', label: 'New' },
  { value: 'top', label: 'Top' },
]

export function SortToggle({ communitySlug, sort }) {
  return (
    <nav aria-label="Sort posts" className="flex gap-1 rounded-lg bg-stone-200 p-1 text-sm font-medium">
      {options.map((option) => {
        const isActive = option.value === sort
        return (
          <Link
            key={option.value}
            to={feedPath(communitySlug, option.value)}
            aria-current={isActive ? 'page' : undefined}
            className={`flex-1 rounded-md px-3 py-1 text-center transition-colors ${
              isActive ? 'bg-white text-emerald-800 shadow-sm' : 'text-stone-600 hover:text-stone-800'
            }`}
          >
            {option.label}
          </Link>
        )
      })}
    </nav>
  )
}
