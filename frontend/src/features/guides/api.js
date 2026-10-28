// Supabase queries/mutations for guides, their likes (the heart) and saves (guide_bookmarks), and cover photos.
import { supabase } from '../../lib/supabase'
import { removeImages, uploadImages } from '../../lib/images'

const BUCKET = 'guide-images'

// Columns every guide view needs. The author link names its foreign key: guides also reach profiles through
// guide_likes and guide_bookmarks, which makes a plain profiles(...) embed ambiguous (PGRST201).
// my_like / my_save: RLS only returns the viewer's own like/save row, so a non-empty array means "I liked/saved it".
const GUIDE_COLUMNS =
  'id, author_id, category, title, body, image_url, like_count, save_count, created_at, author:profiles!guides_author_id_fkey(username, avatar_url), my_like:guide_likes(user_id), my_save:guide_bookmarks(user_id)'

/** Every guide (or one category), newest first. */
export async function listGuides(category) {
  let query = supabase.from('guides').select(GUIDE_COLUMNS).order('created_at', { ascending: false })
  if (category) query = query.eq('category', category)

  const { data, error } = await query
  if (error) throw error
  return data
}

/** One guide, or null if it doesn't exist. */
export async function getGuide(id) {
  const { data, error } = await supabase.from('guides').select(GUIDE_COLUMNS).eq('id', id).maybeSingle()
  if (error) throw error
  return data
}

/** Uploads the cover photo if it's a new File; returns { imageUrl, uploadedUrl } (uploadedUrl only for cleanup). */
async function saveCoverPhoto(image) {
  if (!(image instanceof File)) return { imageUrl: image, uploadedUrl: null }
  const { imageUrls } = await uploadImages(BUCKET, [image])
  return { imageUrl: imageUrls[0], uploadedUrl: imageUrls[0] }
}

/** Uploads the photo (if any), then creates the guide as the logged-in user (author_id is filled in by the database). */
export async function createGuide({ image, category, title, body }) {
  const { imageUrl, uploadedUrl } = await saveCoverPhoto(image)
  const { data, error } = await supabase
    .from('guides')
    .insert({ category, title, body, image_url: imageUrl })
    .select()
    .single()
  if (error) {
    if (uploadedUrl) await removeImages(BUCKET, [uploadedUrl]).catch(() => {})
    throw error
  }
  return data
}

/**
 * Saves edits to the author's own guide (RLS rejects anyone else's). A replaced or removed photo is
 * deleted from storage only after the row is saved.
 * @param {{ id: string, previousImageUrl: string | null, image: File | string | null, category: string, title: string, body: string }} values
 */
export async function updateGuide({ id, previousImageUrl, image, category, title, body }) {
  const { imageUrl, uploadedUrl } = await saveCoverPhoto(image)
  const { data, error } = await supabase
    .from('guides')
    .update({ category, title, body, image_url: imageUrl })
    .eq('id', id)
    .select()
    .single()
  if (error) {
    if (uploadedUrl) await removeImages(BUCKET, [uploadedUrl]).catch(() => {})
    throw error
  }
  if (previousImageUrl && previousImageUrl !== imageUrl) await removeImages(BUCKET, [previousImageUrl]).catch(() => {})
  return data
}

/** Deletes the author's own guide (likes and saves go with it via the cascade), then its photo. */
export async function deleteGuide({ id, imageUrl }) {
  const { error } = await supabase.from('guides').delete().eq('id', id)
  if (error) throw error
  if (imageUrl) await removeImages(BUCKET, [imageUrl]).catch(() => {})
}

/** Adds or removes the user's row in guide_likes / guide_bookmarks (user_id is filled in by the database). */
async function toggleRow(table, guideId, on) {
  const rows = supabase.from(table)
  const { error } = on ? await rows.insert({ guide_id: guideId }) : await rows.delete().eq('guide_id', guideId)
  // 23505 = already there (e.g. a double click); the end state is what the user wanted.
  if (error && error.code !== '23505') throw error
}

/** Likes or un-likes a guide. The database keeps like_count in sync. */
export const setGuideLike = ({ guideId, liked }) => toggleRow('guide_likes', guideId, liked)

/** Saves or un-saves a guide. The database keeps save_count in sync. */
export const setGuideSave = ({ guideId, saved }) => toggleRow('guide_bookmarks', guideId, saved)
