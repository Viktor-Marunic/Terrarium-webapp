// Supabase queries/mutations for the comments table.
import { supabase } from '../../lib/supabase'

/** All comments on a post as a flat list, oldest first; buildCommentTree() nests them. */
export async function listComments(postId) {
  const { data, error } = await supabase
    .from('comments')
    .select('id, author_id, parent_id, body, created_at, edited_at, score, author:profiles(username, avatar_url), votes(value)')
    .eq('post_id', postId)
    .order('created_at')
  if (error) throw error
  return data
}

/** Saves edits to one of the user's own comments. */
export async function updateComment({ id, body }) {
  const { data, error } = await supabase.from('comments').update({ body }).eq('id', id).select().single()
  if (error) throw error
  return data
}

/** Deletes one of the user's own comments; replies under it are deleted too (database cascade). */
export async function deleteComment(id) {
  const { error } = await supabase.from('comments').delete().eq('id', id)
  if (error) throw error
}

/** Adds a comment as the logged-in user; pass parentId to reply to another comment. */
export async function createComment({ postId, parentId = null, body }) {
  const { data, error } = await supabase
    .from('comments')
    .insert({ post_id: postId, parent_id: parentId, body })
    .select()
    .single()
  if (error) throw error
  return data
}
