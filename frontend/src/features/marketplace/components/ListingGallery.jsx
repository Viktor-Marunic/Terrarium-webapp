// Product page photos: one large photo with a row of thumbnails underneath to switch between them.
import { useState } from 'react'
import { ListingImage } from './ListingImage'

export function ListingGallery({ imageUrls, title }) {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className="space-y-2">
      <div className="aspect-[4/3] overflow-hidden rounded-lg bg-white shadow-sm">
        <ListingImage src={imageUrls[activeIndex]} alt={title} />
      </div>
      {/* Thumbnails only make sense with more than one photo. */}
      {imageUrls.length > 1 && (
        <ul className="flex gap-2">
          {imageUrls.map((url, index) => (
            <li key={url}>
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Show photo ${index + 1}`}
                aria-pressed={index === activeIndex}
                className={`block size-16 overflow-hidden rounded-md border-2 transition-colors ${
                  index === activeIndex ? 'border-emerald-700' : 'border-transparent hover:border-stone-300'
                }`}
              >
                <ListingImage src={url} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
