// A number that counts up from 0 the first time it's known (profile stats). Later changes (a refetch after
// posting, say) just show the new number: counting up again on every refetch would be noise.
// Shows "–" while the value is still loading.
import { useRef } from 'react'
import { countUp, useGSAP } from '../../../lib/motion'

export function CountUp({ value }) {
  const numberRef = useRef(null)
  const hasCounted = useRef(false)

  useGSAP(
    () => {
      if (typeof value !== 'number') return
      if (hasCounted.current) {
        numberRef.current.textContent = value
        return
      }
      countUp(numberRef.current, value)
      hasCounted.current = true
    },
    { dependencies: [value] },
  )

  return <span ref={numberRef}>{value ?? '–'}</span>
}
