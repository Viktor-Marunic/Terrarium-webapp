// Header bag icon with an item count; opens the bag as a pop-up Sheet (bottom sheet on phones, side panel on desktop).
// "Half functional" by design: items can be added, counted and removed, but "Go to checkout" only leads to the
// 404 page (no payments).
// Motion: data-cart-target is where "Add to bag" dots fly to; the count bumps when it goes up; rows rise in on open.
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBagIcon } from '@phosphor-icons/react'
import { Sheet } from '../../../components/common/Sheet'
import { bump } from '../../../lib/motion'
import { useStaggerIn } from '../../../lib/useStaggerIn'
import { useCartItems } from '../hooks'
import { CartItemRow } from './CartItemRow'

export function CartButton() {
  const [isOpen, setIsOpen] = useState(false)
  const cart = useCartItems()
  const items = cart.data ?? []
  // Sold listings stay visible in the bag (so the user notices) but don't count towards the total.
  const available = items.filter((item) => item.listing.status !== 'sold')
  const itemCount = available.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = available.reduce((sum, item) => sum + item.listing.price * item.quantity, 0)
  const close = () => setIsOpen(false)

  // Bump the number when it goes up (not on the first load, and not when it goes down).
  const countRef = useRef(null)
  const previousCount = useRef(null)
  useEffect(() => {
    if (previousCount.current !== null && itemCount > previousCount.current) bump(countRef.current)
    previousCount.current = itemCount
  }, [itemCount])

  // Rows rise in each time the bag opens (the sheet mounts fresh), and when new ones appear.
  const listRef = useStaggerIn([isOpen, cart.data], { scrollLinked: false })

  return (
    <>
      <button
        type="button"
        data-cart-target
        onClick={() => setIsOpen(true)}
        aria-label={`Shopping bag, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
        className="flex h-10 items-center gap-1 rounded-full px-2 text-forest-800 transition-colors hover:bg-sage-50"
      >
        <ShoppingBagIcon size={24} aria-hidden="true" />
        {itemCount > 0 && (
          <span ref={countRef} className="inline-block text-sm font-medium tabular-nums">
            {itemCount}
          </span>
        )}
      </button>

      <Sheet
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Your Shopping Bag"
        description="Items you've added from the marketplace."
        footer={
          items.length > 0 && (
            <div className="space-y-3">
              <dl className="space-y-1 text-sm">
                <div className="flex justify-between text-stone-600">
                  <dt>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</dt>
                  <dd className="tabular-nums">{subtotal} kr</dd>
                </div>
                <div className="flex justify-between text-stone-600">
                  <dt>Shipping</dt>
                  <dd className="font-medium text-forest-800">Arranged with seller</dd>
                </div>
                <div className="flex items-baseline justify-between pt-1">
                  <dt className="font-display text-xl text-stone-900">Total</dt>
                  <dd className="text-xl font-bold text-forest-800 tabular-nums">{subtotal} kr</dd>
                </div>
              </dl>
              {/* There's no checkout (no payments), so this leads to the 404 page; closing the bag first. */}
              <Link
                to="/404"
                onClick={close}
                className="block w-full rounded-lg bg-forest-700 py-3.5 text-center font-medium text-white transition-colors hover:bg-forest-800"
              >
                Go to checkout
              </Link>
            </div>
          )
        }
      >
        {cart.isLoading && <p className="text-stone-500">Loading your bag…</p>}
        {cart.error && <p className="text-red-600">Could not load your bag: {cart.error.message}</p>}
        {cart.data && items.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-stone-600">Your bag is empty.</p>
            <Link to="/shop" onClick={close} className="mt-2 inline-block font-medium text-forest-700 hover:underline">
              Browse the marketplace
            </Link>
          </div>
        )}
        {items.length > 0 && (
          <ul ref={listRef} className="divide-y divide-stone-200">
            {items.map((item) => (
              <CartItemRow key={item.id} item={item} onNavigate={close} />
            ))}
          </ul>
        )}
      </Sheet>
    </>
  )
}
