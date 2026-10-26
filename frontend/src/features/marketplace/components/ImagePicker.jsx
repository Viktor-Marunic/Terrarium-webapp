// Photo picker for the listing form: an "Add photos" tile plus a preview of each photo with a remove button.
// Controlled (value, onChange) so react-hook-form's Controller can own the list; the Zod schema validates it.
// Items are Files (newly picked) or URL strings (photos already uploaded, when editing).
import { PlusIcon, XIcon } from '@phosphor-icons/react'
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGES } from '../schemas'

// Preview URLs are cached per File so re-renders don't create new ones. Created lazily here instead of in an
// effect, because StrictMode's effect re-run would revoke them while still shown. Revoked when a photo is removed;
// the few left when the form closes are freed on page reload.
const previewUrls = new WeakMap()
function previewUrlFor(image) {
  if (typeof image === 'string') return image
  if (!previewUrls.has(image)) previewUrls.set(image, URL.createObjectURL(image))
  return previewUrls.get(image)
}

export function ImagePicker({ value, onChange, error }) {
  const handleAdd = (event) => {
    // Extra photos beyond the limit are dropped here; type/size problems are left for the schema to report.
    onChange([...value, ...event.target.files].slice(0, MAX_IMAGES))
    // Reset so picking the same file again (after removing it) still fires a change.
    event.target.value = ''
  }

  // Removing an already-uploaded photo only drops it from the list; it's deleted from storage when the edit is saved.
  const handleRemove = (image) => {
    if (previewUrls.has(image)) {
      URL.revokeObjectURL(previewUrls.get(image))
      previewUrls.delete(image)
    }
    onChange(value.filter((other) => other !== image))
  }

  return (
    <fieldset>
      <legend className="text-sm font-medium text-stone-700">
        Photos <span className="font-normal text-stone-500">({value.length}/{MAX_IMAGES}, the first is the cover)</span>
      </legend>
      <ul className="mt-1 grid grid-cols-3 gap-2 sm:grid-cols-5">
        {value.map((file, index) => (
          <li key={previewUrlFor(file)} className="relative aspect-square overflow-hidden rounded-md bg-stone-200">
            <img src={previewUrlFor(file)} alt={`Photo ${index + 1}`} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemove(file)}
              aria-label={`Remove photo ${index + 1}`}
              className="absolute top-1 right-1 flex size-7 items-center justify-center rounded-full bg-white/90 text-stone-700 shadow-sm hover:bg-white"
            >
              <XIcon size={16} aria-hidden="true" />
            </button>
          </li>
        ))}
        {value.length < MAX_IMAGES && (
          <li>
            {/* The label is the visible tile; the real file input is visually hidden but stays keyboard-focusable. */}
            <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed border-stone-300 bg-white text-sm text-stone-600 hover:border-emerald-600 hover:text-emerald-700 has-[:focus-visible]:border-emerald-600">
              <PlusIcon size={24} aria-hidden="true" />
              Add photos
              <input
                type="file"
                accept={ACCEPTED_IMAGE_TYPES.join(',')}
                multiple
                onChange={handleAdd}
                className="sr-only"
              />
            </label>
          </li>
        )}
      </ul>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </fieldset>
  )
}
