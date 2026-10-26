// React hooks for notifications.
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { listNotifications, markAllNotificationsRead, markNotificationRead } from './api'

/**
 * The user's newest notifications. Polls every 30 s (and refetches when the tab regains focus),
 * which is plenty for a small app and simpler than a Realtime subscription.
 */
export function useNotifications() {
  return useQuery({ queryKey: ['notifications'], queryFn: listNotifications, refetchInterval: 30_000 })
}

function useNotificationMutation(mutationFn) {
  const queryClient = useQueryClient()
  return useMutation({ mutationFn, onSettled: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }) })
}

/** Mutation taking a notification id. */
export const useMarkNotificationRead = () => useNotificationMutation(markNotificationRead)
export const useMarkAllNotificationsRead = () => useNotificationMutation(markAllNotificationsRead)
