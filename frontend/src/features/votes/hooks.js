// React hook for voting.
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { castVote } from './api'

/** Mutation taking { target, id, current, next }. Refreshes every view that shows scores once the vote is saved. */
export function useVote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: castVote,
    // onSettled (not onSuccess) so a failed vote also snaps the UI back to the real numbers.
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['posts'] }),
        queryClient.invalidateQueries({ queryKey: ['post'] }),
        queryClient.invalidateQueries({ queryKey: ['comments'] }),
      ]),
  })
}
