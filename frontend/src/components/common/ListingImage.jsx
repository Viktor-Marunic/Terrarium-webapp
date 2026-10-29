// A listing photo that fills its box, or a soft sage plant placeholder when there is no photo.
// Shared by the marketplace (cards, gallery), the shopping bag and events.
// The parent sets the size/aspect ratio and must be `relative`. The photo is absolutely positioned so its own
// size can never stretch the box: in normal flow a tall phone photo makes an aspect-ratio box grow to fit it.
// object-contain shows the whole photo (nothing cropped or distorted); the sage background fills any leftover space.
// Photos start transparent and fade in once loaded, instead of popping in line by line.
import { PlantIcon } from '@phosphor-icons/react'
import { gsap } from '../../lib/motion'

/** Fade the loaded (or failed: a broken image should still be visible) photo in. */
const reveal = (event) => gsap.to(event.currentTarget, { opacity: 1, duration: 0.35, ease: 'ui-out' })

export function ListingImage({ src, alt = '' }) {
  if (!src) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-sage-100 to-sage-200">
        <PlantIcon size={32} className="text-sage-600" aria-hidden="true" />
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onLoad={reveal}
      onError={reveal}
      className="absolute inset-0 h-full w-full bg-sage-50 object-contain opacity-0"
    />
  )
}
