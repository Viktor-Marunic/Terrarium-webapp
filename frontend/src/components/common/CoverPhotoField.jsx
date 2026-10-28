// Optional single cover photo (event and guide forms): an "Add a photo" tile, or a preview with a remove button.
// Controlled (value = null | File | URL string, onChange) for react-hook-form's Controller; the Zod schema validates it.
import { ImageIcon, XIcon } from '@phosphor-icons/react'
import { ACCEPTED_IMAGE_TYPES } from '../../lib/images'

// Preview URLs cached per File so re-renders don't create new ones (same approach as the listing ImagePicker).
const previewUrls = new WeakMap()
function previewUrlFor(image) {
  if (typeof image === 'string') return image
  if (!previewUrls.has(image)) previewUrls.set(image, URL.createObjectURL(image))
  return previewUrls.get(image)
}

export function CoverPhotoField({ value, onChange, error }) {
  const handleRemove = () => {
    if (previewUrls.has(value)) URL.revokeObjectURL(previewUrls.get(value))
    onChange(null)
  }

  return (
    <fieldset>
      <legend className="text-sm font-medium text-stone-700">
        Photo <span className="font-normal text-stone-500">(optional)</span>
      </legend>
      <div className="relative mt-1 aspect-[5/2] overflow-hidden rounded-md">
        {value ? (
          <>
            <img src={previewUrlFor(value)} alt="Photo preview" className="h-full w-full bg-sage-50 object-contain" />
            <button
              type="button"
              onClick={handleRemove}
              aria-label="Remove photo"
              className="absolute top-2 right-2 flex size-8 items-center justify-center rounded-full bg-white/90 text-stone-700 shadow-sm hover:bg-white"
            >
              <XIcon size={16} aria-hidden="true" />
            </button>
          </>
        ) : (
          // The label is the visible tile; the real file input is visually hidden but stays keyboard-focusable.
          <label className="flex h-full cursor-pointer flex-col items-center justify-center gap-1 border-2 border-dashed border-stone-300 bg-white text-sm text-stone-600 hover:border-forest-700 hover:text-forest-800 has-[:focus-visible]:border-forest-700">
            <ImageIcon size={26} aria-hidden="true" />
            Add a photo
            <input
              type="file"
              accept={ACCEPTED_IMAGE_TYPES.join(',')}
              onChange={(event) => event.target.files[0] && onChange(event.target.files[0])}
              className="sr-only"
            />
          </label>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </fieldset>
  )
}
