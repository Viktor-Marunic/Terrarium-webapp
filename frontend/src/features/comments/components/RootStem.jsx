// A straight stretch of a comment thread's root, drawn with a gentle S-bend so it looks grown rather than ruled.
// The SVG stretches to whatever height its className gives it (preserveAspectRatio="none"), while
// non-scaling-stroke keeps the line 3px thick. Both ends sit on the centre line, so stems join up seamlessly.
export function RootStem({ className }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 8 100" preserveAspectRatio="none" className={`absolute w-2 text-root ${className}`}>
      <path d="M4 0C1.5 30 6.5 70 4 100" fill="none" stroke="currentColor" strokeWidth="3" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}
