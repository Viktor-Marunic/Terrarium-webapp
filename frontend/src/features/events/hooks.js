// React hooks for events and RSVPs.
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  countAttendingEvents,
  countHostedEvents,
  createEvent,
  deleteEvent,
  getEvent,
  joinEvent,
  leaveEvent,
  listEvents,
  updateEvent,
} from './api'

/** Upcoming events, all or one type. */
export function useEvents(type) {
  return useQuery({ queryKey: ['events', type ?? 'all'], queryFn: () => listEvents(type) })
}

/** `data` is null when the event doesn't exist. */
export function useEvent(id) {
  return useQuery({ queryKey: ['event', id], queryFn: () => getEvent(id) })
}

/** Number of events a user has hosted; waits until the host id is known. */
export function useHostedEventCount(hostId) {
  return useQuery({ queryKey: ['hosted-events', hostId], queryFn: () => countHostedEvents(hostId), enabled: Boolean(hostId) })
}

/** Number of events a user is going to (profile stats). Keyed under 'events' so RSVPs and cancels refresh it. */
export function useAttendingEventCount(userId) {
  return useQuery({
    queryKey: ['events', 'attending', userId],
    queryFn: () => countAttendingEvents(userId),
    enabled: Boolean(userId),
  })
}

/** Shared invalidation: the event itself, every list (going counts), and host counts. */
function useEventMutation(mutationFn) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn,
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['event'] }),
        queryClient.invalidateQueries({ queryKey: ['events'] }),
        queryClient.invalidateQueries({ queryKey: ['hosted-events'] }),
      ]),
  })
}

export const useCreateEvent = () => useEventMutation(createEvent)
/** Mutation taking { id, previousImageUrl, ...form values }. */
export const useUpdateEvent = () => useEventMutation(updateEvent)
/** Mutation taking { id, imageUrl }. */
export const useDeleteEvent = () => useEventMutation(deleteEvent)
/** Mutation taking an event id. */
export const useJoinEvent = () => useEventMutation(joinEvent)
/** Mutation taking an event id. */
export const useLeaveEvent = () => useEventMutation(leaveEvent)
