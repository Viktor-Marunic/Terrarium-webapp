// Hook (used once, in App): makes every tap feel physical, with a squash-and-stretch morph. While the finger is
// down, the pressed thing squashes (wider and shorter); on release it stretches (taller and thinner) and then
// wobbles back to its shape elastically. One document-level listener instead of code in every button, so new
// buttons get it for free.
// Touch-first: it reacts to pointer presses, never to hover. Skipped entirely with reduced motion.
import { useEffect } from 'react'
import { gsap, prefersReducedMotion } from './motion'

// Checkbox/radio labels count (tapping them toggles something); text-field labels don't, or typing would squish the field.
const PRESSABLE =
  'button:not(:disabled), a[href], [role="button"], label:has(input[type="checkbox"]), label:has(input[type="radio"])'

// Squash (pressed) and stretch (just released) shapes. Cards morph less than buttons because they're much
// bigger: the same percentage on a full-width card moves a lot more pixels.
const SHAPES = {
  button: { squash: { scaleX: 1.08, scaleY: 0.86 }, stretch: { scaleX: 0.9, scaleY: 1.18 } },
  card: { squash: { scaleX: 1.03, scaleY: 0.95 }, stretch: { scaleX: 0.97, scaleY: 1.05 } },
}
const RESET = { scaleX: 1, scaleY: 1 }

/**
 * What to animate for a pressed element. A card's stretched title link (the `after:absolute` pattern) covers the
 * whole card, so pressing anywhere on the card animates the card itself.
 */
function pressTargetFor(pressable) {
  const card = pressable.closest('article')
  if (card && pressable.matches('a') && pressable.className.includes('after:absolute')) return card
  return pressable
}

export function useTapFeedback() {
  useEffect(() => {
    let pressed = null
    let shape = SHAPES.button

    const onDown = (event) => {
      if (event.button > 0 || prefersReducedMotion()) return
      const pressable = event.target.closest?.(PRESSABLE)
      if (!pressable) return
      pressed = pressTargetFor(pressable)
      shape = pressed.matches('article') ? SHAPES.card : SHAPES.button
      // Only scaleX/scaleY are touched (never overwrite or clearProps): cards also fade with scrolling, which
      // uses their y/rotation, and a press must not cancel or wipe that.
      gsap.killTweensOf(pressed, 'scaleX,scaleY')
      gsap.to(pressed, { ...shape.squash, duration: 0.12, ease: 'ui-out' })
    }

    // A real tap: stretch the other way, then wobble back into shape.
    const onUp = () => {
      if (!pressed) return
      gsap.killTweensOf(pressed, 'scaleX,scaleY')
      gsap
        .timeline()
        .to(pressed, { ...shape.stretch, duration: 0.12, ease: 'power2.out' })
        .to(pressed, { ...RESET, duration: 0.8, ease: 'elastic.out(1.2, 0.3)' })
      pressed = null
    }

    // The touch turned into a scroll: just go back to normal shape, no stretch (nothing was clicked).
    const onCancel = () => {
      if (!pressed) return
      gsap.killTweensOf(pressed, 'scaleX,scaleY')
      gsap.to(pressed, { ...RESET, duration: 0.25, ease: 'ui-out' })
      pressed = null
    }

    document.addEventListener('pointerdown', onDown, { passive: true })
    document.addEventListener('pointerup', onUp)
    document.addEventListener('pointercancel', onCancel)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('pointerup', onUp)
      document.removeEventListener('pointercancel', onCancel)
    }
  }, [])
}
