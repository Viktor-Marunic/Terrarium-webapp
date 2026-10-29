// Top bar from the TerraSpace mockup: logo, notifications bell, shopping bag and avatar on the first row,
// text tabs underneath. The same layout on every screen size, so phones get the tabs at the top.
// One shared underline slides to the active tab, so switching tabs shows where you went.
import { useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { PlantIcon } from '@phosphor-icons/react'
import { DURATION, gsap, prefersReducedMotion, useGSAP } from '../../lib/motion'
import { MyAvatarIcon } from '../../features/profiles/components/MyAvatarIcon'
import { NotificationsButton } from '../../features/notifications/components/NotificationsButton'
import { CartButton } from '../../features/cart/components/CartButton'
import { navItems } from './navItems'

const INDICATOR_WIDTH = 24

/** Slides the shared underline under the active tab (NavLink marks it aria-current="page"). */
function useTabIndicator(navRef, indicatorRef) {
  const { pathname } = useLocation()

  useGSAP(
    () => {
      const place = (allowMotion) => {
        const nav = navRef.current
        const indicator = indicatorRef.current
        const active = nav.querySelector('a[aria-current="page"]')
        // No tab is active on e.g. /profile: fade the underline out instead of leaving it somewhere wrong.
        if (!active) return gsap.to(indicator, { opacity: 0, duration: DURATION.small })
        const tab = active.getBoundingClientRect()
        const x = tab.left - nav.getBoundingClientRect().left + tab.width / 2 - INDICATOR_WIDTH / 2
        // Slide only if it was already visible; on first load (or coming back from /profile) it just appears.
        const wasVisible = Number(gsap.getProperty(indicator, 'opacity')) > 0
        if (allowMotion && wasVisible && !prefersReducedMotion()) {
          // Stretches wide while it travels, then snaps back to size with a wobble.
          gsap
            .timeline({ defaults: { overwrite: 'auto' } })
            .to(indicator, { x, opacity: 1, duration: 0.45, ease: 'ui-in-out' }, 0)
            .to(indicator, { scaleX: 3.5, duration: 0.2, ease: 'power2.out' }, 0)
            .to(indicator, { scaleX: 1, duration: 0.6, ease: 'elastic.out(1, 0.4)' }, 0.2)
        } else {
          gsap.set(indicator, { x, opacity: 1 })
        }
      }
      place(true)
      // Tab widths change with the window (equal-width tabs on phones), so re-measure without animating.
      const onResize = () => place(false)
      window.addEventListener('resize', onResize)
      return () => window.removeEventListener('resize', onResize)
    },
    { dependencies: [pathname] },
  )
}

export function Header() {
  const navRef = useRef(null)
  const indicatorRef = useRef(null)
  useTabIndicator(navRef, indicatorRef)

  return (
    // Top padding keeps the logo below the notch when the app runs full-screen (viewport-fit=cover in index.html).
    <header className="sticky top-0 z-30 border-b border-stone-200 bg-paper pt-[env(safe-area-inset-top)]">
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
        <nav ref={navRef} aria-label="Main" className="relative">
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
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
          {/* The one short underline (mockup), moved under the active tab by useTabIndicator. */}
          <span
            ref={indicatorRef}
            aria-hidden="true"
            style={{ width: INDICATOR_WIDTH }}
            className="pointer-events-none absolute bottom-1.5 left-0 h-0.5 rounded-full bg-forest-800 opacity-0"
          />
        </nav>
      </div>
    </header>
  )
}
