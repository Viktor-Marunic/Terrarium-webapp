// Small "Edit · Delete" text buttons for content the user owns (posts and comments).
// Delete asks for confirmation first, because it can't be undone.
import { PencilSimpleIcon, TrashIcon } from '@phosphor-icons/react'

export function EditDeleteButtons({ onEdit, onDelete, isDeleting = false, confirmMessage = 'Delete this? This cannot be undone.' }) {
  const handleDelete = () => {
    if (window.confirm(confirmMessage)) onDelete()
  }

  return (
    <div className="flex items-center gap-3 text-xs font-medium">
      <button type="button" onClick={onEdit} className="flex items-center gap-1 text-stone-500 hover:text-emerald-700">
        <PencilSimpleIcon size={14} aria-hidden="true" />
        Edit
      </button>
      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        className="flex items-center gap-1 text-stone-500 hover:text-red-600 disabled:opacity-60"
      >
        <TrashIcon size={14} aria-hidden="true" />
        {isDeleting ? 'Deleting…' : 'Delete'}
      </button>
    </div>
  )
}
