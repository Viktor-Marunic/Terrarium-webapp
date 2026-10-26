// /shop/:id/edit — the seller edits their own listing with the same form as "Sell an item", filled in.
// Others get a message instead of the form (and RLS would reject their save anyway).
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeftIcon } from '@phosphor-icons/react'
import { useSession } from '../features/auth/hooks'
import { useListing } from '../features/marketplace/hooks'
import { ListingForm } from '../features/marketplace/components/ListingForm'

export function EditListingPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { session, isLoading: isSessionLoading } = useSession()
  const listing = useListing(id)
  const backTo = `/shop/${id}`

  if (listing.isLoading || isSessionLoading) return <p className="text-stone-500">Loading listing…</p>
  if (listing.error) return <p className="text-red-600">Could not load listing: {listing.error.message}</p>
  if (!listing.data) return <p className="text-stone-600">This listing doesn't exist or was deleted.</p>
  if (listing.data.seller_id !== session?.user.id) return <p className="text-stone-600">You can only edit your own listings.</p>

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Link to={backTo} className="inline-flex items-center gap-1 text-sm text-stone-600 hover:text-emerald-700">
        <ArrowLeftIcon size={16} aria-hidden="true" />
        Back to listing
      </Link>
      <h1 className="text-xl font-semibold text-stone-800">Edit listing</h1>
      <ListingForm
        listing={listing.data}
        // replace: Back from the saved listing should not reopen the edit form.
        onSaved={() => navigate(backTo, { replace: true })}
        onCancel={() => navigate(backTo)}
      />
    </div>
  )
}
