// Decorative root system for the 404 page, in the same style as the root-shaped comment threads: earthy root
// brown, 3px strokes with gentle S-bends, side roots sweeping off the main root, and tips that taper to a point.
// It hangs from a line of soil and "grows" downward when it appears (the strokes draw themselves in), then the
// tapered tips fade in. Reduced motion: shown fully grown, no animation.
import { useRef } from 'react'
import { gsap, prefersReducedMotion, useGSAP } from '../../lib/motion'

// Each root is one path; pathLength="1" lets every stroke be drawn in with the same dash numbers, whatever its length.
const ROOTS = [
  'M120 18C116 50 126 80 118 112C112 138 122 160 117 186', // main root
  'M119 52C108 64 92 70 76 86C66 96 62 108 58 122', // left side root
  'M121 74C134 84 150 88 162 102C170 112 172 124 176 136', // right side root
  'M118 120C108 128 100 136 96 150', // short left
  'M120 134C130 142 138 148 142 162', // short right
  'M78 84C70 82 60 84 50 92', // small branch off the left root
  'M160 100C168 96 178 96 188 102', // small branch off the right root
]

// Tapered tips where the roots end, as filled teardrops pointing down (like the last reply's root tip).
const TIPS = [
  'M115.5 184C115.5 194 116.5 200 117 206C117.5 200 118.5 194 118.5 184Z',
  'M56.5 120C56 128 56 133 56.5 138C58 133 59.5 128 59.5 121Z',
  'M174.5 134C175 142 175.5 147 177 152C177.5 146 177.5 141 177.5 135Z',
  'M94.5 148C94 155 94.5 160 95 164C96.5 160 97.5 155 97.5 149Z',
  'M140.5 160C141 167 141.5 171 142.5 175C143.5 171 143.5 166 143.5 161Z',
]

export function RootsDecoration({ className = '' }) {
  const svgRef = useRef(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap
        .timeline({ delay: 0.15 })
        // Main root first, side roots following, like they grow out of it.
        .from('[data-root]', { strokeDashoffset: 1, duration: 1.1, ease: 'power2.out', stagger: 0.12 })
        .from('[data-tip]', { opacity: 0, scale: 0.4, transformOrigin: '50% 0%', duration: 0.4, ease: 'back.out(2)', stagger: 0.06 }, '-=0.5')
    },
    { scope: svgRef },
  )

  return (
    <svg ref={svgRef} aria-hidden="true" viewBox="0 0 240 210" className={`text-root ${className}`}>
      {/* The soil line the roots hang from. */}
      <path d="M20 18C60 12 100 22 140 16C170 12 200 20 220 16" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      {ROOTS.map((d) => (
        <path
          key={d}
          data-root
          d={d}
          pathLength="1"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="1"
          strokeDashoffset="0"
        />
      ))}
      {TIPS.map((d) => (
        <path key={d} data-tip d={d} fill="currentColor" />
      ))}
    </svg>
  )
}
