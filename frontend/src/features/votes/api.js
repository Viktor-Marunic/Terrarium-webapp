// Supabase calls for voting. The database updates the post/comment score itself (on_vote_change trigger).
import { supabase } from '../../lib/supabase'

/**
 * Changes the logged-in user's vote on a post or comment.
 * @param {{ target: 'post' | 'comment', id: string, current: -1 | 0 | 1, next: -1 | 0 | 1 }} vote
 * `current` decides insert vs update vs delete. Filters only need the target id: RLS limits rows to the user's own vote.
 */
export async function castVote({ target, id, current, next }) {
  const column = target === 'post' ? 'post_id' : 'comment_id'
  const votes = supabase.from('votes')

  let result
  if (next === 0) result = await votes.delete().eq(column, id)
  else if (current === 0) result = await votes.insert({ [column]: id, value: next })
  // Upsert isn't used: it would also try to write user_id/post_id, which only `value` is allowed to change.
  else result = await votes.update({ value: next }).eq(column, id)

  if (result.error) throw result.error
}
