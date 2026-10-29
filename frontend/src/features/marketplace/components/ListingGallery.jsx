// Product page photos: a swipeable strip of photos (drag sideways, or flick) with thumbnails underneath.
// `overlay` (the bookmark heart, passed in by the page) sits in the photo's top-right corner.
// The strip is moved with GSAP Draggable: it follows the finger, then settles on the nearest photo.
import { useRef, useState } from 'react'
import { ListingImage } from '../../../components/common/ListingImage'
import { DURATION, Draggable, gsap, prefersReducedMotion, useGSAP } from '../../../lib/motion'

// A swipe counts if it covers a quarter of the photo, or is a quick flick (px per ms).
const SWIPE_DISTANCE = 0.25
const FLICK_VELOCITY = 0.4

export function ListingGallery({ imageUrls, title, overlay }) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  // Clamp, in case the seller removed photos while this page was open.
  const activeIndex = Math.min(selectedIndex, Math.max(imageUrls.length - 1, 0))
  const viewportRef = useRef(null)
  const trackRef = useRef(null)
  // The Draggable callbacks need the current index without re-creating the Draggable on every change;
  // goTo() is the only place the index changes, so it keeps this in sync with the state.
  const indexRef = useRef(0)

  const width = () => viewportRef.current.offsetWidth

  /** Slides the strip to photo `index` (animated unless reduced motion asks otherwise). */
  const goTo = (index, ease = 'ui-out') => {
    indexRef.current = index
    setSelectedIndex(index)
    gsap.to(trackRef.current, {
      x: -index * width(),
      duration: prefersReducedMotion() ? 0 : DURATION.move,
      ease,
      overwrite: true,
    })
  }

  useGSAP(
    () => {
      const track = trackRef.current
      indexRef.current = Math.min(indexRef.current, Math.max(imageUrls.length - 1, 0))
      gsap.set(track, { x: -indexRef.current * width() })
      if (imageUrls.length < 2) return

      let pressedAt = 0
      const [draggable] = Draggable.create(track, {
        type: 'x',
        // Vertical swipes still scroll the page; only sideways drags move the photos.
        allowNativeTouchScrolling: true,
        // Rubber-band past the first and last photo instead of a hard stop.
        edgeResistance: 0.8,
        onPress() {
          pressedAt = Date.now()
          gsap.killTweensOf(track)
          this.applyBounds({ minX: -(imageUrls.length - 1) * width(), maxX: 0 })
        },
        onRelease() {
          const moved = this.x - (-indexRef.current * width())
          const velocity = Math.abs(moved) / Math.max(Date.now() - pressedAt, 1)
          let next = indexRef.current
          if (Math.abs(moved) > width() * SWIPE_DISTANCE || velocity > FLICK_VELOCITY) next += moved < 0 ? 1 : -1
          goTo(Math.min(Math.max(next, 0), imageUrls.length - 1))
        },
      })

      // The photo width follows the screen, so keep the strip aligned when it changes.
      const onResize = () => gsap.set(track, { x: -indexRef.current * width() })
      window.addEventListener('resize', onResize)
      return () => {
        draggable.kill()
        window.removeEventListener('resize', onResize)
      }
    },
    { dependencies: [imageUrls.length], scope: viewportRef },
  )

  return (
    <div className="min-w-0 space-y-3">
      {/* data-no-swipe: sideways drags here change the photo, never the page (see useSwipeTabs). */}
      <div ref={viewportRef} data-no-swipe className="relative aspect-[4/3] overflow-hidden rounded-xl">
        <div ref={trackRef} className="flex h-full touch-pan-y">
          {(imageUrls.length > 0 ? imageUrls : [null]).map((url, index) => (
            <div key={url ?? 'placeholder'} className="relative h-full w-full shrink-0" aria-hidden={index !== activeIndex}>
              <ListingImage src={url} alt={index === activeIndex ? title : ''} />
            </div>
          ))}
        </div>
        {overlay && <div className="absolute top-3 right-3 z-10">{overlay}</div>}
      </div>
      {/* Thumbnails only make sense with more than one photo. */}
      {imageUrls.length > 1 && (
        <ul className="flex gap-2">
          {imageUrls.map((url, index) => (
            <li key={url}>
              <button
                type="button"
                onClick={() => goTo(index, 'ui-in-out')}
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
