// React hooks for marketplace listings.
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { LISTINGS_PAGE_SIZE, createListing, deleteListing, getListing, listListings, setListingStatus } from './api'

/**
 * Active listings, all or one category, loaded a page at a time ("Load more listings").
 * `data.pages` is an array of { listings, totalCount }.
 */
export function useListings(category) {
  return useInfiniteQuery({
    queryKey: ['listings', category ?? 'all'],
    queryFn: ({ pageParam }) => listListings({ category, page: pageParam }),
    initialPageParam: 0,
    // No next page once a page comes back short.
    getNextPageParam: (lastPage, allPages) =>
      lastPage.listings.length === LISTINGS_PAGE_SIZE ? allPages.length : undefined,
  })
}

/** `data` is null when the listing doesn't exist. */
export function useListing(id) {
  return useQuery({ queryKey: ['listing', id], queryFn: () => getListing(id) })
}

export function useCreateListing() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createListing,
    // Refetch every grid (all + each category) so the new listing shows up wherever the user looks.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['listings'] }),
  })
}

export function useSetListingStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: setListingStatus,
    onSuccess: (listing) => {
      queryClient.invalidateQueries({ queryKey: ['listing', listing.id] })
      // Sold listings drop out of the grid (and come back if marked available again).
      queryClient.invalidateQueries({ queryKey: ['listings'] })
    },
  })
}

export function useDeleteListing() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteListing,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['listings'] }),
  })
}
