// React hooks for community data.
import { useQuery } from '@tanstack/react-query'
import { listCommunities } from './api'

export function useCommunities() {
  return useQuery({ queryKey: ['communities'], queryFn: listCommunities })
}
