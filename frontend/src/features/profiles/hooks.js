// React hooks for profile data.
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getProfile, getUserBadges, updateProfile } from './api'

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

/** Mutation taking { id, displayName, location, bio } (see updateProfile). */
export function useUpdateProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (profile) => {
      queryClient.invalidateQueries({ queryKey: ['profile', profile.id] })
      // Writing a bio can earn the "First roots" badge (the database awards it on bio updates).
      queryClient.invalidateQueries({ queryKey: ['badges', profile.id] })
    },
  })
}
