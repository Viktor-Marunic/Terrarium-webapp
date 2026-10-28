// Numbered pager under the feed (TerraSpace Figma): "Showing X of Y discussions", ← Previous, 1 2 3 … 50, Next →.
// Pages are links that only change ?page= in the URL, so other params (community, sort) are kept.
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeftIcon, ArrowRightIcon } from '@phosphor-icons/react'
import { pageNumbers } from '../../../lib/utils'

// Shape shared by every pager button; colours are separate so the current page never gets two backgrounds
// (with both, Tailwind's CSS order decides which wins, and the off-white one did).
const baseClass = 'flex h-10 min-w-10 items-center justify-center gap-1 rounded-full border px-3 text-sm font-medium transition-colors'
const buttonClass = `${baseClass} border-stone-300 bg-paper text-stone-700 hover:bg-white`
const currentClass = `${baseClass} border-forest-700 bg-forest-700 text-white hover:bg-forest-800`

/** page is 1-based; shownCount is how many posts are on this page. */
export function Pagination({ page, totalPages, shownCount, totalCount }) {
  const [searchParams] = useSearchParams()

  const searchFor = (target) => {
    const params = new URLSearchParams(searchParams)
    // Page 1 is the default, so it's left out of the URL.
    if (target === 1) params.delete('page')
    else params.set('page', target)
    const query = params.toString()
    return query ? `?${query}` : ''
  }

  return (
    <nav aria-label="Pages" className="flex flex-col items-center gap-3 pt-2">
      <p className="text-sm text-stone-500">
        Showing {shownCount} of {totalCount} {totalCount === 1 ? 'discussion' : 'discussions'}
      </p>
      {totalPages > 1 && (
        <ul className="flex flex-wrap items-center justify-center gap-2">
          {page > 1 && (
            <li>
              <Link to={{ search: searchFor(page - 1) }} className={buttonClass}>
                <ArrowLeftIcon size={16} aria-hidden="true" />
                <span className="sr-only sm:not-sr-only">Previous</span>
              </Link>
            </li>
          )}
          {pageNumbers(page, totalPages).map((number, index) =>
            number === '…' ? (
              <li key={`gap-${index}`} aria-hidden="true" className="px-1 text-stone-500">
                …
              </li>
            ) : (
              <li key={number}>
                <Link
                  to={{ search: searchFor(number) }}
                  aria-current={number === page ? 'page' : undefined}
                  aria-label={`Page ${number}`}
                  className={number === page ? currentClass : buttonClass}
                >
                  {number}
                </Link>
              </li>
            ),
          )}
          {page < totalPages && (
            <li>
              <Link to={{ search: searchFor(page + 1) }} className={buttonClass}>
                <span className="sr-only sm:not-sr-only">Next</span>
                <ArrowRightIcon size={16} aria-hidden="true" />
              </Link>
            </li>
          )}
        </ul>
      )}
    </nav>
  )
}
