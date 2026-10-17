// Supabase queries for the communities table.
import { supabase } from '../../lib/supabase'

/** All communities, alphabetically: [{ id, slug, name, description }]. */
export async function listCommunities() {
  const { data, error } = await supabase.from('communities').select('id, slug, name, description').order('name')
  if (error) throw error
  return data
}
