// /guide — how-to guides written by the community, filterable with ?category=<value>,
// plus the way into "Write a guide".
import { Link, useSearchParams } from 'react-router-dom'
import { PlusIcon } from '@phosphor-icons/react'
import { guideCategories } from '../features/guides/schemas'
import { GuideCategoryFilter } from '../features/guides/components/GuideCategoryFilter'
import { GuideList } from '../features/guides/components/GuideList'

export function GuidesPage() {
  const [searchParams] = useSearchParams()
  // An unknown category (e.g. a typo in the URL) falls back to showing everything.
  const category = guideCategories.find(({ value }) => value === searchParams.get('category'))?.value

  return (
    <div className="space-y-5">
      {/* flex-wrap: on very narrow phones the button drops under the heading instead of overflowing. */}
      <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <h1 className="font-display text-3xl text-forest-800">Guides</h1>
        <Link
          to="/guide/new"
          className="flex shrink-0 items-center gap-2 rounded-lg bg-forest-700 px-4 py-2.5 text-sm font-medium text-white transition-[background-color,scale] hover:bg-forest-800 motion-safe:active:scale-[0.97]"
        >
          <PlusIcon size={16} weight="bold" aria-hidden="true" />
          Write a guide
        </Link>
      </header>
      <GuideCategoryFilter activeCategory={category} />
      <GuideList category={category} />
    </div>
  )
}
