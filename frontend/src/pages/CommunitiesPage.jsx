// /communities — one feed of posts from every community (layout from the TerraSpace Figma), filterable with ?c=<slug>
// (like Reddit's r/all + subreddits) and sortable with ?sort=top (default: newest first).
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PlusIcon } from '@phosphor-icons/react'
import { useCommunities } from '../features/communities/hooks'
import { CommunityFilter } from '../features/communities/components/CommunityFilter'
import { CreatePostForm } from '../features/posts/components/CreatePostForm'
import { PostList } from '../features/posts/components/PostList'
import { SortToggle } from '../features/posts/components/SortToggle'

export function CommunitiesPage() {
  const [searchParams] = useSearchParams()
  const activeSlug = searchParams.get('c')
  const sort = searchParams.get('sort') === 'top' ? 'top' : 'new'
  const communities = useCommunities()
  const [isWriting, setIsWriting] = useState(false)

  if (communities.isLoading) return <p className="text-stone-500">Loading communities…</p>
  if (communities.error) return <p className="text-red-600">Could not load communities: {communities.error.message}</p>

  // An unknown slug (e.g. a typo in the URL) falls back to showing everything.
  const active = communities.data.find((community) => community.slug === activeSlug)

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      {/* flex-wrap: on very narrow phones the button drops under the heading instead of overflowing. */}
      <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <h1 className="font-display text-3xl text-forest-800">{active ? active.name : 'Community'}</h1>
        {!isWriting && (
          <button
            type="button"
            onClick={() => setIsWriting(true)}
            className="flex shrink-0 items-center gap-2 rounded-lg bg-forest-700 px-4 py-2.5 text-sm font-medium text-white transition-[background-color,scale] hover:bg-forest-800 motion-safe:active:scale-[0.97]"
          >
            <PlusIcon size={18} aria-hidden="true" />
            Start a discussion
          </button>
        )}
      </header>
      {active && <p className="-mt-2 text-sm text-stone-600">{active.description}</p>}

      {isWriting && (
        <CreatePostForm communities={communities.data} defaultCommunityId={active?.id} onDone={() => setIsWriting(false)} />
      )}
      <SortToggle communitySlug={active?.slug} sort={sort} />
      <CommunityFilter communities={communities.data} activeSlug={active?.slug} sort={sort} />
      <PostList communityId={active?.id} sort={sort} />
    </div>
  )
}
