// Top bar: logo on every screen size, nav links only from md up (phones use BottomNav instead).
import { Link, NavLink } from 'react-router-dom'
import { LeafIcon } from '@phosphor-icons/react'
import { navItems } from './navItems'

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-stone-200 bg-white">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-emerald-800">
          <LeafIcon size={24} weight="fill" aria-hidden="true" />
          Terrarium
        </Link>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex gap-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      isActive ? 'bg-emerald-50 text-emerald-800' : 'text-stone-600 hover:bg-stone-100'
                    }`
                  }
                >
                  <Icon size={20} aria-hidden="true" />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
