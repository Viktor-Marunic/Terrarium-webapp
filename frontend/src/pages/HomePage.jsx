// / — placeholder home that proves login works: shows the user's profile from the database.
import { useSession, useSignOut } from '../features/auth/hooks'
import { useProfile } from '../features/profiles/hooks'

export function HomePage() {
  const { session } = useSession()
  const profile = useProfile(session?.user.id)
  const signOut = useSignOut()

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 bg-stone-100 px-4">
      {profile.isLoading && <p className="text-stone-500">Loading profile…</p>}
      {profile.error && <p className="text-red-600">Could not load your profile: {profile.error.message}</p>}
      {profile.data && (
        <h1 className="text-2xl font-semibold text-emerald-800">Welcome, @{profile.data.username}</h1>
      )}
      <button
        type="button"
        onClick={() => signOut.mutate()}
        disabled={signOut.isPending}
        className="rounded-md border border-stone-300 bg-white px-4 py-2 text-stone-700 hover:bg-stone-50 disabled:opacity-60"
      >
        Log out
      </button>
    </main>
  )
}
