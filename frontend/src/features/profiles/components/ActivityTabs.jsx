// The "Activity" chip row on the profile (My posts · Saved · Listings). The choice lives in the URL
// (?tab=value), so it survives refresh and back; switching tabs drops ?page= so each tab starts on page 1.
import { FilterChipLink } from '../../../components/common/FilterChipLink'
import { activityTabs } from '../activityTabs'

export function ActivityTabs({ activeTab }) {
  return (
    // Scrolls sideways on phones instead of wrapping into several rows.
    <nav aria-label="Profile activity" className="-mx-4 overflow-x-auto px-4">
      <ul className="flex gap-2 pb-1">
        {activityTabs.map(({ value, label }) => (
          <li key={value} className="shrink-0">
            <FilterChipLink to={value === 'posts' ? '/profile' : `/profile?tab=${value}`} isActive={value === activeTab}>
              {label}
            </FilterChipLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
