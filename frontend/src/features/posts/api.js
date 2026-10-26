// Supabase queries/mutations for the posts table.
import { supabase } from '../../lib/supabase'

// Columns every post view needs, including the embedded author and community.
// votes(value) holds only the current user's own vote (RLS), used to highlight their arrow.
const POST_COLUMNS =
  'id, author_id, type, title, body, created_at, score, author:profiles(username, avatar_url), community:communities(slug, name), votes(value)'

/**
 * Posts from every community or only one (pass communityId), sorted 'new' (newest first) or 'top' (highest score).
 * Each post includes { score, author: { username }, community: { slug, name }, comments: [{ count }], votes: [{ value }] }.
 */
export async function listPosts(communityId, sort = 'new') {
  let query = supabase.from('posts').select(`${POST_COLUMNS}, comments(count)`)
  // Top ties are broken by newest first.
  if (sort === 'top') query = query.order('score', { ascending: false })
  query = query.order('created_at', { ascending: false })
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
