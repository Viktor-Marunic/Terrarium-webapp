// /shop/new — "Sell an item": the listing form; on success it opens the new listing's product page.
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeftIcon } from '@phosphor-icons/react'
import { ListingForm } from '../features/marketplace/components/ListingForm'

export function SellPage() {
  const navigate = useNavigate()

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Link to="/shop" className="inline-flex items-center gap-1 text-sm text-stone-600 hover:text-emerald-700">
        <ArrowLeftIcon size={16} aria-hidden="true" />
        Back to marketplace
      </Link>
      <h1 className="text-xl font-semibold text-stone-800">Sell an item</h1>
      <ListingForm
        // replace: Back from the new listing should return to the shop, not to an empty sell form.
        onSaved={(listing) => navigate(`/shop/${listing.id}`, { replace: true })}
        onCancel={() => navigate('/shop')}
      />
    </div>
  )
}
