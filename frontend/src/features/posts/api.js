// Supabase queries/mutations for the posts table.
import { supabase } from '../../lib/supabase'

// Columns every post view needs, including the embedded author and community.
const POST_COLUMNS = 'id, author_id, type, title, body, created_at, author:profiles(username), community:communities(slug, name)'

/**
 * Posts newest first, from every community or only one (pass communityId).
 * Each post includes { author: { username }, community: { slug, name }, comments: [{ count }] }.
 */
export async function listPosts(communityId) {
  let query = supabase
    .from('posts')
    .select(`${POST_COLUMNS}, comments(count)`)
    .order('created_at', { ascending: false })
  if (communityId) query = query.eq('community_id', communityId)

  const { data, error } = await query
  if (error) throw error
  return data
}

/** One post by id, or null if it doesn't exist (or was deleted). */
export async function getPost(id) {
  const { data, error } = await supabase.from('posts').select(POST_COLUMNS).eq('id', id).maybeSingle()
  if (error) throw error
  return data
}

/** Saves edits to one of the user's own posts (RLS rejects anyone else's). */
export async function updatePost({ id, type, title, body }) {
  const { data, error } = await supabase
    .from('posts')
    .update({ type, title, body: body || null })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

/** Deletes one of the user's own posts; its comments are removed by the database cascade. */
export async function deletePost(id) {
  const { error } = await supabase.from('posts').delete().eq('id', id)
  if (error) throw error
}

/** Creates a post as the logged-in user (author_id is filled in by the database). */
export async function createPost({ communityId, type, title, body }) {
  const { data, error } = await supabase
    .from('posts')
    .insert({ community_id: communityId, type, title, body: body || null })
    .select()
    .single()
  if (error) throw error
  return data
}
