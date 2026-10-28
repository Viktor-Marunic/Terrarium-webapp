// Coloured "showcase" / "question" pill shown on the post page.
const typeStyles = {
  showcase: 'bg-emerald-100 text-emerald-800',
  question: 'bg-amber-100 text-amber-800',
}

export function PostTypeBadge({ type }) {
  return <span className={`rounded-full px-2 py-0.5 font-medium capitalize ${typeStyles[type]}`}>{type}</span>
}
