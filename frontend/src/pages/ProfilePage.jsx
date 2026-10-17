// /profile — the logged-in user's own profile and the log out button.
import { useSession, useSignOut } from '../features/auth/hooks'
import { useProfile } from '../features/profiles/hooks'
import { ProfileCard } from '../features/profiles/components/ProfileCard'

export function ProfilePage() {
  const { session } = useSession()
  const profile = useProfile(session?.user.id)
  const signOut = useSignOut()

  return (
    <div className="flex flex-col items-center gap-4">
      {profile.isLoading && <p className="text-stone-500">Loading profile…</p>}
      {profile.error && <p className="text-red-600">Could not load your profile: {profile.error.message}</p>}
      {profile.data && <ProfileCard profile={profile.data} email={session.user.email} />}
      <button
        type="button"
        onClick={() => signOut.mutate()}
        disabled={signOut.isPending}
        className="rounded-md border border-stone-300 bg-white px-4 py-2 text-stone-700 hover:bg-stone-50 disabled:opacity-60"
      >
        Log out
      </button>
    </div>
  )
}
