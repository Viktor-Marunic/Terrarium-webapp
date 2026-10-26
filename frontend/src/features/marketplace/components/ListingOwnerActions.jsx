// Seller-only buttons on their own listing: mark it sold (or available again), edit it, and delete it.
// Only shown to the seller in the UI; the RLS policies are what actually stop anyone else.
import { Link, useNavigate } from 'react-router-dom'
import { ArrowCounterClockwiseIcon, CheckCircleIcon, PencilSimpleIcon, TrashIcon } from '@phosphor-icons/react'
import { useDeleteListing, useSetListingStatus } from '../hooks'

export function ListingOwnerActions({ listing }) {
  const navigate = useNavigate()
  const setStatus = useSetListingStatus()
  const deleteListing = useDeleteListing()
  const isSold = listing.status === 'sold'

  const handleToggleSold = () => setStatus.mutate({ id: listing.id, status: isSold ? 'active' : 'sold' })

  const handleDelete = () => {
    if (!window.confirm('Delete this listing and its photos? This cannot be undone.')) return
    deleteListing.mutate(
      { id: listing.id, imageUrls: listing.image_urls },
      { onSuccess: () => navigate('/shop', { replace: true }) },
    )
  }

  const error = setStatus.error ?? deleteListing.error

  return (
    // Same stacked primary + secondary pair as the mockup's "Add to bag" / "Message seller".
    <div className="space-y-2">
      <p className="text-xs font-medium tracking-wide text-stone-500 uppercase">Your listing</p>
      <button
        type="button"
        onClick={handleToggleSold}
        disabled={setStatus.isPending}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-forest-700 py-3 font-medium text-white transition-[background-color,scale] hover:bg-forest-800 disabled:opacity-60 motion-safe:active:scale-[0.98]"
      >
        {isSold ? <ArrowCounterClockwiseIcon size={18} aria-hidden="true" /> : <CheckCircleIcon size={18} aria-hidden="true" />}
        {isSold ? 'Mark as available' : 'Mark as sold'}
      </button>
      {/* Secondary actions side by side under the main one. */}
      <div className="grid grid-cols-2 gap-2">
        <Link
          to={`/shop/${listing.id}/edit`}
          className="flex items-center justify-center gap-2 rounded-lg border border-stone-300 bg-paper py-2.5 text-sm font-medium text-forest-800 transition-colors hover:border-forest-700"
        >
          <PencilSimpleIcon size={18} aria-hidden="true" />
          Edit
        </Link>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleteListing.isPending}
          className="flex items-center justify-center gap-2 rounded-lg border border-stone-300 bg-paper py-2.5 text-sm font-medium text-red-700 transition-colors hover:border-red-300 hover:bg-red-50 disabled:opacity-60"
        >
          <TrashIcon size={18} aria-hidden="true" />
          {deleteListing.isPending ? 'Deleting…' : 'Delete'}
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error.message}</p>}
    </div>
  )
}
