// Row of filter chips ("All" + one per community). The choice lives in the URL (?c=slug) so it survives refresh and back.
import { Link } from 'react-router-dom'

function chipClass(isActive) {
  return `shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
    isActive
      ? 'border-emerald-700 bg-emerald-700 text-white'
      : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-50'
  }`
}

export function CommunityFilter({ communities, activeSlug }) {
  return (
    // Scrolls sideways on phones instead of wrapping into several rows.
    <nav aria-label="Filter by community" className="-mx-4 overflow-x-auto px-4">
      <ul className="flex gap-2 pb-1">
        <li>
          <Link to="/communities" className={chipClass(!activeSlug)} aria-current={!activeSlug ? 'page' : undefined}>
            All
          </Link>
        </li>
        {communities.map((community) => {
          const isActive = community.slug === activeSlug
          return (
            <li key={community.id}>
              <Link
                to={`/communities?c=${community.slug}`}
                className={chipClass(isActive)}
                aria-current={isActive ? 'page' : undefined}
              >
                {community.name}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
