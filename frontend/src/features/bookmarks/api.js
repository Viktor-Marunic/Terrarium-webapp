// Supabase queries/mutations for bookmarks (listings a user saved with the heart).
// RLS limits every query to the logged-in user's own bookmarks.
import { supabase } from '../../lib/supabase'

/** Ids of every listing the user has saved, newest first. */
export async function listBookmarkedListingIds() {
  const { data, error } = await supabase.from('bookmarks').select('listing_id').order('created_at', { ascending: false })
  if (error) throw error
  return data.map((row) => row.listing_id)
}

/** Saves or un-saves a listing for the logged-in user (user_id is filled in by the database). */
export async function setBookmark({ listingId, saved }) {
  const bookmarks = supabase.from('bookmarks')
  const { error } = saved
    ? await bookmarks.insert({ listing_id: listingId })
    : await bookmarks.delete().eq('listing_id', listingId)
  // 23505 = already saved (e.g. a double click); the end state is what the user wanted.
  if (error && error.code !== '23505') throw error
}
