// Supabase queries for the profiles table.
import { supabase } from '../../lib/supabase'

/** Fetches one profile by user id: { id, username, display_name, location, avatar_url, bio, created_at }. */
export async function getProfile(id) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

/**
 * Saves the logged-in user's own name, location and bio (RLS rejects anyone else's row).
 * Empty fields are stored as null, so the profile falls back to @username / no location line.
 * @param {{ id: string, displayName: string, location: string, bio: string }} values
 */
export async function updateProfile({ id, displayName, location, bio }) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ display_name: displayName || null, location: location || null, bio: bio || null })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

/**
 * Every badge with the user's progress, in display order (computed by the get_user_badges database function):
 * [{ id, title, description, icon, goal, progress, earned_at }]; earned_at is null until the badge is earned.
 */
export async function getUserBadges(userId) {
  const { data, error } = await supabase.rpc('get_user_badges', { p_user_id: userId })
  if (error) throw error
  return data
}
