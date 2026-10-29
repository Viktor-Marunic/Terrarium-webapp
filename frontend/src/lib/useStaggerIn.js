// Hook: list items fade in and out as they scroll (feeds, grids, profile tabs, achievements).
//
// Scroll-linked (default, for lists on the page): each item fades and rises in as it enters from the bottom of
// the screen, and fades and lifts out as it scrolls up under the header, in both directions, following the
// finger (GSAP ScrollTrigger with scrub). The fade-in runs on the item (<li>) and the fade-out on its content
// (the card), so the two never fight over the same element.
//
// One-time (scrollLinked: false, for the bag and notification panels, which scroll inside their own box):
// items rise in once as a staggered wave when they appear.
//
// Either way it's decoration: items are clickable the whole time. Reduced motion: nothing moves.
import { useRef } from 'react'
import { ScrollTrigger, gsap, prefersReducedMotion, useGSAP } from './motion'

// How far (px) an item travels and how far it tilts (degrees, in 3D) while fading; and where the fades happen
// relative to the screen edges. No scale here on purpose: tap feedback morphs cards with scaleX/scaleY, and
// keeping the two on different properties means a press can never cancel a card's scroll fade.
const TRAVEL = 70
const TILT = 18
const FADE_IN = { start: 'top bottom', end: 'top bottom-=140' } // its first 140px coming into view
const FADE_OUT = { start: 'bottom top+=260', end: 'bottom top+=110' } // as it slides under the sticky header

/**
 * Returns a ref for the list element; its direct children are the items. `deps` should change when the
 * items do (e.g. the data array), so new items get picked up.
 */
export function useStaggerIn(deps = [], { scrollLinked = true } = {}) {
  const listRef = useRef(null)

  useGSAP(
    () => {
      const list = listRef.current
      if (!list || prefersReducedMotion()) return
      // Cards replaced by a new page of results leave triggers pointing at removed elements; drop those.
      ScrollTrigger.getAll().forEach((trigger) => trigger.trigger?.isConnected === false && trigger.kill())
      const items = [...list.children].filter((item) => !item.dataset.animated)
      if (items.length === 0) return
      items.forEach((item) => (item.dataset.animated = 'true'))
      // Runs when the list unmounts (all its animations are reverted then), including StrictMode's dev
      // test-unmount, so a remount sets everything up again instead of skipping "already animated" items.
      const unmark = () => items.forEach((item) => delete item.dataset.animated)

      if (!scrollLinked) {
        gsap.from(items, {
          opacity: 0, y: 50, scale: 0.85, duration: 0.6, ease: 'back.out(1.6)',
          stagger: { amount: Math.min(0.5, (items.length - 1) * 0.08) },
          clearProps: 'transform,opacity',
        })
        return unmark
      }

      items.forEach((item) => {
        // In: rises from below, tipped back in 3D, and swings upright as it arrives.
        gsap.fromTo(
          item,
          { opacity: 0, y: TRAVEL, rotationX: -TILT, transformPerspective: 700, transformOrigin: '50% 100%' },
          { opacity: 1, y: 0, rotationX: 0, ease: 'power2.out', scrollTrigger: { trigger: item, ...FADE_IN, scrub: 0.5 } },
        )
        // Out: lifts away and tips forward as it slides under the header.
        gsap.fromTo(
          item.firstElementChild ?? item,
          { opacity: 1, y: 0, rotationX: 0, transformPerspective: 700, transformOrigin: '50% 0%' },
          {
            opacity: 0, y: -TRAVEL, rotationX: TILT, ease: 'power2.in', immediateRender: false,
            scrollTrigger: { trigger: item, ...FADE_OUT, scrub: 0.5 },
          },
        )
      })
      // New items change the page height, so every trigger re-measures where it starts and ends.
      ScrollTrigger.refresh()
      return unmark
    },
    // revertOnUpdate: false keeps the triggers of items already set up when new ones arrive ("Load more").
    { scope: listRef, dependencies: deps, revertOnUpdate: false },
  )

  return listRef
}
