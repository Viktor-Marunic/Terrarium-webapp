// React hooks for profile data.
import { useQuery } from '@tanstack/react-query'
import { getProfile, getUserBadges } from './api'

/** Loads a profile by user id; waits until an id is available. */
export function useProfile(id) {
  return useQuery({
    queryKey: ['profile', id],
    queryFn: () => getProfile(id),
    enabled: Boolean(id),
  })
}

/** A user's badges with progress (see getUserBadges); waits until an id is available. */
export function useUserBadges(userId) {
  return useQuery({
    queryKey: ['badges', userId],
    queryFn: () => getUserBadges(userId),
    enabled: Boolean(userId),
  })
}
