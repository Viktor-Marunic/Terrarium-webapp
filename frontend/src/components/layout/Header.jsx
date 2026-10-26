// Top bar from the TerraSpace mockup: logo, notifications bell, shopping bag and avatar on the first row,
// text tabs underneath. The same layout on every screen size, so phones get the tabs at the top.
import { Link, NavLink } from 'react-router-dom'
import { PlantIcon } from '@phosphor-icons/react'
import { MyAvatarIcon } from '../../features/profiles/components/MyAvatarIcon'
import { NotificationsButton } from '../../features/notifications/components/NotificationsButton'
import { CartButton } from '../../features/cart/components/CartButton'
import { navItems } from './navItems'

export function Header() {
  return (
    // Top padding keeps the logo below the notch when the app runs full-screen (viewport-fit=cover in index.html).
    <header className="sticky top-0 z-10 border-b border-stone-200 bg-paper pt-[env(safe-area-inset-top)]">
      <div className="mx-auto max-w-5xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Slightly smaller below sm so logo, bell, bag and avatar still fit side by side on 320px phones. */}
          <Link to="/" className="flex min-w-0 items-center gap-1.5 text-forest-800 sm:gap-2">
            <PlantIcon size={26} className="shrink-0" aria-hidden="true" />
            <span className="font-display text-xl sm:text-2xl">TerraSpace</span>
          </Link>
          <div className="flex items-center gap-1">
            <NotificationsButton />
            <CartButton />
            <NavLink to="/profile" aria-label="Your profile" className="flex size-10 items-center justify-center rounded-full">
              {({ isActive }) => <MyAvatarIcon size={36} weight={isActive ? 'fill' : 'regular'} />}
            </NavLink>
          </div>
        </div>
        <nav aria-label="Main">
          {/* Equal-width tabs on phones; natural width from md up, pulled left so the first label lines up with the logo. */}
          <ul className="flex md:-ml-3 md:gap-2">
            {navItems.map(({ to, label }) => (
              <li key={to} className="flex-1 md:flex-none">
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `relative block px-3 pt-1 pb-3 text-center text-sm transition-colors ${
                      isActive ? 'font-semibold text-forest-800' : 'text-stone-500 hover:text-stone-800'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {label}
                      {/* Short underline under the active tab, like the mockup. */}
                      {isActive && (
                        <span aria-hidden="true" className="absolute bottom-1.5 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-forest-800" />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
