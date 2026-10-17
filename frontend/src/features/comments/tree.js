// Turns the flat comment list from the database into a tree for rendering threads.

/**
 * @param {Array<{ id: string, parent_id: string | null }>} comments flat list, oldest first
 * @returns top-level comments, each with a `replies` array (also nested), order preserved
 */
export function buildCommentTree(comments) {
  const byId = new Map(comments.map((comment) => [comment.id, { ...comment, replies: [] }]))
  const roots = []
  for (const comment of byId.values()) {
    const parent = comment.parent_id && byId.get(comment.parent_id)
    // A reply whose parent is missing is shown at the top level instead of disappearing.
    if (parent) parent.replies.push(comment)
    else roots.push(comment)
  }
  return roots
}
