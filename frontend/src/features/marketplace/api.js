// Supabase queries/mutations for marketplace listings and their photos (listing-images bucket).
import { supabase } from '../../lib/supabase'
import { removeImages, uploadImages } from '../../lib/images'

const BUCKET = 'listing-images'
export const LISTINGS_PAGE_SIZE = 12

// Columns every listing view needs, including the embedded seller username.
const LISTING_COLUMNS =
  'id, seller_id, title, description, price, condition, category, contact_info, image_urls, status, created_at, seller:profiles(username, avatar_url)'

/**
 * One page of active listings, newest first, optionally only one category.
 * @returns {Promise<{ listings: object[], totalCount: number }>} totalCount counts every matching listing, not just this page.
 */
export async function listListings({ category, page = 0 }) {
  const from = page * LISTINGS_PAGE_SIZE
  let query = supabase
    .from('listings')
    .select(LISTING_COLUMNS, { count: 'exact' })
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .range(from, from + LISTINGS_PAGE_SIZE - 1)
  if (category) query = query.eq('category', category)

  const { data, error, count } = await query
  if (error) throw error
  return { listings: data, totalCount: count }
}

/** One listing by id (active or sold), or null if it doesn't exist (or was deleted). */
export async function getListing(id) {
  const { data, error } = await supabase.from('listings').select(LISTING_COLUMNS).eq('id', id).maybeSingle()
  if (error) throw error
  return data
}

const removeListingImages = (urls) => removeImages(BUCKET, urls)

/** Form values → listings columns. */
function toListingRow({ title, category, condition, price, description, contactInfo }, imageUrls) {
  return { title, category, condition, price, description: description || null, contact_info: contactInfo, image_urls: imageUrls }
}

/**
 * Uploads the photos, then creates the listing as the logged-in user (seller_id is filled in by the database).
 * @param {{ images: File[], title: string, category: string, condition: string, price: number, description: string, contactInfo: string }} values
 */
export async function createListing(values) {
  const { imageUrls, uploadedUrls } = await uploadImages(BUCKET, values.images)
  const { data, error } = await supabase.from('listings').insert(toListingRow(values, imageUrls)).select().single()
  if (error) {
    // Don't leave orphaned photos in storage when the row itself is rejected.
    await removeListingImages(uploadedUrls).catch(() => {})
    throw error
  }
  return data
}

/**
 * Saves edits to one of the user's own listings (RLS rejects anyone else's). New photos are uploaded first;
 * photos the seller removed are deleted from storage only after the row is saved.
 * @param {{ id: string, previousImageUrls: string[], images: (string | File)[] } & object} values same fields as createListing
 */
export async function updateListing({ id, previousImageUrls, ...values }) {
  const { imageUrls, uploadedUrls } = await uploadImages(BUCKET, values.images)
  const { data, error } = await supabase.from('listings').update(toListingRow(values, imageUrls)).eq('id', id).select().single()
  if (error) {
    await removeListingImages(uploadedUrls).catch(() => {})
    throw error
  }
  // The listing is already saved, so a failed cleanup only leaves unused files behind; don't fail the edit.
  await removeListingImages(previousImageUrls.filter((url) => !imageUrls.includes(url))).catch(() => {})
  return data
}

/** Marks one of the user's own listings as 'sold' or back to 'active' (RLS rejects anyone else's). */
export async function setListingStatus({ id, status }) {
  const { data, error } = await supabase.from('listings').update({ status }).eq('id', id).select().single()
  if (error) throw error
  return data
}

/** Deletes one of the user's own listings, then its photos (the database can't cascade into storage). */
export async function deleteListing({ id, imageUrls }) {
  const { error } = await supabase.from('listings').delete().eq('id', id)
  if (error) throw error
  // The listing is already gone, so a failed photo cleanup only leaves unused files behind; don't fail the delete.
  await removeListingImages(imageUrls).catch(() => {})
}
