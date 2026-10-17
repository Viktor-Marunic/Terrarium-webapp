// Supabase queries for the profiles table.
import { supabase } from '../../lib/supabase'

/** Fetches one profile by user id: { id, username, avatar_url, bio, created_at }. */
export async function getProfile(id) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single()
  if (error) throw error
  return data
}
