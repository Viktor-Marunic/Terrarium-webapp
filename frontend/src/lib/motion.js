// Shared GSAP setup for the whole app: plugin registration, the motion curves and durations, and small
// one-shot effects (pop, burst, fly-to-bag, bump, wiggle, count-up). Components call these instead of
// inventing their own timings, so the app moves with one consistent "feel".
//
// Mobile-first: everything here is triggered by taps, swipes or data changes, never by hover.
// Reduced motion (project rule): every helper checks prefersReducedMotion() and keeps only gentle fades.
import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { Draggable } from 'gsap/Draggable'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP, CustomEase, Draggable, ScrollTrigger)

// Strong curves (Emil Kowalski's set); GSAP's built-in eases are too soft for UI.
CustomEase.create('ui-out', 'M0,0 C0.23,1 0.32,1 1,1') // entering / exiting
CustomEase.create('ui-in-out', 'M0,0 C0.77,0 0.175,1 1,1') // moving on screen (tab underline, photo slides)

/** Durations in seconds. UI motion stays under 0.3s; only rare "delight" moments go longer. */
export const DURATION = { press: 0.16, small: 0.2, ui: 0.26, move: 0.3, delight: 0.7 }

/** True when the user asked their device for less motion: keep fades, drop movement and particles. */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * A tiny vibration for key actions (vote, save, add to bag). Android only: iPhones ignore navigator.vibrate,
 * and so does any browser without it, so this never fails.
 */
export function haptic(ms = 10) {
  if (prefersReducedMotion()) return
  navigator.vibrate?.(ms)
}

/** Quick scale "pop" on a toggle that just switched on (vote, heart, save). Feedback that the tap registered. */
export function pop(element) {
  if (!element || prefersReducedMotion()) return
  haptic()
  // Springs up from small with a big overshoot, with a little wiggle on the way.
  gsap.fromTo(
    element,
    { scale: 0.4, rotation: -15 },
    { scale: 1, rotation: 0, duration: 0.7, ease: 'elastic.out(1.1, 0.35)', overwrite: true },
  )
}

/** Fades (and slightly lifts) an element in: things that just appeared, like an error or revealed info. */
export function fadeIn(element) {
  if (!element) return
  const reduce = prefersReducedMotion()
  gsap.from(element, { opacity: 0, y: reduce ? 0 : 6, duration: DURATION.small, ease: 'ui-out', clearProps: 'transform,opacity' })
}

/**
 * Plays an element's exit (slide out, fade, collapse its height) and then calls `done`, which actually removes
 * it (e.g. the delete mutation). Returns a function that undoes the exit, for when the removal fails.
 * Height is animated here on purpose: it's the only way to close the gap smoothly (the accordion exception).
 */
export function exitThen(element, done) {
  if (!element || prefersReducedMotion()) {
    done()
    return () => {}
  }
  gsap.to(element, {
    opacity: 0, x: -32, height: 0, paddingTop: 0, paddingBottom: 0, marginTop: 0, marginBottom: 0,
    duration: DURATION.move, ease: 'ui-out', onComplete: done,
  })
  return () => gsap.set(element, { clearProps: 'all' })
}


/** Small bump on a counter/badge whose number just changed (bag count, bell badge). */
export function bump(element) {
  if (!element || prefersReducedMotion()) return
  gsap.fromTo(element, { scale: 1.7 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1.1, 0.4)', overwrite: true })
}

/** Bell-style wiggle (rotation around the top) when something new arrives. */
export function wiggle(element) {
  if (!element || prefersReducedMotion()) return
  gsap.fromTo(
    element,
    { rotation: 0, transformOrigin: '50% 10%' },
    { keyframes: { rotation: [28, -24, 18, -12, 6, 0] }, duration: 0.9, ease: 'power1.inOut', overwrite: true },
  )
}

/**
 * Burst of small dots flying out of an element (heart saved, "I'm going"). Pure decoration: the dots are
 * created on <body>, ignore pointer events and remove themselves. `count` and `distance` scale the effect.
 */
export function burst(element, { color = '#2c4a3b', count = 14, distance = 48 } = {}) {
  if (!element || prefersReducedMotion()) return
  const box = element.getBoundingClientRect()
  const centerX = box.left + box.width / 2
  const centerY = box.top + box.height / 2

  for (let i = 0; i < count; i++) {
    const dot = document.createElement('span')
    const size = 4 + (i % 3)
    Object.assign(dot.style, {
      position: 'fixed', left: `${centerX - size / 2}px`, top: `${centerY - size / 2}px`, width: `${size}px`,
      height: `${size}px`, borderRadius: '9999px', background: color, pointerEvents: 'none', zIndex: 60,
    })
    document.body.appendChild(dot)
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4
    const reach = distance * (0.7 + Math.random() * 0.6)
    gsap.fromTo(
      dot,
      { x: 0, y: 0, scale: 1, opacity: 1 },
      {
        x: Math.cos(angle) * reach, y: Math.sin(angle) * reach, scale: 0.3, opacity: 0,
        duration: 0.55 + Math.random() * 0.2, ease: 'ui-out', onComplete: () => dot.remove(),
      },
    )
  }
}

/**
 * A dot that flies from `fromElement` into the header bag (anything marked data-cart-target), then bumps
 * the bag. Shows where an added item went. Does nothing if the bag isn't on screen.
 */
export function flyToBag(fromElement) {
  const bag = document.querySelector('[data-cart-target]')
  flyDot(fromElement, bag, () => bump(bag))
}

/** The reverse of flyToBag, for removing an item: the dot leaves the bag and lands on `toElement`. */
export function flyFromBag(toElement) {
  const bag = document.querySelector('[data-cart-target]')
  flyDot(bag, toElement, () => bump(toElement))
}

/** Shared by flyToBag/flyFromBag: an arcing dot between two elements, then `onArrive`. */
function flyDot(fromElement, toElement, onArrive) {
  if (!fromElement || !toElement || prefersReducedMotion()) return
  haptic()
  const from = fromElement.getBoundingClientRect()
  const to = toElement.getBoundingClientRect()
  const dot = document.createElement('span')
  Object.assign(dot.style, {
    position: 'fixed', left: `${from.left + from.width / 2 - 7}px`, top: `${from.top + from.height / 2 - 7}px`,
    width: '14px', height: '14px', borderRadius: '9999px', background: '#2c4a3b', pointerEvents: 'none', zIndex: 60,
  })
  document.body.appendChild(dot)
  const dx = to.left + to.width / 2 - (from.left + from.width / 2)
  const dy = to.top + to.height / 2 - (from.top + from.height / 2)
  // Arc: x travels evenly while y eases with a slight overshoot upward, so the dot "jumps" to its target.
  gsap.timeline({ onComplete: () => { dot.remove(); onArrive() } })
    .to(dot, { x: dx, duration: 0.55, ease: 'power1.inOut' }, 0)
    .to(dot, { y: dy, duration: 0.55, ease: 'back.in(1.6)' }, 0)
    .to(dot, { scale: 0.4, duration: 0.55, ease: 'power2.in' }, 0)
}

/** Counts a number up from 0 in an element's text (profile stats). Leaves the final value exactly as given. */
export function countUp(element, value) {
  if (!element || typeof value !== 'number') return
  if (prefersReducedMotion() || value === 0) {
    element.textContent = value
    return
  }
  const counter = { n: 0 }
  gsap.to(counter, {
    n: value, duration: DURATION.delight, ease: 'power2.out',
    onUpdate: () => { element.textContent = Math.round(counter.n) },
  })
}

export { gsap, useGSAP, Draggable, ScrollTrigger }
