// One rounded filter chip that is a router link (the filter lives in the URL, so it survives refresh and back).
// Shared by the marketplace category row and the events type row (TerraSpace mockup styling).
import { Link } from 'react-router-dom'

export function FilterChipLink({ to, isActive, children }) {
  return (
    <Link
      to={to}
      aria-current={isActive ? 'page' : undefined}
      className={`block shrink-0 rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
        isActive
          ? 'border-forest-700 bg-forest-700 text-white'
          : 'border-stone-300 bg-paper text-stone-700 hover:border-stone-400 hover:bg-white'
      }`}
    >
      {children}
    </Link>
  )
}
