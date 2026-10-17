// React hooks for auth; components use these instead of calling api.js directly.
import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { signIn, signOut, signUp, subscribeToSession } from './api'

/** Current Supabase session. `session` is undefined while loading, null when logged out. */
export function useSession() {
  const [session, setSession] = useState(undefined)
  useEffect(() => subscribeToSession(setSession), [])
  return { session, isLoading: session === undefined }
}

export function useSignIn() {
  return useMutation({ mutationFn: signIn })
}

export function useSignUp() {
  return useMutation({ mutationFn: signUp })
}

export function useSignOut() {
  const queryClient = useQueryClient()
  // Drop cached data so the next user never sees the previous user's data.
  return useMutation({ mutationFn: signOut, onSuccess: () => queryClient.clear() })
}
