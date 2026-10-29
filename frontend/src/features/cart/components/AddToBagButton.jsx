// "Add to bag" for a listing, used on shop cards (variant="card") and the product page (variant="primary").
// Once added it shows "Item in cart" with a remove button beside it, so the item can be taken out right here
// without opening the bag. Callers don't render it for the seller's own or sold listings.
// relative z-10 lifts the buttons above the card's stretched link so clicking them doesn't open the product page.
// Motion: adding flies a dot into the header bag; removing flies one back out of it.
import { useRef } from 'react'
import { CheckIcon, PlusIcon, TrashIcon } from '@phosphor-icons/react'
import { FadeIn } from '../../../components/common/FadeIn'
import { flyFromBag, flyToBag } from '../../../lib/motion'
import { useAddToCart, useCartItems, useRemoveFromCart } from '../hooks'

const variants = {
  // Shop cards are ~170px wide on phones: the label stays on one line and the check icon only shows from sm up.
  card: {
    add: 'rounded-lg border border-stone-300 bg-white py-2 text-sm text-forest-800 hover:border-forest-700',
    inCart: 'rounded-lg border border-forest-700 bg-sage-50 py-2 text-sm whitespace-nowrap text-forest-800 [&>svg]:hidden sm:[&>svg]:block',
    remove: 'rounded-lg border border-stone-300 bg-white px-2 text-red-700 hover:border-red-300',
  },
  primary: {
    add: 'rounded-lg bg-forest-700 py-3 text-white hover:bg-forest-800',
    inCart: 'rounded-lg border border-forest-700 bg-sage-50 py-3 text-forest-800',
    remove: 'rounded-lg border border-stone-300 bg-paper px-4 text-red-700 hover:border-red-300',
  },
}

export function AddToBagButton({ listingId, variant = 'card' }) {
  const cart = useCartItems()
  const addToCart = useAddToCart()
  const removeFromCart = useRemoveFromCart()
  const cartItem = cart.data?.find((item) => item.listing_id === listingId)
  const styles = variants[variant]
  const addRef = useRef(null)
  const inCartRef = useRef(null)
  const error = addToCart.error ?? removeFromCart.error

  const handleAdd = () => {
    flyToBag(addRef.current)
    addToCart.mutate(listingId)
  }

  const handleRemove = () => {
    flyFromBag(inCartRef.current)
    removeFromCart.mutate(cartItem.id)
  }

  return (
    <>
      {cartItem ? (
        <div ref={inCartRef} className="relative z-10 flex gap-2">
          <FadeIn
            key="in-cart"
            className={`flex flex-1 items-center justify-center gap-2 font-medium ${styles.inCart}`}
          >
            <CheckIcon size={18} aria-hidden="true" />
            Item in cart
          </FadeIn>
          <button
            type="button"
            onClick={handleRemove}
            disabled={removeFromCart.isPending}
            aria-label="Remove from cart"
            className={`flex shrink-0 items-center justify-center transition-colors disabled:opacity-60 ${styles.remove}`}
          >
            <TrashIcon size={18} aria-hidden="true" />
          </button>
        </div>
      ) : (
        <button
          ref={addRef}
          type="button"
          onClick={handleAdd}
          // Disabled while the bag loads too, so a double add can't happen before we know what's in it.
          disabled={addToCart.isPending || cart.isLoading}
          className={`relative z-10 flex w-full items-center justify-center gap-2 font-medium transition-[background-color,border-color] disabled:cursor-default ${styles.add}`}
        >
          {/* key = the label, so the label change fades the new one in instead of snapping. */}
          <FadeIn key={addToCart.isPending ? 'adding' : 'add'} className="flex items-center gap-2">
            <PlusIcon size={18} aria-hidden="true" />
            {addToCart.isPending ? 'Adding…' : 'Add to bag'}
          </FadeIn>
        </button>
      )}
      {error && <p className="relative z-10 mt-1 text-xs text-red-600">{error.message}</p>}
    </>
  )
}
