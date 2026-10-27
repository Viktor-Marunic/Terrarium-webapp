// React hooks for bookmarks. Also meant for the profile page's "Saved" list (useBookmarkedListingIds).
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { listBookmarkedListingIds, listSavedPostIds, setBookmark, setPostBookmark } from './api'

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

/** `data` is an array of saved post ids, newest first. */
export function useSavedPostIds() {
  return useQuery({ queryKey: ['postBookmarks'], queryFn: listSavedPostIds })
}

/** Mutation taking { postId, saved }. Updates the cached ids right away so the icon fills instantly. */
export function useSetPostBookmark() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: setPostBookmark,
    onMutate: async ({ postId, saved }) => {
      await queryClient.cancelQueries({ queryKey: ['postBookmarks'] })
      const previous = queryClient.getQueryData(['postBookmarks'])
      queryClient.setQueryData(['postBookmarks'], (ids = []) => (saved ? [postId, ...ids] : ids.filter((id) => id !== postId)))
      return { previous }
    },
    // Put the icon back the way it was if saving failed.
    onError: (_error, _variables, context) => queryClient.setQueryData(['postBookmarks'], context.previous),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['postBookmarks'] }),
  })
}
