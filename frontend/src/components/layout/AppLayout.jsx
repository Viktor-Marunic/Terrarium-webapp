// Shell around every logged-in page: header with tabs on top, page content, footer at the bottom.
// Page changes animate in: between the main tabs the new page slides in from the side it lives on (left or
// right, matching the tab order and the swipe gesture from useSwipeTabs); any other page change rises in.
import { useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { DURATION, gsap, prefersReducedMotion, useGSAP } from '../../lib/motion'
import { Header } from './Header'
import { Footer } from './Footer'
import { tabIndexOf, useSwipeTabs } from './useSwipeTabs'

export function AppLayout() {
  const { pathname } = useLocation()
  const pageRef = useRef(null)
  const previousPath = useRef(pathname)
  useSwipeTabs(pageRef)

  // Keyed on the path only: changing filters, tabs or the page number (?query) is not a new page.
  useGSAP(
    () => {
      const page = pageRef.current
      // A swipe leaves the old page flown off to the side; start the new one from a clean slate.
      gsap.killTweensOf(page)
      gsap.set(page, { clearProps: 'transform,opacity' })
      const from = tabIndexOf(previousPath.current)
      const to = tabIndexOf(pathname)
      previousPath.current = pathname

      if (prefersReducedMotion()) {
        gsap.from(page, { opacity: 0, duration: DURATION.small, ease: 'ui-out', clearProps: 'opacity' })
        return
      }
      if (from !== -1 && to !== -1 && from !== to) {
        // Next tab comes in from the right, previous tab from the left.
        const side = to > from ? 1 : -1
        gsap.from(page, {
          x: side * 140, rotation: side * 4, opacity: 0, duration: 0.5, ease: 'back.out(1.3)', clearProps: 'transform,opacity',
        })
        return
      }
      gsap.from(page, { opacity: 0, y: 40, scale: 0.94, duration: 0.45, ease: 'back.out(1.4)', clearProps: 'transform,opacity' })
    },
    { dependencies: [pathname] },
  )

  return (
    // Column flex + flex-1 on main keeps the footer at the bottom of the screen even on short pages.
    // overflow-x-clip is a safety net: nothing a user types can make the page scroll sideways on a phone
    // (clip, unlike hidden, keeps the sticky header working). It also hides a page while it's swiped aside.
    <div className="flex min-h-svh flex-col overflow-x-clip bg-cream">
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pt-6 pb-12">
        {/* pan-y + pinch-zoom: the browser keeps vertical scrolling and zoom; sideways drags go to useSwipeTabs. */}
        <div ref={pageRef} className="touch-pan-y touch-pinch-zoom">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  )
}
