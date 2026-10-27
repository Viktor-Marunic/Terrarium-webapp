// Supabase queries/mutations for the posts table.
import { supabase } from '../../lib/supabase'
import { removeImages, uploadImages } from '../../lib/images'

const BUCKET = 'post-images'
export const POSTS_PAGE_SIZE = 10

// Columns every post view needs, including the embedded author and community.
// profiles!author_id: post_bookmarks also links posts to profiles, so the author relation has to be named.
// votes(value) holds only the current user's own vote (RLS), used to highlight their arrow.
const POST_COLUMNS =
  'id, author_id, type, title, body, image_urls, created_at, score, author:profiles!author_id(username, avatar_url), community:communities(slug, name), votes(value)'

/**
 * One page of posts from every community or only one (pass communityId), sorted 'new' (newest first) or
 * 'top' (highest score). Pass authorId to get only one user's posts (their profile). page starts at 0.
 * Each post includes { score, image_urls, author: { username, avatar_url }, community: { slug, name },
 * comments: [{ count }], votes: [{ value }] }.
 * @returns {Promise<{ posts: object[], totalCount: number }>} totalCount counts every matching post, not just this page.
 */
export async function listPosts({ communityId, sort = 'new', authorId, page = 0 }) {
  const from = page * POSTS_PAGE_SIZE
  let query = supabase
    .from('posts')
    .select(`${POST_COLUMNS}, comments(count)`, { count: 'exact' })
    .range(from, from + POSTS_PAGE_SIZE - 1)
  // Top ties are broken by newest first.
  if (sort === 'top') query = query.order('score', { ascending: false })
  query = query.order('created_at', { ascending: false })
  if (communityId) query = query.eq('community_id', communityId)
  if (authorId) query = query.eq('author_id', authorId)

  const { data, error, count } = await query
  if (error) throw error
  return { posts: data, totalCount: count }
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

/** Deletes one of the user's own posts (comments go with the database cascade), then its photos. */
export async function deletePost({ id, imageUrls }) {
  const { error } = await supabase.from('posts').delete().eq('id', id)
  if (error) throw error
  // The post is already gone, so a failed photo cleanup only leaves unused files behind; don't fail the delete.
  await removeImages(BUCKET, imageUrls).catch(() => {})
}

/** Uploads the photos (if any), then creates the post as the logged-in user (author_id is filled in by the database). */
export async function createPost({ communityId, type, title, body, images }) {
  const { imageUrls, uploadedUrls } = await uploadImages(BUCKET, images)
  const { data, error } = await supabase
    .from('posts')
    .insert({ community_id: communityId, type, title, body: body || null, image_urls: imageUrls })
    .select()
    .single()
  if (error) {
    // Don't leave orphaned photos in storage when the row itself is rejected.
    await removeImages(BUCKET, uploadedUrls).catch(() => {})
    throw error
  }
  return data
}
