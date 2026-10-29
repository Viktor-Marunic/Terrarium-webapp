// "Achievements" section of the profile (TerraSpace mockup): one card per badge with a progress bar.
// Shows the first few, with "See all N achievements" to expand. `badges` come from useUserBadges
// (the database awards them and computes progress).
// Motion: cards rise in, and each progress bar fills from empty to the user's progress when it first appears.
import { useState } from 'react'
import { ArrowRightIcon, CheckCircleIcon } from '@phosphor-icons/react'
import { DURATION, gsap, prefersReducedMotion, useGSAP } from '../../../lib/motion'
import { useStaggerIn } from '../../../lib/useStaggerIn'
import { badgeIcon } from '../badgeIcons'

const COLLAPSED_COUNT = 4

export function AchievementList({ badges }) {
  const [showAll, setShowAll] = useState(false)
  const earnedCount = badges.filter((b) => b.earned_at).length
  const shown = showAll ? badges : badges.slice(0, COLLAPSED_COUNT)
  const listRef = useStaggerIn([showAll, badges])

  // Fill bars that haven't filled yet (the first four, then the rest after "See all").
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const bars = [...listRef.current.querySelectorAll('progress:not([data-filled])')]
      if (bars.length === 0) return
      gsap.from(bars, {
        attr: { value: 0 },
        duration: DURATION.delight,
        ease: 'ui-out',
        stagger: 0.06,
        delay: 0.1,
        onComplete: () => bars.forEach((bar) => (bar.dataset.filled = 'true')),
      })
    },
    { dependencies: [showAll, badges], scope: listRef },
  )

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-forest-800">Achievements</h2>
        <span className="rounded-full bg-sage-100 px-2.5 py-0.5 text-xs font-medium text-forest-800">
          {earnedCount} of {badges.length}
        </span>
      </div>

      <ul ref={listRef} className="space-y-3">
        {shown.map(({ id, title, description, icon, progress, goal, earned_at }) => {
          const Icon = badgeIcon(icon)
          return (
            <li key={id} className="rounded-xl border border-stone-200 bg-paper p-4">
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sage-100 text-forest-800">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-stone-900">{title}</h3>
                  <p className="text-xs text-stone-600">{description}</p>
                </div>
                {earned_at && <CheckCircleIcon size={20} className="shrink-0 text-forest-700" aria-label="Earned" />}
              </div>
              <div className="mt-3 flex items-center gap-3">
                <progress
                  value={progress}
                  max={goal}
                  aria-label={`${title} progress`}
                  className="h-1.5 flex-1 appearance-none overflow-hidden rounded-full bg-sage-100 [&::-moz-progress-bar]:bg-forest-700 [&::-webkit-progress-bar]:bg-sage-100 [&::-webkit-progress-value]:bg-forest-700"
                />
                <span className="text-xs font-medium text-stone-600 tabular-nums">
                  {progress} / {goal}
                </span>
              </div>
            </li>
          )
        })}
      </ul>

      {badges.length > COLLAPSED_COUNT && (
        <button
          type="button"
          onClick={() => setShowAll((all) => !all)}
          aria-expanded={showAll}
          className="flex items-center gap-1 text-sm font-semibold text-forest-800 hover:underline"
        >
          {showAll ? 'Show fewer' : `See all ${badges.length} achievements`}
          {!showAll && <ArrowRightIcon size={14} weight="bold" aria-hidden="true" />}
        </button>
      )}
    </section>
  )
}
