// React hooks for the shopping bag. Every change refetches ['cart'], which the header badge,
// the bag panel and the "Add to bag" buttons all read.
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addToCart, listCartItems, removeFromCart, setCartQuantity } from './api'

export function useCartItems() {
  return useQuery({ queryKey: ['cart'], queryFn: listCartItems })
}

function useCartMutation(mutationFn) {
  const queryClient = useQueryClient()
  return useMutation({ mutationFn, onSettled: () => queryClient.invalidateQueries({ queryKey: ['cart'] }) })
}

/** Mutation taking a listing id. */
export const useAddToCart = () => useCartMutation(addToCart)
/** Mutation taking { id, quantity }. */
export const useSetCartQuantity = () => useCartMutation(setCartQuantity)
/** Mutation taking a cart item id. */
export const useRemoveFromCart = () => useCartMutation(removeFromCart)
