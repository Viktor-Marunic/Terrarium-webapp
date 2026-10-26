// Supabase queries/mutations for the shopping bag (cart_items). Items can be added and counted, but there is
// deliberately no checkout or payment. RLS limits every query to the logged-in user's own bag.
import { supabase } from '../../lib/supabase'

// Each bag row with the listing details the bag shows.
const CART_COLUMNS = 'id, listing_id, quantity, listing:listings(id, title, price, image_urls, status, seller:profiles(username))'

/** The user's bag, oldest first. Each item: { id, listing_id, quantity, listing: {...} }. */
export async function listCartItems() {
  const { data, error } = await supabase.from('cart_items').select(CART_COLUMNS).order('created_at')
  if (error) throw error
  return data
}

/** Puts a listing in the bag (user_id is filled in by the database). Adding it twice is a no-op. */
export async function addToCart(listingId) {
  const { error } = await supabase.from('cart_items').insert({ listing_id: listingId })
  // 23505 = unique violation: it's already in the bag, which is what the user wanted anyway.
  if (error && error.code !== '23505') throw error
}

/** Sets an item's quantity (1–10; the database rejects anything else). */
export async function setCartQuantity({ id, quantity }) {
  const { error } = await supabase.from('cart_items').update({ quantity }).eq('id', id)
  if (error) throw error
}

export async function removeFromCart(id) {
  const { error } = await supabase.from('cart_items').delete().eq('id', id)
  if (error) throw error
}
