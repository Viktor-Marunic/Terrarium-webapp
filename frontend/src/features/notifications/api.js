// Supabase queries/mutations for in-app notifications. Rows are created by database triggers
// (votes, comments, new listings, bookmarks, bag adds); the app only reads them and marks them read.
// RLS limits every query to the logged-in user's own notifications.
import { supabase } from '../../lib/supabase'

const PAGE_SIZE = 30

// actor uses the explicit foreign key name because notifications references profiles twice (recipient and actor).
const NOTIFICATION_COLUMNS =
  'id, type, read_at, created_at, post_id, listing_id, actor:profiles!notifications_actor_id_fkey(username), post:posts(title), listing:listings(title)'

/** The user's newest notifications (up to 30), newest first. */
export async function listNotifications() {
  const { data, error } = await supabase
    .from('notifications')
    .select(NOTIFICATION_COLUMNS)
    .order('created_at', { ascending: false })
    .limit(PAGE_SIZE)
  if (error) throw error
  return data
}

export async function markNotificationRead(id) {
  const { error } = await supabase.from('notifications').update({ read_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}

export async function markAllNotificationsRead() {
  const { error } = await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .is('read_at', null)
  if (error) throw error
}
