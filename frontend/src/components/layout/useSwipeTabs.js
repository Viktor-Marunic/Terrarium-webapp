// Hook (used by AppLayout): swipe left/right on a main tab page (Community, Guides, Shop, Events) to go to the
// neighbouring tab. The page slides with the finger; let go past a quarter of the screen, or flick, and it
// slides off while the next tab slides in from that side (AppLayout's transition). Let go early and it slides
// back. Past the first/last tab it only rubber-bands. Plain slides only: no tilt, fade or bounce.
//
// Touch only (a mouse drag on desktop would fight text selection). Vertical swipes still scroll the page:
// the page element has touch-action pan-y, so the browser scrolls and cancels this gesture by itself.
// Ignored where sideways movement already means something: text fields, sideways-scrolling chip rows and
// anything marked data-no-swipe (the listing photo gallery). Reduced motion: navigates without the drag motion.
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { gsap, prefersReducedMotion } from '../../lib/motion'
import { navItems } from './navItems'

const START_DISTANCE = 12 // px of sideways movement before we treat the touch as a swipe
const SWIPE_DISTANCE = 0.25 // share of the screen width that counts as a swipe on release
const FLICK_VELOCITY = 0.5 // px per ms that counts as a flick even if it's short

/** Position of a path in the main tabs, or -1 for any other page (post, listing, profile…). */
export function tabIndexOf(pathname) {
  return navItems.findIndex((item) => item.to === pathname)
}

export function useSwipeTabs(pageRef) {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  useEffect(() => {
    const page = pageRef.current
    const index = tabIndexOf(pathname)
    if (!page || index === -1) return

    let start = null // { x, y, time, id } while a finger is down
    let dragging = false
    let justSwiped = false

    const ignored = (target) =>
      target.closest('input, textarea, select, [contenteditable="true"], .overflow-x-auto, [data-no-swipe]')

    const springBack = () =>
      gsap.to(page, { x: 0, duration: 0.3, ease: 'ui-out', overwrite: true })

    const onDown = (event) => {
      if (event.pointerType !== 'touch' || ignored(event.target)) return
      start = { x: event.clientX, y: event.clientY, time: Date.now(), id: event.pointerId }
      dragging = false
    }

    const onMove = (event) => {
      if (!start || event.pointerId !== start.id) return
      const dx = event.clientX - start.x
      const dy = event.clientY - start.y
      if (!dragging) {
        if (Math.abs(dx) < START_DISTANCE) return
        // Mostly vertical: it's a scroll, not a swipe.
        if (Math.abs(dy) > Math.abs(dx)) {
          start = null
          return
        }
        dragging = true
      }
      if (prefersReducedMotion()) return
      // Full movement towards an existing neighbour; heavy resistance past the first/last tab.
      const hasNeighbour = dx < 0 ? index < navItems.length - 1 : index > 0
      const move = dx * (hasNeighbour ? 0.85 : 0.25)
      gsap.set(page, { x: move })
    }

    const onUp = (event) => {
      if (!start || event.pointerId !== start.id) return
      const swipe = { dx: event.clientX - start.x, time: Date.now() - start.time }
      start = null
      if (!dragging) return
      dragging = false
      // The finger lifting after a drag would otherwise "click" whatever card it ended on.
      justSwiped = true
      setTimeout(() => (justSwiped = false), 0)

      const direction = swipe.dx < 0 ? 1 : -1 // swipe left = next tab
      const target = navItems[index + direction]
      const velocity = Math.abs(swipe.dx) / Math.max(swipe.time, 1)
      if (!target || (Math.abs(swipe.dx) < window.innerWidth * SWIPE_DISTANCE && velocity < FLICK_VELOCITY)) {
        springBack()
        return
      }
      if (prefersReducedMotion()) {
        navigate(target.to)
        return
      }
      gsap.to(page, {
        x: -direction * window.innerWidth,
        duration: 0.2, ease: 'power1.in', overwrite: true,
        onComplete: () => navigate(target.to),
      })
    }

    // The browser took the touch over (vertical scroll): put the page back.
    const onCancel = () => {
      if (dragging) springBack()
      start = null
      dragging = false
    }

    const swallowClick = (event) => {
      if (!justSwiped) return
      event.preventDefault()
      event.stopPropagation()
    }

    page.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onCancel)
    page.addEventListener('click', swallowClick, true)
    return () => {
      page.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onCancel)
      page.removeEventListener('click', swallowClick, true)
    }
  }, [pageRef, pathname, navigate])
}
