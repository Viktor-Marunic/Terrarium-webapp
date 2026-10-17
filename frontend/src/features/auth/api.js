// Supabase Auth calls: sign up, log in, log out and session tracking.
import { supabase } from '../../lib/supabase'

/** Logs in with email + password. Throws "Invalid login credentials" if they don't match an account. */
export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

/**
 * Creates an auth user; the on_auth_user_created trigger then creates their profile with this username.
 * Returns { session } — session is null when email confirmation is required.
 */
export async function signUp({ username, email, password }) {
  // Check first: a taken username makes the trigger fail with a vague "Database error saving new user".
  const { data: existing, error: lookupError } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .maybeSingle()
  if (lookupError) throw lookupError
  if (existing) throw new Error('That username is already taken')

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  })
  if (error) throw error
  // With email confirmation on, Supabase hides "email already registered" by returning a user with no identities.
  if (data.user && data.user.identities?.length === 0) {
    throw new Error('An account with this email already exists')
  }
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

/** Calls back with the current session right away, then on every login/logout. Returns an unsubscribe function. */
export function subscribeToSession(callback) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => callback(session))
  return () => data.subscription.unsubscribe()
}
