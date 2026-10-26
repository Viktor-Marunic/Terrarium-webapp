// Product page photos: one large photo with a row of thumbnails underneath to switch between them.
// `overlay` (the bookmark heart, passed in by the page) sits in the photo's top-right corner.
import { useState } from 'react'
import { ListingImage } from '../../../components/common/ListingImage'

export function ListingGallery({ imageUrls, title, overlay }) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  // Clamp, in case the seller removed photos while this page was open.
  const activeIndex = Math.min(selectedIndex, Math.max(imageUrls.length - 1, 0))

  return (
    <div className="min-w-0 space-y-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
        <ListingImage src={imageUrls[activeIndex]} alt={title} />
        {overlay && <div className="absolute top-3 right-3">{overlay}</div>}
      </div>
      {/* Thumbnails only make sense with more than one photo. */}
      {imageUrls.length > 1 && (
        <ul className="flex gap-2">
          {imageUrls.map((url, index) => (
            <li key={url}>
              <button
                type="button"
                onClick={() => setSelectedIndex(index)}
                aria-label={`Show photo ${index + 1}`}
                aria-pressed={index === activeIndex}
                className={`relative block size-14 overflow-hidden rounded-lg border-2 transition-[border-color,opacity] ${
                  index === activeIndex ? 'border-forest-700' : 'border-transparent opacity-70 hover:opacity-100'
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
