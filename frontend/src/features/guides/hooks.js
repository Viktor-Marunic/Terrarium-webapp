// React hooks for guides, likes and saves.
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createGuide, deleteGuide, getGuide, listGuides, setGuideLike, setGuideSave, updateGuide } from './api'

/** Guides, all or one category, newest first. */
export function useGuides(category) {
  return useQuery({ queryKey: ['guides', category ?? 'all'], queryFn: () => listGuides(category) })
}

/** `data` is null when the guide doesn't exist. */
export function useGuide(id) {
  return useQuery({ queryKey: ['guide', id], queryFn: () => getGuide(id) })
}

/** Shared invalidation: the guide itself and every list (counts, hearts and saves show in both). */
function useGuideMutation(mutationFn) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn,
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['guide'] }),
        queryClient.invalidateQueries({ queryKey: ['guides'] }),
      ]),
  })
}

export const useCreateGuide = () => useGuideMutation(createGuide)
/** Mutation taking { id, previousImageUrl, ...form values }. */
export const useUpdateGuide = () => useGuideMutation(updateGuide)
/** Mutation taking { id, imageUrl }. */
export const useDeleteGuide = () => useGuideMutation(deleteGuide)
/** Mutation taking { guideId, liked }. */
export const useSetGuideLike = () => useGuideMutation(setGuideLike)
/** Mutation taking { guideId, saved }. */
export const useSetGuideSave = () => useGuideMutation(setGuideSave)
