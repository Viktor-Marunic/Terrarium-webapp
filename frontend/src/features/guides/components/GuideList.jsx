// Guides (all, or one category) with loading, error and empty states. One column on phones, two from md up.
import { useGuides } from '../hooks'
import { GuideCard } from './GuideCard'

export function GuideList({ category }) {
  const guides = useGuides(category)

  if (guides.isLoading) return <p className="text-stone-500">Loading guides…</p>
  if (guides.error) return <p className="text-red-600">Could not load guides: {guides.error.message}</p>
  if (guides.data.length === 0) {
    return <p className="text-stone-500">No guides here yet. Why not write the first one?</p>
  }

  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {guides.data.map((guide) => (
        <li key={guide.id} className="min-w-0">
          <GuideCard guide={guide} />
        </li>
      ))}
    </ul>
  )
}
