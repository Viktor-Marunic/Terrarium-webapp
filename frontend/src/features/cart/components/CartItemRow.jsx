// One row in the bag: photo, title, seller, a −/+ quantity stepper and the line price.
// At quantity 1 the minus button becomes a remove (trash) button. Sold listings can only be removed.
// Motion: removing slides the row out and closes the gap before it's gone; the quantity bumps when it changes.
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { MinusIcon, PlusIcon, TrashIcon } from '@phosphor-icons/react'
import { ListingImage } from '../../../components/common/ListingImage'
import { bump, exitThen } from '../../../lib/motion'
import { useRemoveFromCart, useSetCartQuantity } from '../hooks'

const MAX_QUANTITY = 10
const stepperButton =
  'flex size-9 items-center justify-center rounded-lg bg-cream text-stone-700 transition-colors hover:bg-sage-100 disabled:opacity-40'

export function CartItemRow({ item, onNavigate }) {
  const setQuantity = useSetCartQuantity()
  const removeItem = useRemoveFromCart()
  const { listing, quantity } = item
  const isSold = listing.status === 'sold'
  const isBusy = setQuantity.isPending || removeItem.isPending
  const rowRef = useRef(null)
  const quantityRef = useRef(null)

  /**
   * Plays the exit, then removes. Restored once the removal settles: on success the bag has already refetched
   * and the row is gone, so this only matters when it failed (or the item somehow stayed) and the row comes back.
   */
  const remove = () => {
    const undoExit = exitThen(rowRef.current, () => removeItem.mutate(item.id, { onSettled: () => undoExit() }))
  }

  const changeQuantity = (next) => {
    bump(quantityRef.current)
    setQuantity.mutate({ id: item.id, quantity: next })
  }

  const decrease = () => (quantity === 1 || isSold ? remove() : changeQuantity(quantity - 1))

  return (
    <li ref={rowRef} className="flex gap-3 overflow-hidden py-4">
      <Link to={`/shop/${listing.id}`} onClick={onNavigate} className="relative size-20 shrink-0 overflow-hidden rounded-lg sm:size-22">
        <ListingImage src={listing.image_urls[0]} />
      </Link>
      <div className="min-w-0 flex-1">
        <Link to={`/shop/${listing.id}`} onClick={onNavigate} className="font-display text-lg leading-snug wrap-anywhere text-stone-900 hover:underline">
          {listing.title}
        </Link>
        <p className="text-xs text-stone-500">
          {isSold ? 'Sold, no longer available' : `Sold by @${listing.seller?.username ?? 'deleted'}`}
        </p>
        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button type="button" onClick={decrease} disabled={isBusy} aria-label={quantity === 1 || isSold ? 'Remove from bag' : 'Decrease quantity'} className={stepperButton}>
              {quantity === 1 || isSold ? <TrashIcon size={16} aria-hidden="true" /> : <MinusIcon size={16} aria-hidden="true" />}
            </button>
            {!isSold && (
              <>
                <span
                  ref={quantityRef}
                  className="inline-block w-5 text-center text-sm font-medium tabular-nums"
                  aria-label={`Quantity ${quantity}`}
                >
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => changeQuantity(quantity + 1)}
                  disabled={isBusy || quantity >= MAX_QUANTITY}
                  aria-label="Increase quantity"
                  className={stepperButton}
                >
                  <PlusIcon size={16} aria-hidden="true" />
                </button>
              </>
            )}
          </div>
          <p className={`font-semibold tabular-nums ${isSold ? 'text-stone-400 line-through' : 'text-forest-800'}`}>
            {listing.price * quantity} kr
          </p>
        </div>
      </div>
    </li>
  )
}
