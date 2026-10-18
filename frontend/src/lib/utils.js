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
