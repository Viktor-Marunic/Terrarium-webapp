// /communities — one feed of posts from every community, filterable with ?c=<slug> (like Reddit's r/all + subreddits).
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useCommunities } from '../features/communities/hooks'
import { CommunityFilter } from '../features/communities/components/CommunityFilter'
import { CreatePostForm } from '../features/posts/components/CreatePostForm'
import { PostList } from '../features/posts/components/PostList'

export function CommunitiesPage() {
  const [searchParams] = useSearchParams()
  const activeSlug = searchParams.get('c')
  const communities = useCommunities()
  const [isWriting, setIsWriting] = useState(false)

  if (communities.isLoading) return <p className="text-stone-500">Loading communities…</p>
  if (communities.error) return <p className="text-red-600">Could not load communities: {communities.error.message}</p>

  // An unknown slug (e.g. a typo in the URL) falls back to showing everything.
  const active = communities.data.find((community) => community.slug === activeSlug)

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <header>
        <h1 className="text-xl font-semibold text-stone-800">{active ? active.name : 'Communities'}</h1>
        <p className="text-sm text-stone-600">{active ? active.description : 'Latest posts from every community.'}</p>
      </header>
      <CommunityFilter communities={communities.data} activeSlug={active?.slug} />
      {isWriting ? (
        <CreatePostForm
          communities={communities.data}
          defaultCommunityId={active?.id}
          onDone={() => setIsWriting(false)}
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsWriting(true)}
          className="w-full rounded-md bg-emerald-700 py-2 font-medium text-white hover:bg-emerald-800"
        >
          New post
        </button>
      )}
      <PostList communityId={active?.id} />
    </div>
  )
}
