// "Add to bag" for a listing, used on shop cards (variant="card") and the product page (variant="primary").
// Switches to "Item in cart" once added. Callers don't render it for the seller's own or sold listings.
// relative z-10 lifts it above the card's stretched link so clicking it doesn't open the product page.
import { CheckIcon, PlusIcon } from '@phosphor-icons/react'
import { useAddToCart, useCartItems } from '../hooks'

const variants = {
  card: 'rounded-lg border border-stone-300 bg-white py-2 text-sm text-forest-800 hover:border-forest-700',
  primary: 'rounded-lg bg-forest-700 py-3 text-white hover:bg-forest-800',
}

export function AddToBagButton({ listingId, variant = 'card' }) {
  const cart = useCartItems()
  const addToCart = useAddToCart()
  const isInBag = cart.data?.some((item) => item.listing_id === listingId) ?? false

  return (
    <>
      <button
        type="button"
        onClick={() => addToCart.mutate(listingId)}
        // Disabled while the bag loads too, so a double add can't happen before we know what's in it.
        disabled={isInBag || addToCart.isPending || cart.isLoading}
        className={`relative z-10 flex w-full items-center justify-center gap-2 font-medium transition-[background-color,border-color,scale] motion-safe:active:scale-[0.98] disabled:cursor-default ${variants[variant]} ${
          isInBag ? 'opacity-80' : ''
        }`}
      >
        {isInBag ? <CheckIcon size={18} aria-hidden="true" /> : <PlusIcon size={18} aria-hidden="true" />}
        {isInBag ? 'Item in cart' : addToCart.isPending ? 'Adding…' : 'Add to bag'}
      </button>
      {addToCart.error && <p className="relative z-10 mt-1 text-xs text-red-600">{addToCart.error.message}</p>}
    </>
  )
}
