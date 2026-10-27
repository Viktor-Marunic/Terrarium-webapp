// Photo rules and storage helpers shared by every feature with photos (marketplace listings, posts).
// Limits mirror the storage buckets (5 MB, JPG/PNG/WebP). Only api.js files call the upload/remove helpers.
import { z } from 'zod'
import { supabase } from './supabase'

export const MAX_IMAGES = 5
const MAX_IMAGE_BYTES = 5 * 1024 * 1024
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

// A photo is either a newly picked File, or (when editing) the URL string of one that's already uploaded.
// Checked with refines instead of z.union, so a bad file still shows its own message instead of "Invalid input".
export const imageSchema = z
  .custom((image) => typeof image === 'string' || image instanceof File, 'Invalid photo')
  .refine((image) => typeof image === 'string' || ACCEPTED_IMAGE_TYPES.includes(image.type), 'Photos must be JPG, PNG or WebP')
  .refine((image) => typeof image === 'string' || image.size <= MAX_IMAGE_BYTES, 'Each photo must be 5 MB or smaller')

/** Turns a public URL back into its storage path ({user_id}/{file}), which remove() needs. */
function pathFromPublicUrl(bucket, url) {
  return url.split(`/${bucket}/`)[1]
}

/** Deletes photos (by public URL) from a bucket. */
export async function removeImages(bucket, urls) {
  if (urls.length === 0) return
  const { error } = await supabase.storage.from(bucket).remove(urls.map((url) => pathFromPublicUrl(bucket, url)))
  if (error) throw error
}

/**
 * Turns a form's photo list into public URLs, in the same order: URL strings (already uploaded) are kept,
 * Files are uploaded to {user_id}/{uuid}.{ext} (the storage policy only allows the user's own folder).
 * @returns {Promise<{ imageUrls: string[], uploadedUrls: string[] }>} uploadedUrls = only the new ones, for cleanup.
 */
export async function uploadImages(bucket, images) {
  const { data: sessionData } = await supabase.auth.getSession()
  const userId = sessionData.session?.user.id
  if (!userId) throw new Error('You need to be logged in to do that')

  const imageUrls = []
  const uploadedUrls = []
  try {
    for (const image of images) {
      if (typeof image === 'string') {
        imageUrls.push(image)
        continue
      }
      const path = `${userId}/${crypto.randomUUID()}.${image.name.split('.').pop().toLowerCase()}`
      const { error } = await supabase.storage.from(bucket).upload(path, image, { contentType: image.type })
      if (error) throw error
      const url = supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl
      imageUrls.push(url)
      uploadedUrls.push(url)
    }
  } catch (error) {
    // One upload failed: don't leave the ones before it orphaned in storage.
    await removeImages(bucket, uploadedUrls).catch(() => {})
    throw error
  }
  return { imageUrls, uploadedUrls }
}
