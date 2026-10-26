// A listing photo that fills its box, or a soft green plant placeholder when there is no photo.
// The parent sets the size/aspect ratio; this only fills it.
import { PlantIcon } from '@phosphor-icons/react'

export function ListingImage({ src, alt = '' }) {
  if (!src) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-emerald-50 to-emerald-100">
        <PlantIcon size={32} className="text-emerald-700/50" aria-hidden="true" />
      </div>
    )
  }
  return <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover" />
}
