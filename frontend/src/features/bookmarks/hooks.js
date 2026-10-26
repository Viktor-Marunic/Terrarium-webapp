// React hooks for bookmarks. Also meant for the profile page's "Saved" list (useBookmarkedListingIds).
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { listBookmarkedListingIds, setBookmark } from './api'

/** `data` is an array of saved listing ids, newest first. */
export function useBookmarkedListingIds() {
  return useQuery({ queryKey: ['bookmarks'], queryFn: listBookmarkedListingIds })
}

/** Mutation taking { listingId, saved }. Updates the cached ids right away so the heart fills instantly. */
export function useSetBookmark() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: setBookmark,
    onMutate: async ({ listingId, saved }) => {
      await queryClient.cancelQueries({ queryKey: ['bookmarks'] })
      const previous = queryClient.getQueryData(['bookmarks'])
      queryClient.setQueryData(['bookmarks'], (ids = []) =>
        saved ? [listingId, ...ids] : ids.filter((id) => id !== listingId),
      )
      return { previous }
    },
    // Put the heart back the way it was if saving failed.
    onError: (_error, _variables, context) => queryClient.setQueryData(['bookmarks'], context.previous),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['bookmarks'] }),
  })
}
