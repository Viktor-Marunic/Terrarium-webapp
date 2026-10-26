// Seller-only buttons on their own listing: mark it sold (or available again) and delete it.
// Only shown to the seller in the UI; the RLS policies are what actually stop anyone else.
import { useNavigate } from 'react-router-dom'
import { ArrowCounterClockwiseIcon, CheckCircleIcon, TrashIcon } from '@phosphor-icons/react'
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
    <div className="space-y-2 border-t border-stone-100 pt-4">
      <p className="text-xs font-medium tracking-wide text-stone-500 uppercase">Your listing</p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleToggleSold}
          disabled={setStatus.isPending}
          className="flex flex-1 items-center justify-center gap-2 rounded-md border border-stone-300 bg-white py-2 text-sm font-medium text-stone-800 hover:bg-stone-50 disabled:opacity-60"
        >
          {isSold ? <ArrowCounterClockwiseIcon size={18} aria-hidden="true" /> : <CheckCircleIcon size={18} aria-hidden="true" />}
          {isSold ? 'Mark as available' : 'Mark as sold'}
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleteListing.isPending}
          className="flex items-center justify-center gap-2 rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
        >
          <TrashIcon size={18} aria-hidden="true" />
          {deleteListing.isPending ? 'Deleting…' : 'Delete'}
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error.message}</p>}
    </div>
  )
}
