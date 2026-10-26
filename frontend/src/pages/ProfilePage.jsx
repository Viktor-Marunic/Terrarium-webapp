// /profile — the logged-in user's own profile (layout from the TerraSpace Figma): header card, their posts,
// achievements (badges awarded by the database), log out.
import { useSession, useSignOut } from '../features/auth/hooks'
import { useProfile, useUserBadges } from '../features/profiles/hooks'
import { usePosts } from '../features/posts/hooks'
import { ProfileCard } from '../features/profiles/components/ProfileCard'
import { AchievementList } from '../features/profiles/components/AchievementList'
import { PostList } from '../features/posts/components/PostList'

export function ProfilePage() {
  const { session } = useSession()
  const userId = session?.user.id
  const profile = useProfile(userId)
  // Same query (and cache entry) as the PostList below, so the count costs no extra request.
  const myPosts = usePosts(undefined, 'new', userId)
  const badges = useUserBadges(userId)
  const signOut = useSignOut()

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <h1 className="font-display text-3xl text-forest-800">Profile</h1>

      {profile.isLoading && <p className="text-stone-500">Loading profile…</p>}
      {profile.error && <p className="text-red-600">Could not load your profile: {profile.error.message}</p>}
      {profile.data && (
        <ProfileCard
          profile={profile.data}
          postCount={myPosts.data?.length}
          badges={badges.data?.filter((b) => b.earned_at)}
        />
      )}

      <section className="space-y-3">
        <h2 className="font-display text-2xl text-forest-800">My posts</h2>
        <PostList authorId={userId} emptyText="You haven't posted anything yet." />
      </section>

      {badges.error && <p className="text-red-600">Could not load achievements: {badges.error.message}</p>}
      {badges.data && <AchievementList badges={badges.data} />}

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
