// A listing photo that fills its box, or a soft sage plant placeholder when there is no photo.
// Shared by the marketplace (cards, gallery) and the shopping bag.
// The parent sets the size/aspect ratio and must be `relative`. The photo is absolutely positioned so its own
// size can never stretch the box: in normal flow a tall phone photo makes an aspect-ratio box grow to fit it.
import { PlantIcon } from '@phosphor-icons/react'

export function ListingImage({ src, alt = '' }) {
  if (!src) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-sage-100 to-sage-200">
        <PlantIcon size={32} className="text-sage-600" aria-hidden="true" />
      </div>
    )
  }
  return <img src={src} alt={alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
}
