// Supabase queries/mutations for events, RSVPs (event_attendees) and event photos (event-images bucket).
import { supabase } from '../../lib/supabase'

const BUCKET = 'event-images'

// Columns every event view needs, including the host's username and avatar.
// The host link names its foreign key: events also reach profiles through event_attendees, and a plain
// profiles(...) embed becomes ambiguous (PGRST201) as soon as Supabase treats such a table as a many-to-many link.
const EVENT_COLUMNS =
  'id, host_id, type, title, description, starts_at, ends_at, place, address, price, capacity, image_url, created_at, host:profiles!events_host_id_fkey(username, avatar_url)'

/**
 * Upcoming and ongoing events (not yet ended), soonest first, optionally one type.
 * Each event includes going: [{ count }] (number of RSVPs).
 */
export async function listEvents(type) {
  let query = supabase
    .from('events')
    .select(`${EVENT_COLUMNS}, going:event_attendees(count)`)
    .gte('ends_at', new Date().toISOString())
    .order('starts_at')
  if (type) query = query.eq('type', type)

  const { data, error } = await query
  if (error) throw error
  return data
}

/** One event with everyone going ({ user_id, profile: { username, avatar_url } }), or null if it doesn't exist. */
export async function getEvent(id) {
  const { data, error } = await supabase
    .from('events')
    .select(`${EVENT_COLUMNS}, attendees:event_attendees(user_id, profile:profiles(username, avatar_url))`)
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return data
}

/** How many events a user has said "I'm going" to (all time), for the profile stats. Counted in the database. */
export async function countAttendingEvents(userId) {
  const { count, error } = await supabase
    .from('event_attendees')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
  if (error) throw error
  return count
}

/** How many events a user has hosted (all time), for "Hosted 6 events" on the host card. Counted in the database. */
export async function countHostedEvents(hostId) {
  const { count, error } = await supabase.from('events').select('id', { count: 'exact', head: true }).eq('host_id', hostId)
  if (error) throw error
  return count
}

/** Uploads a photo to {user_id}/{uuid}.{ext} (the storage policy only allows the user's own folder); returns its public URL. */
async function uploadEventImage(file) {
  const { data: sessionData } = await supabase.auth.getSession()
  const userId = sessionData.session?.user.id
  if (!userId) throw new Error('You need to be logged in to do that')

  const path = `${userId}/${crypto.randomUUID()}.${file.name.split('.').pop().toLowerCase()}`
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type })
  if (error) throw error
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}

async function removeEventImage(url) {
  if (!url) return
  const { error } = await supabase.storage.from(BUCKET).remove([url.split(`/${BUCKET}/`)[1]])
  if (error) throw error
}

/** Form values → events columns. Date + times are read in the user's own time zone. */
function toEventRow({ type, title, description, date, startTime, endTime, place, address, price, capacity }, imageUrl) {
  return {
    type,
    title,
    description: description || null,
    starts_at: new Date(`${date}T${startTime}`).toISOString(),
    ends_at: new Date(`${date}T${endTime}`).toISOString(),
    place,
    address: address || null,
    price,
    capacity: Number.isNaN(capacity) ? null : capacity,
    image_url: imageUrl,
  }
}

/** Uploads the photo (if any), then creates the event as the logged-in user (host_id is filled in by the database). */
export async function createEvent(values) {
  const imageUrl = values.image instanceof File ? await uploadEventImage(values.image) : null
  const { data, error } = await supabase.from('events').insert(toEventRow(values, imageUrl)).select().single()
  if (error) {
    await removeEventImage(imageUrl).catch(() => {})
    throw error
  }
  return data
}

/**
 * Saves edits to one of the host's own events (RLS rejects anyone else's). A replaced or removed photo is
 * deleted from storage only after the row is saved.
 * @param {{ id: string, previousImageUrl: string | null } & object} values same fields as createEvent
 */
export async function updateEvent({ id, previousImageUrl, ...values }) {
  const imageUrl = values.image instanceof File ? await uploadEventImage(values.image) : values.image
  const { data, error } = await supabase.from('events').update(toEventRow(values, imageUrl)).eq('id', id).select().single()
  if (error) {
    if (values.image instanceof File) await removeEventImage(imageUrl).catch(() => {})
    throw error
  }
  if (previousImageUrl && previousImageUrl !== imageUrl) await removeEventImage(previousImageUrl).catch(() => {})
  return data
}

/** Deletes one of the host's own events (RSVPs go with it via the cascade), then its photo. */
export async function deleteEvent({ id, imageUrl }) {
  const { error } = await supabase.from('events').delete().eq('id', id)
  if (error) throw error
  await removeEventImage(imageUrl).catch(() => {})
}

/** RSVP "I'm going" (user_id is filled in by the database). The database refuses full or finished events. */
export async function joinEvent(eventId) {
  const { error } = await supabase.from('event_attendees').insert({ event_id: eventId })
  // 23505 = already going; the end state is what the user wanted.
  if (error && error.code !== '23505') throw error
}

/** Cancels the user's own RSVP (RLS limits the delete to their own row). */
export async function leaveEvent(eventId) {
  const { error } = await supabase.from('event_attendees').delete().eq('event_id', eventId)
  if (error) throw error
}
