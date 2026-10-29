// Wrapper that fades and lifts its content in when it appears: errors, revealed info, swapped button labels.
// To replay on a change (e.g. "Add to bag" → "Item in cart"), give it a `key` that changes with the content.
// The lift is a transform, which inline elements ignore: give it a display class (block, inline-block, flex…).
import { useRef } from 'react'
import { fadeIn, useGSAP } from '../../lib/motion'

export function FadeIn({ as: Element = 'span', className = 'inline-block', children, ...props }) {
  const ref = useRef(null)
  useGSAP(() => fadeIn(ref.current), { scope: ref })

  return (
    <Element ref={ref} className={className} {...props}>
      {children}
    </Element>
  )
}
