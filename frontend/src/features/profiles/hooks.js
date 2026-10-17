// React hooks for profile data.
import { useQuery } from '@tanstack/react-query'
import { getProfile } from './api'

/** Loads a profile by user id; waits until an id is available. */
export function useProfile(id) {
  return useQuery({
    queryKey: ['profile', id],
    queryFn: () => getProfile(id),
    enabled: Boolean(id),
  })
}
