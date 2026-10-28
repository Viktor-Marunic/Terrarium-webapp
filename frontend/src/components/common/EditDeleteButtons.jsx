// Small "Edit · Delete" text buttons for content the user owns (posts and comments).
// Delete asks for confirmation first, because it can't be undone.
import { PencilSimpleIcon, TrashIcon } from '@phosphor-icons/react'

// iconsOnMobile: below the sm breakpoint show bigger icons only (labels stay for screen readers), to save space.
export function EditDeleteButtons({
  onEdit,
  onDelete,
  isDeleting = false,
  confirmMessage = 'Delete this? This cannot be undone.',
  iconsOnMobile = false,
}) {
  const handleDelete = () => {
    if (window.confirm(confirmMessage)) onDelete()
  }
  const iconClass = iconsOnMobile ? 'size-5 sm:size-3.5' : 'size-3.5'
  const labelClass = iconsOnMobile ? 'sr-only sm:not-sr-only' : ''

  return (
    <div className="flex items-center gap-3 text-xs font-medium">
      <button type="button" onClick={onEdit} className="flex items-center gap-1 text-stone-500 hover:text-emerald-700">
        <PencilSimpleIcon className={iconClass} aria-hidden="true" />
        <span className={labelClass}>Edit</span>
      </button>
      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        className="flex items-center gap-1 text-stone-500 hover:text-red-600 disabled:opacity-60"
      >
        <TrashIcon className={iconClass} aria-hidden="true" />
        <span className={labelClass}>{isDeleting ? 'Deleting…' : 'Delete'}</span>
      </button>
    </div>
  )
}
