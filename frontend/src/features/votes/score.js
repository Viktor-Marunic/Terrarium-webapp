// Pure vote logic shared by the vote buttons; kept free of React/Supabase so it's easy to test.
// A vote is 1 (up), -1 (down) or 0 (no vote).

/** Clicking the arrow you already chose removes your vote; otherwise you switch to the clicked arrow. */
export function nextVote(current, clicked) {
  return current === clicked ? 0 : clicked
}

/** How much the score moves when a vote changes, e.g. switching from down (-1) to up (1) adds 2. */
export function scoreDelta(current, next) {
  return next - current
}

/** The current user's vote on a post/comment row, from the embedded `votes(value)` (RLS only returns their own). */
export function myVoteOf(row) {
  return row.votes?.[0]?.value ?? 0
}
