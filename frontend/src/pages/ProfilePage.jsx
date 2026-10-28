// /profile — the logged-in user's own profile (TerraSpace mockup): "Profile" + Edit profile, the profile card
// with stats, the Activity tabs (?tab=: my posts, my events, saved, listings), achievements, and log out.
// Composes several features: the stats and tab contents come from posts, marketplace, events and bookmarks.
import { useSearchParams } from 'react-router-dom'
import { useSession, useSignOut } from '../features/auth/hooks'
import { useProfile, useUserBadges } from '../features/profiles/hooks'
import { activityTabs } from '../features/profiles/activityTabs'
import { ProfileCard } from '../features/profiles/components/ProfileCard'
import { EditProfileButton } from '../features/profiles/components/EditProfileButton'
import { ActivityTabs } from '../features/profiles/components/ActivityTabs'
import { AchievementList } from '../features/profiles/components/AchievementList'
import { usePosts } from '../features/posts/hooks'
import { PostList } from '../features/posts/components/PostList'
import { useProfileListings } from '../features/marketplace/hooks'
import { ListingTiles } from '../features/marketplace/components/ListingTiles'
import { useAttendingEventCount } from '../features/events/hooks'
import { HostedEventList } from '../features/events/components/HostedEventList'
import { useBookmarkedListingIds, useSavedPostIds } from '../features/bookmarks/hooks'

/** Content of the "Saved" tab: saved posts, then saved listings. Waits for the saved ids before listing them. */
function SavedActivity() {
  const savedPostIds = useSavedPostIds()
  const savedListingIds = useBookmarkedListingIds()

  if (savedPostIds.isLoading || savedListingIds.isLoading) return <p className="text-stone-500">Loading saved items…</p>
  if (savedPostIds.error || savedListingIds.error) {
    return <p className="text-red-600">Could not load saved items: {(savedPostIds.error ?? savedListingIds.error).message}</p>
  }

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-stone-700">Posts</h3>
        <PostList ids={savedPostIds.data} emptyText="No saved posts yet. Tap the bookmark on a post to save it." />
      </section>
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-stone-700">Listings</h3>
        <ListingTiles ids={savedListingIds.data} emptyText="No saved listings yet. Tap the heart on a listing to save it." />
      </section>
    </div>
  )
}

export function ProfilePage() {
  const { session } = useSession()
  const userId = session?.user.id
  const [searchParams] = useSearchParams()
  // An unknown ?tab= (e.g. a typo) falls back to "My posts".
  const tab = activityTabs.find(({ value }) => value === searchParams.get('tab'))?.value ?? 'posts'

  const profile = useProfile(userId)
  const badges = useUserBadges(userId)
  // Same query (and cache entry) as the PostList's first page, so on the posts tab the count costs no extra request.
  const myPosts = usePosts({ authorId: userId })
  const myListings = useProfileListings({ sellerId: userId })
  const attendingCount = useAttendingEventCount(userId)
  const signOut = useSignOut()

  const earnedBadges = badges.data?.filter((badge) => badge.earned_at)
  const stats = [
    { label: 'Posts', value: myPosts.data?.totalCount },
    { label: 'Listings', value: myListings.data?.length },
    { label: 'Events', value: attendingCount.data },
    { label: 'Badges', value: earnedBadges?.length },
  ]

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <header className="flex items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-forest-800">Profile</h1>
        {profile.data && <EditProfileButton profile={profile.data} />}
      </header>

      {profile.isLoading && <p className="text-stone-500">Loading profile…</p>}
      {profile.error && <p className="text-red-600">Could not load your profile: {profile.error.message}</p>}
      {profile.data && <ProfileCard profile={profile.data} stats={stats} badges={earnedBadges} />}

      <section className="space-y-4">
        <h2 className="font-display text-2xl text-forest-800">Activity</h2>
        <ActivityTabs activeTab={tab} />
        {tab === 'posts' && <PostList authorId={userId} emptyText="You haven't posted anything yet." />}
        {tab === 'events' && <HostedEventList hostId={userId} emptyText="You haven't hosted any events yet." />}
        {tab === 'saved' && <SavedActivity />}
        {tab === 'listings' && <ListingTiles sellerId={userId} emptyText="You haven't listed anything for sale yet." />}
      </section>

      {badges.error && <p className="text-red-600">Could not load achievements: {badges.error.message}</p>}
      {badges.data && <AchievementList badges={badges.data} />}

      <button
        type="button"
        onClick={() => signOut.mutate()}
        disabled={signOut.isPending}
        className="rounded-lg bg-root-700 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-root-800 disabled:opacity-60"
      >
        {signOut.isPending ? 'Logging out…' : 'Log out'}
      </button>
    </div>
  )
}
