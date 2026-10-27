// Small helpers shared by more than one feature.

/**
 * Link to the communities feed with an optional community filter and sort, e.g. "/communities?c=moss&sort=top".
 * 'new' is the default sort, so it's left out of the URL.
 */
export function feedPath(communitySlug, sort) {
  const params = new URLSearchParams()
  if (communitySlug) params.set('c', communitySlug)
  if (sort === 'top') params.set('sort', 'top')
  const query = params.toString()
  return query ? `/communities?${query}` : '/communities'
}

/**
 * Page numbers for a pager, with '…' for skipped ranges: always the first, last, current and its neighbours.
 * pageNumbers(1, 50) → [1, 2, '…', 50]; pageNumbers(5, 9) → [1, '…', 4, 5, 6, '…', 9]. Pages start at 1.
 */
export function pageNumbers(current, total) {
  const wanted = [...new Set([1, current - 1, current, current + 1, total])]
    .filter((page) => page >= 1 && page <= total)
    .sort((a, b) => a - b)
  const result = []
  for (const page of wanted) {
    const previous = result.at(-1)
    // A gap of exactly one page shows that page; '…' would take the same space and hide it.
    if (previous !== undefined && page - previous === 2) result.push(previous + 1)
    else if (previous !== undefined && page - previous > 2) result.push('…')
    result.push(page)
  }
  return result
}
